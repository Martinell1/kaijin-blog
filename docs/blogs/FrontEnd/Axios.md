---
title: 如何实现Axios
date: '2022-04-10 22:26:50'
categories:
 - FrontEnd
tags:
 - JS
 - Axios
 - TS
---

## 项目入口

首先我们找到src目录下的index.ts文件，这通常是项目的入口

```typescript
import axios from './axios'
export * from './types'
export default axios
```

在这个文件中,我们导入了当前目录下的axios文件并导出，因此我们找到该axios.ts文件

```typescript
//定义创建axios的方法
function createInstance(config: AxiosRequestConfig): AxiosStatic {
  //根据传入的参数调用Axios的构造方法，返回一个实例
  const context = new Axios(config)
  /**
   * 最终我们需要的是axios上的request方法
   * 通过bind函数将request的this值绑定定为context
   * 返回值是绑定this值后的request方法
   */
  const instance = Axios.prototype.request.bind(context)
  /**
   * context上有defaults和interceptors两个属性
   * 将其一一赋值给instance
   */
  extend(instance, context)
  return instance as AxiosStatic
}

//调用上面的方法，拿到一个axios实例
const axios = createInstance(defaults)

//为axios增强 create方法
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

//为axios增强 取消功能
axios.CancelToken = CancelToken
axios.Cancel = Cancel
axios.isCancel = isCancel

//为axios增强 并发功能
axios.all = function all(promises) {
  return Promise.all(promises)
}

axios.spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr)
  }
}

//为axios增强 暴露Axios构造函数
axios.Axios = Axios

export default axios
```

上述代码主要可分为两块，即axios的创建和增强。

## Axios类

我们首先来看Axios的构造函数如何

```typescript
export default class Axios {
  //defaults axios的默认配置，如默认发送get请求
  defaults: AxiosRequestConfig
  //拦截器 包括请求拦截器和相应拦截器
  interceptors: Interceptors

  //构造函数
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }

  /**
   * @param url 请求的地址
   * @param config 可选的自定义配置
   * @returns 返回一个promise
   */
  request(url: any, config?: any): AxiosPromise {
    //判断是否有传入url
    if (typeof url === 'string') {
      //初始化config
      if (!config) {
        config = {}
      }
      config.url = url
    } else {
      //url不是string，说明没有传入url，该参数为config
      config = url
    }

    //调用mergeConfig合并默认配置和传入的配置
    config = mergeConfig(this.defaults, config)

    //拦截器组成的数组
    const chain: PromiseChain<any>[] = [
      {
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]

    //遍历请求拦截器
    //请求拦截器后插入的优先执行
    this.interceptors.request.forEach(interceptor => {
      chain.unshift(interceptor)
    })

    //遍历响应拦截器
    //响应拦截器先插入的优先执行
    this.interceptors.response.forEach(interceptor => {
      chain.push(interceptor)
    })

    //对config进行层层包装
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
  }

  //get别名方法，使用get发送请求，下同
  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('get', url, config)
  }

  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('delete', url, config)
  }

  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('head', url, config)
  }

  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithoutData('options', url, config)
  }

  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('post', url, data, config)
  }

  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('put', url, data, config)
  }

  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
    return this._requestMethodWithData('patch', url, data, config)
  }

  //根据传入的config获取我们将请求的地址，不发送
  getUri(config?: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config)
    return transformURL(config)
  }

  //不携带data的请求，如get,delete,head,options
  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }

  //携带data的请求，如post,put,patch
  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}

```

在这段代码这中，我们发现axios上的别名方法如get，post等本质上都是request方法，并且我们大致了解axios是如何实现用户自己配置config的。

当然，这段代码中有两个重要的方法我们还没有深入了解，一个是`mergeConfig`方法，顾名思义，该方法帮助我们实现默认配置和自定义配置的合并，但我们目前仍不知道该方法的细节，另一个方法是`dispatchRequest`，我们发现别名方法的本质是request，但request方法是如何实现发送请求的呢？











