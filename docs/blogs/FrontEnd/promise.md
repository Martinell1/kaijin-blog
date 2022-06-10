---
title: 实现一个Promise
date: '2022-06-08 20:32:57'
categories:
 - FrontEnd
tags:
 - JS
 - Promise
---



首先我们给出三个连接

[Promises/A+ (promisesaplus.com)](https://promisesaplus.com/#notes)

[promises-aplus/promises-tests: Compliances tests for Promises/A+ (github.com)](https://github.com/promises-aplus/promises-tests)

[[译\]Promise/A+ 规范 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/143204897)

## 搭建环境

```shell
npm -y init

npm install promises-aplus-tests -g
```

```js
//新建MyPromise.js文件

//添加以下代码
MyPromise.defer = MyPromise.deferred = function () {
	let result = {}
	result.promise = new MyPromise((resolve, reject) => {
		result.resolve = resolve
		result.reject = reject
	})
	return result
}
```

```json
//修改package.json文件
"scripts": {
    "test": "promises-aplus-tests MyPromise"
},
```

```shell
//执行测试用例
npm test
```

## 实现一个Promise

根据`规范2.1`，我们需要定义三个状态

```js
const PROMISE_STATE = {
	PENDING: "pending",
	FULFILLED: "fulfilled",
	REJECTED: "rejected",
}
```

根据`1`中的描述中，我们大概能推测出`promise`大概有以下结构

```js
class MyPromise {
	constructor() {
		this.state = PROMISE_STATE.PENDING
		this.value = undefined
		this.reason = undefined
	}
}
```

```js
let p1 = new Promise((resolve, reject) => {
	resolve("成功")
	reject("失败")
})

console.log(p1) //Promise { '成功' }
```

在日常的使用中，我们通常需要给`Promise`传入一个执行器函数，该函数有以下几个特点：

1. 接收两个参数，分别为`resolve`和`reject`
2. `resovle`和`reject`只有前面一个执行，即只能改变一次`promise`的状态。

据此，再配合规范`2.1`的内容，我们可以填充以下代码

```js
class MyPromise {
    constructor(executor) {
        this.state = PROMISE_STATE.PENDING
        this.value = undefined
        this.reason = undefined
    }
    const resolve = (value) => {
        if (this.state !== PROMISE_STATE.PENDING) return
        this.state = PROMISE_STATE.FULFILLED
        this.value = value
    }
    const reject = (reason) => {
        if (this.state !== PROMISE_STATE.PENDING) return
        this.state = PROMISE_STATE.REJECTED
        this.reason = reason
    }
    try{
        executor(resolve, reject)
    }catch(e){
        reject(e)
    }
}
```

最后我们需要在`excutor`执行时用`try-catch`包裹，当发现错误时作为`reject`的`reason`

## then

根据规范`2.2`，我们需要给`promise`提供一个`then`方法，并且接收两个参数`onFulfilled`和`onRejected`

```js
class MyPromise {
    //...
    then(onFulfilled, onRejected) {

    }
}
```

同时，按照规范`2.2.1`，我们应填充以下内容

```js
class MyPromise {
    //...
    then(onFulfilled, onRejected) {
        onFulfilled =
            typeof onFulfilled === "function" ? onFulfilled : (value) => value
        onRejected =
            typeof onRejected === "function"
            ? onRejected
        : (reason) => {
            throw reason
        }
    }
}
```

再根据规范`2.2.2`和`2.2.3`，`onFulfilled`和`onRejected`如果是一个函数，则分别在`promise``resolve`和`reject`之后被调用，即

```js
class MyPromise {
    //...
    then(onFulfilled, onRejected) {
        onFulfilled =
            typeof onFulfilled === "function" ? onFulfilled : (value) => value
        onRejected =
            typeof onRejected === "function"
            ? onRejected
        : (reason) => {
            throw reason
        }
        if (this.state === PROMISE_STATE.FULFILLED) {
            onFulfilled(this.value)
        } 

        if (this.state === PROMISE_STATE.REJECTED) {
            onRejected(this.reason)
        } 
    }
}
```

考虑到以下情况

```js
new Promise((resolve,reject)=>{

}).then(onFulfilled, onRejected);
```

在`promise`声明的时候我们就传给他`onFulfilled`和`onRejected`，而此时`executor`可能尚未执行结束，即我们并不知道当前的`promise`状态，也就无法确定要执行哪一步，因此，我们需要将`onFulfilled`和`onRejected`存起来，直到状态发生改变的时候再执行。

```js
class MyPromise {
    constructor(executor) {
        //...
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value) => {
            //...
            this.onFulfilledCallbacks.forEach((fn) => fn())
        }

        const reject = (reason) => {
            //...
            this.onRejectedCallbacks.forEach((fn) => fn())
        }

        //...
        }

    then(onFulfilled, onRejected) {
        //...
        if (this.state === PROMISE_STATE.PENDING) {
            this.onFulfilledCallbacks.push(() => {
                onFulfilled(this.value)
            })
            this.onRejectedCallbacks.push(() => {
                onRejected(this.reason)
            })
        }
    }
}
```

## 链式调用

根据规范`2.2.7`，`then`必须返回一个`promise`,

且规范`2.2.7.1`至`2.2.7.4`还规定了`onFulfilled`和`onRjected`不同情况下的处理方案

同时规范`3.1`声明了`onFulfilled`和`onRejected`需要被异步地执行，且可以使用`setTimeout`这样的`宏任务`机制运行

```js
class MyPromise {
    //...
    then(onFulfilled, onRejected) {
        //...
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.state === PROMISE_STATE.FULFILLED) {
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== "function") {
                            resolve(this.value)
                        } else {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.state === PROMISE_STATE.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== "function") {
                            reject(this.value)
                        } else {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.state === PROMISE_STATE.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    try {
                        if (typeof onFulfilled !== "function") {
                            resolve(this.value)
                        } else {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
                this.onRejectedCallbacks.push(() => {
                    try {
                        if (typeof onRejected !== "function") {
                            reject(this.reason)
                        } else {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })

        return promise2
    }
}
```

下一步，我们将要实现`resolvePromise`

## resolvePromise

```js
function resolvePromise(promise, x, resolve, reject) {
    //规范2.3.1
    //如果promise和x引用同一个对象，用一个TypeError作为原因来拒绝promise
    if (promise === x) {
        return reject(new TypeError("MyPromise TypeError"))
    }

    //规范2.3.2
    //如果x是一个promise，采用它的状态
    if (x instanceof MyPromise) {
        if (x.state === PROMISE_STATE.PENDING) {
            //规范2.3.2.1
            //如果x是等待态，promise必须保持等待状态，直到x被解决或拒绝
            x.then((y) => {
                resolvePromise(promise, y, resolve, reject)
            })
        } else if (x.state === PROMISE_STATE.FULFILLED) {
            //规范2.3.2.2
            //如果x是解决态，用相同的值解决promise
            resolve(x.value)
        } else if (x.state === PROMISE_STATE.REJECTED) {
            //规范2.3.2.3
            //如果x是拒绝态，用相同的原因拒绝promise
            reject(x.reason)
        }
    }

    //规范2.3.3
    //否则，如果x是一个对象或函数
    if ((typeof x === "object" && x !== null) || typeof x === "function") {
        try {
            //规范2.3.3.1
            //让then成为x.then
            var then = x.then
            } catch (e) {
                //规范2.3.3.2
                //如果检索属性x.then导致抛出了一个异常e，用e作为原因拒绝promise
                reject(e)
            }

        //规范2.3.3.3
        //如果then是一个函数，用x作为this调用它。then方法的参数为俩个回调函数，第一个参数叫做resolvePromise，第二个参数叫做rejectPromise
        //下面使用匿名函数
        if (typeof then === "function") {
            //规范2.3.3.3.3
            //使用called确保只有第一次调用生效
            var called = false
            try {
                then.call(
                    x,
                    //规范2.3.3.3.1
                    //如果resolvePromise用一个值y调用，运行[[Resolve]](promise, y)
                    function (y) {
                        if (called) return
                        called = true
                        resolvePromise(promise, y, resolve, reject)
                    },
                    //规范2.3.3.3.2
                    // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    function (r) {
                        if (called) return
                        called = true
                        reject(r)
                    }
                )
            } catch (error) {
                //规范2.3.3.3.4
                // 如果调用 then 方法抛出了异常 e：
                //规范2.3.3.3.4.1
                // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                if (called) return
                //规范2.3.3.3.4.2
                // 否则以 e 为据因拒绝 promise
                reject(error)
            }
        } else {
            //规范2.3.3.4
            //如果then不是一个函数，用x解决promise
            resolve(x)
        }
    } else {
        //规范2.3.4
        //如果x不是一个对象或函数，用x解决promise
        resolve(x)
    }
}
```

可以看到，`resolvePromise`的实现虽然比较复杂，但每一步都有迹可循，遵循规范书写即可。

## 完整代码

```js
// 先定义三个常量表示状态
const PROMISE_STATE = {
    PENDING: "pending",
    FULFILLED: "fulfilled",
    REJECTED: "rejected",
}

class MyPromise {
    constructor(executor) {
        this.state = PROMISE_STATE.PENDING
        this.value = undefined
        this.reason = undefined

        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value) => {
            setTimeout(() => {
                if (this.state !== PROMISE_STATE.PENDING) return
                this.state = PROMISE_STATE.FULFILLED
                this.value = value

                this.onFulfilledCallbacks.forEach((fn) => fn())
            })
        }

        const reject = (reason) => {
            setTimeout(() => {
                if (this.state !== PROMISE_STATE.PENDING) return
                this.state = PROMISE_STATE.REJECTED
                this.reason = reason

                this.onRejectedCallbacks.forEach((fn) => fn())
            }, 0)
        }

        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    then(onFulfilled, onRejected) {
        onFulfilled =
            typeof onFulfilled === "function" ? onFulfilled : (value) => value
        onRejected =
            typeof onRejected === "function"
            ? onRejected
        : (reason) => {
            throw reason
        }

        let promise2 = new MyPromise((resolve, reject) => {
            //console.log("promise2 this", this)
            if (this.state === PROMISE_STATE.FULFILLED) {
                setTimeout(() => {
                    try {
                        if (typeof onFulfilled !== "function") {
                            resolve(this.value)
                        } else {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.state === PROMISE_STATE.REJECTED) {
                setTimeout(() => {
                    try {
                        if (typeof onRejected !== "function") {
                            reject(this.value)
                        } else {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.state === PROMISE_STATE.PENDING) {
                this.onFulfilledCallbacks.push(() => {
                    try {
                        if (typeof onFulfilled !== "function") {
                            resolve(this.value)
                        } else {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
                this.onRejectedCallbacks.push(() => {
                    try {
                        if (typeof onRejected !== "function") {
                            reject(this.reason)
                        } else {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        }
                    } catch (e) {
                        reject(e)
                    }
                })
            }
        })

        return promise2
    }

    catch(errorCallback) {
        return this.then(null, errorCallback)
    }
}

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError("MyPromise TypeError"))
    }

    if (x instanceof MyPromise) {
        if (x.state === PROMISE_STATE.PENDING) {
            x.then((y) => {
                resolvePromise(promise, y, resolve, reject)
            })
        } else if (x.state === PROMISE_STATE.FULFILLED) {
            resolve(x.value)
        } else if (x.state === PROMISE_STATE.REJECTED) {
            reject(x.reason)
        }
    }

    if ((typeof x === "object" && x !== null) || typeof x === "function") {
        try {
            var then = x.then
            } catch (e) {
                reject(e)
            }

        // 如果 then 是函数
        if (typeof then === "function") {
            var called = false
            // 将 x 作为函数的作用域 this 调用之
            // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
            // 名字重名了，我直接用匿名函数了
            try {
                then.call(
                    x,
                    // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                    function (y) {
                        // 如果 resolvePromise 和 rejectPromise 均被调用，
                        // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
                        // 实现这条需要前面加一个变量called
                        if (called) return
                        called = true
                        resolvePromise(promise, y, resolve, reject)
                    },
                    // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                    function (r) {
                        if (called) return
                        called = true
                        reject(r)
                    }
                )
            } catch (error) {
                // 如果调用 then 方法抛出了异常 e：
                // 如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
                if (called) return

                // 否则以 e 为据因拒绝 promise
                reject(error)
            }
        } else {
            resolve(x)
        }
    } else {
        resolve(x)
    }
}

//在手写的promiseXXX.js添加以下代码，其中改成自己定义promise.js名字
MyPromise.defer = MyPromise.deferred = function () {
    let result = {}
    result.promise = new MyPromise((resolve, reject) => {
        result.resolve = resolve
        result.reject = reject
    })
    return result
}
module.exports = MyPromise
```

```shell
npm test
```

执行测试用例，查看结果

![image-20220610162901404](https://s2.loli.net/2022/06/10/mKY8M4dUSyvxk7u.png)