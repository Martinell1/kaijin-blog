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

    //链式操作
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

当然，这段代码中有两个重要的方法我们还没有深入了解，一个是`mergeConfig`方法，顾名思义，该方法帮助我们实现默认配置和自定义配置的合并，

另一个方法是`dispatchRequest`，它用来调度我们的请求。

## mergeConfig

```typescript
const strats = Object.create(null)

function defaultStrat(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Strat(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') return val2
}

function deepMergeStrat(val1: any, val2: any): any {
  //按顺序执行，优先使用config2
  if (isPlainObject(val2)) {
    //自定义配置的headers,auth为对象时
    //将其打平并拷贝
    return deepMerge(val1, val2)
  } else if (typeof val2 !== 'undefined') {
    return val2
  } else if (isPlainObject(val1)) {
    return deepMerge(val1)
  } else if (typeof val1 === 'undefined') {
    return val1
  }
}

//以下属性使用fromVal2Strat
const stratKeysFromVal2 = ['url', 'params', 'data']

stratKeysFromVal2.forEach(key => {
  strats[key] = fromVal2Strat
})

//以下属性使用deepMergeStrat
const stratKeysFromDeepMerge = ['headers', 'auth']
stratKeysFromDeepMerge.forEach(key => {
  strats[key] = deepMergeStrat
})

/**
 * 使用策略模式 合并config
 * @param config1 //默认配置
 * @param config2 //自定义配置
 * @returns 
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  //自定义配置优先
  for (const key in config2) {
    mergeField(key)
  }

  //自定义配置上没有的，使用默认配置
  for (const key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  //不同的属性使用不同的合并策略
  function mergeField(key: string): void {
    const strat = strats[key] || defaultStrat
    config[key] = strat(config1[key], config2![key])
  }

  //返回最终的config
  return config
}
```

## dispatchRequest

```typescript
//调度请求
export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  //加工config
  processConfig(config)

  throwIfCancellationRequested(config)
  //发送请求
  return xhr(config).then(res => {
    //响应结果处理
    return transformResponseData(res)
  })
}

//加工config
function processConfig(config: AxiosRequestConfig): void {
  //转换url
  config.url = transformURL(config)
  //转换data
  config.data = transform(config.data, config.headers, config.transformRequest)
  //处理headers
  config.headers = flattenHeaders(config.headers, config.method!)
}

//转换url
export function transformURL(config: AxiosRequestConfig) {
  //取到config中的url,params,paramsSerizlizer,baseURL
  const { params, paramsSerizlizer, baseURL } = config
  let { url } = config
  //判断用户是否设置了baseURL
  //且用户请求的路径不为绝对路径
  if (baseURL && !isAbsoluteURL(url!)) {
    //将baseURL和相对路径url进行进阶
    url = combineURL(baseURL, url)
  }
  //对url进行处理，包括将params拼接到url上，url的序列化等
  return buildURL(url!, params, paramsSerizlizer)
}

//转换响应数据
function transformResponseData(res: AxiosResponse): AxiosResponse {
  //执行转换方法
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
```

在这段代码中，对发送请求的几个重要参数url，data，headers和响应数据response进行了处理，以符合我们预期的格式。

同时，我们通过xhr方法方法发送请求。

### xhr

```typescript
export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    //解构config
    const {
      url,
      method = 'get',
      data = null,
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      auth,
      validateStatus
    } = config

    //准备发送xhr请求
    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    //配置request
    configureRequest()

    //添加事件
    addEvents()

    processHeaders()

    processCancel()

    request.send(data)

    //设置响应类型，过期时间，withCredentials
    function configureRequest(): void {
      if (responseType) {
        request.responseType = responseType
      }

      if (timeout) {
        request.timeout = timeout
      }

      if (withCredentials) {
        request.withCredentials = withCredentials
      }
    }

    //添加事件
    function addEvents(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4) {
          return
        }

        if (request.status === 0) {
          return
        }
        
        //解析响应头
        const responseHeaders = parseHeaders(request.getAllResponseHeaders())
        //根据用户自定义的responseType确定data类型
        const responseData = responseType !== 'text' ? request.response : request.responseText
        //封装响应数据
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        }
        //处理response
        handleResponse(response)
      }

      //request上挂载网络错误
      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      //request上挂载超时错误
      request.ontimeout = function handleTimeout() {
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }
    }

    //加工headers
    function processHeaders(): void {
      //data为FormData类型，不需要添加Content-Type
      if (isFormData(data)) {
        delete headers['Content-Type']
      }

      if (auth) {
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password)
      }

      Object.keys(headers).forEach(name => {
        // 如果 data 为 null，headers 的 content-type 属性没有意义
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          //设置请求头
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    //处理response
    function handleResponse(response: AxiosResponse): void {
      //判断是否是通过状态码
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
```

简述流程

![](https://s2.loli.net/2022/04/13/cgpydnPwqbxiBYM.jpg)





