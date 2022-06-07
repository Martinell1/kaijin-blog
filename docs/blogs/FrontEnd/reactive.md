---
title: Vue的响应式系统
date: '2022-06-04 14:53:10'
categories:
 - FrontEnd
tags:
 - JS
 - Vue
 - 源码

---

## 

## 副作用函数

副作用函数是指会影响其他函数运行的函数。

如一个方法中修改了全局变量，那么所有调用了该全局变量的函数都会受到影响，这时我们可以说产生了该函数副作用。

在Vue中，对响应式数据的修改都在副作用函数中，当数据发生改变时，副作用函数会重新执行。

### 分支切换

我们需要注意的是分支切换的情况,在实际使用中，我们可能有如下代码：

```js
function effect(()=>{
    a.value = a.ok ? a.text : 'sorry'
})
```

当字段`a.ok`发生变化时，该语句执行不同的分支，所收集的副作用函数也会发生改变，即如果我们不做任何处理，当`a.ok`由`true`切换到`false`时，会同时收集到`a.ok`和`a.text`两个字段对应的副作用函数，而实际上此时应该清除`a.text`对应的依赖集合。

如何解决这个问题呢，我们可以在每次副作用函数执行时，把它从与之关联的集合中删除，当函数执行完毕后，会重新建立联系。

### 嵌套effect

我们的effect可还能是嵌套的，如以下代码：

```jsx
const Bar = {
    render(){
        
    }
}

const Foo = {
    render(){
        return <Bar/>
    }
}
```

在这段代码中，组件Foo中嵌套了组件Bar，而实际上，它相当于：

```js
effect(()=>{
    Foo.render()
    effect(()=>{
        Bar.render()
    })
})
```

我们之前使用全局变量`activeEffect`存储effect函数注册的副作用函数，即同一时刻`activeEffect`只能存储一个副作用函数，当发生副作用函数嵌套时，本应外层收集的副作用函数会被内层的副作用函数覆盖。为了解决这个问题，我们需要一个函数栈`effectStack`，在副作用函数执行时，将其压入栈中，执行完毕后弹出，并且让`activeEffect`指向栈顶函数。

### 调度执行

通过为effect函数添加参数options，用户可为副作用函数添加调度器。

```js
let activeEffect
const effectStack = []
const bucket = new WeakMap()

//副作用函数
function effect(fn,options={}){

    const effectFn = () => {
        //清除依赖项
        cleanup(effectFn)
        //当effectFn执行时，将其设置为当前激活的副作用函数
        activeEffect = effectFn
        //将该函数推入副作用函数栈
        effectStack.push(effectFn)
        //执行函数，返回结果
        const res = fn()
        //函数执行完毕，出栈
        effectStack.pop()
        //当前副作用函数为副作用函数栈的栈顶
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }

    //副作用函数挂载options
    effectFn.options = options
    //用于存储effectFn相关的依赖项
    effectFn.deps = []

    if(!options.lazy){
        effectFn()
    }else{
        //返回副作用函数，让其手动调用执行
        return effectFn
    }
}
```



```js
//清除依赖
function cleanup(effectFn){
    //遍历该副作用函数的deps
    for(let i = 0 ; i < effectFn.deps.length; i++){
        //deps是依赖集合，可能存有多个副作用函数
        const deps = effectFn.deps[i]
        //从中清除当前副作用函数
        deps.delete(effectFn)
    }
    //重置effectFn.deps数组
    effectFn.deps.length = 0
}
```



## 响应式数据的基本实现

### 引用值数据劫持

我们可以使用拦截对数据的操作以实现响应。

在Vue2中，我们使用`Object.definePropperty()`这个API来进行数据劫持

而在Vue3中，我们使用了Proxy和Reflect来实现

我们先来看一个`createReactive`函数的基本实现

```js
function createReactive(obj, isShallow = false, isReadonly = false){
    return new Proxy(obj,{

        //捕获get操作，执行track，追踪
        get(target,key,receiver){
            //将原始对象存储在raw字段中
            if(key === 'raw'){
                return target
            }
            //获取target的数据类型
            const targetType = Object.prototype.toString.call(target).slice(8,-1);
            switch (targetType) {
                //类型为Object或者Array
                case 'Object':
                case 'Array':
                    //如果target是数组，需要对数组的方法进行劫持
                    if(Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)){
                        return Reflect.get(arrayInstrumentations,key,receiver)
                    }
                    
                    //当前函数不是只读的且key的类型不为symbol时，进行追踪
                    //应避免副作用函数与Symbol.iterator这类symbol值建立联系
                    if(!isReadonly && typeof key !== 'symbol'){
                        track(target,key)
                    }
                    
                    //拿到一层响应式的对象
                    const res = Reflect.get(target,key,receiver)

                    //浅响应，直接返回
                    if(isShallow){
                        return res
                    }
                    
                    //进行递归处理
                    if(typeof res === 'object' && res !== null){
                        return isReadonly ? readonly(res) : reactive(res)
                    }
                    return res
                case 'Map':
                case 'Set':
                case 'WeakMap':
                case 'WeakSet':
                    //对于集合类型
                    //key为size的情况下，以ITERATE_KEY为key追踪
                    if(key === 'size'){
                        track(target,ITERATE_KEY)
                        return Reflect.get(target,key,target)
                    }
                    //其他情况下对集合进行劫持
                    return mutableInstrumentations[key]
                default:
                    return target
            }

        },

        //捕获set操作，执行trigger，触发
        set(target,key,newVal,receiver){
            //尝试给只读属性设值时会报错
            if(isReadonly){
                console.warn(`属性${key}是只读的`)
                return true
            }
            //拿到旧值
            const oldVal = target[key]
            //判断当前操作的类型
            //如果是数组的话，根据索引是否大于数组长度判断是新增还是修改
            //如果不是数组，根据target上是否有key属性判断你是新增还是修改
            const type = Array.isArray(target) 
            ? Number(key) < target.length ? TriggerType.SET : TriggerType.ADD
            : Object.prototype.hasOwnProperty.call(target,key) ? TriggerType.SET : TriggerType.ADD
            const res = Reflect.set(target,key,newVal,receiver)
            
            //确认receiver是target的代理对象
            //避免target是原型对象所产生的的问题
            if(target === receiver.raw){
                //新旧值不同时才出发trigger,NAN值检测
                if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)){
                    trigger(target,key,type,newVal)
                }
            }

            return res
        },

        //has是读取操作
        has(target,key){
            track(target,key)
            return Reflect.has(target,key)
        },

        //迭代器相关
        ownKeys(target){
            track(target,Array.isArray(target) ? 'length' : ITERATE_KEY)
            return Reflect.ownKeys(target)
        },

        //删除属性是设置操作
        deleteProperty(target,key){
            if(isReadonly){
                console.warn(`属性${key}是只读的`)
                return true
            }
            const hadKey = Object.prototype.hasOwnProperty.call(target,key)
            const res = Reflect.deleteProperty(target,key)
			
            if(res && hadKey){
                trigger(target,key,TriggerType.DELETE)
            }

            return res
        }
    })
}

```

同时，我们将track和trigger函数抽离出来，避免代码过长，不利于维护。


```js
function track(target,key){
    //无副作用函数或者不应该追踪
    if(!activeEffect || !shouldTrack){
        return
    }
    //从桶中取出当前对象的依赖映射
    let depsMap = bucket.get(target)
    if(!depsMap){
        bucket.set(target,(depsMap = new Map()))
    }
    //从depsMap中取到当前key关联的所有副作用函数
    let deps = depsMap.get(key)
    if(!deps){
        depsMap.set(key,(deps = new Set()))
    }
    //将当前的副作用函数添加进依赖集合deps
    deps.add(activeEffect)
    //为当前副作用函数记录依赖集合
    activeEffect.deps.push(deps)
}

```

```js
function trigger(target,key,type,newVal){
    //从桶中取出当前对象的依赖映射
    const depsMap = bucket.get(target)
    //该对象未被追溯
    if(!depsMap){
        return
    }

    //从depsMap中取到当前key关联的所有副作用函数
    const effects = depsMap.get(key)

    //创建一个effectsToRun去依次执行副作用函数，防止无限循环
    const effectsToRun = new Set()

    //当前对象为数组且操作类型为Add，则取出关于length的副作用函数执行
    if(Array.isArray(target) && type === TriggerType.ADD){
        const lengthEffects = depsMap.get('length')
        lengthEffects && lengthEffects.forEach(effectFn=>{
            if(effectFn !== activeEffect){
                effectsToRun.add(effectFn)
            }
        })
    }

    //当前对象为数组且key为length，即直接访问了数组的长度
    //将执行索引大于新length值的元素的副作用函数
    if(Array.isArray(target) && key==='length'){
        depsMap.forEach((effects,key)=>{
            if(key >= newVal){
                effects.forEach(effectFn=>{
                    effectsToRun.add(effectFn)
                })
            }
        })
    }
    
    
    //effects.forEach中直接执行effectFn()，
    //会调用cleanup进行清除副作用函数，
    //但是副作用函数的执行会导致其重新收集到effects中
    //出现无限循环
    effects && effects.forEach(effectFn=>{
        //读取和设置操作在同一个副作用函数中时，会导致无限循环
        //如果trigger要触发的函数和当前正在执行的副作用函数是同一个，则不执行
        if(effectFn !== activeEffect){
            effectsToRun.add(effectFn)
        }
    })

    //迭代器相关
    //操作类型为ADD或者DELETE时执行
    //如果是target是Map，那么SET操作的时候也要执行
    //执行ITERATE_KEY对应的副作用函数
    if(
        type === TriggerType.ADD || 
        type === TriggerType.DELETE ||
        (
            type === TriggerType.SET &&
            Object.prototype.toString.call(target) === '[object Map]'
        )
    ){
        const iterateEffects = depsMap.get(ITERATE_KEY)
        iterateEffects && iterateEffects.forEach(effectFn=>{
            if(effectFn !== activeEffect){
                effectsToRun.add(effectFn)
            }
        })
    }

    //Map.keys()方法或者新增和函数
    //只追踪Map中key的变化
    if(
        (type === TriggerType.ADD || type === TriggerType.DELETE) &&
        Object.prototype.toString.call(target) === '[object Map]'
    ){
        const iterateEffects = depsMap.get(MAP_KEY_ITERATE_KEY)
        iterateEffects && iterateEffects.forEach(effectFn=>{
            if(effectFn !== activeEffect){
                effectsToRun.add(effectFn)
            }
        })
    }

    effectsToRun.forEach(effectFn=>{
        if(effectFn.options.scheduler){
            //当前副作用函数有调度器，按调度器方式执行
            effectFn.options.scheduler(effectFn)
        }else{
            effectFn()
        }
    })
}
```

我们可以看到，在对数据进行劫持时，需要对不同的数据类型采取不同的策略，上面的代码中我们分别提到了对数组进行拦截和对集合进行拦截，但是并没有给出具体的实现。

#### 劫持数组

```js
//劫持数组
const arrayInstrumentations = {}
//数组的查找方法
;['includes','indexOf','lastIndexOf'].forEach(method => {
    //拿到原始方法
    const originMethod = Array.prototype[method]
    arrayInstrumentations[method] = function(...args){
        //this是代理对象
        let res = originMethod.apply(this,args)
		
        if(res === false){
            //res为false说明没有找到
            //通过this.raw去原始数组中查找
            res = originMethod.apply(this.raw,args)
        }

        return res
    }
})

//数组的修改长度的方法会读取length属性
//这样一次操作中会同时读取和设置length属性，会造成无限循环
//因此屏蔽对length的读取
let shouldTrack = true
//数组的修改长度的方法
;['push','pop','shift','unshift','splice'].forEach(method => {
    const originMethod = Array.prototype[method]
    arrayInstrumentations[method] = function(...args){
        shouldTrack = false
        let res = originMethod.apply(this,args)
        shouldTrack = true
        return res
    }
})
```

#### 劫持集合

```js
//劫持集合
const mutableInstrumentations = {
    get(key){
        const target = this.raw
        const had = target.has(key)
        track(target,key)
        if(had){
            const res = target.get(key)
            return typeof res === 'object' ? reactive(res) : res
        }
    },
    set(key,value){
        const target = this.raw
        const had = target.has(key)
        const oldValue = target.get(key)
        //避免造成数据污染
        //即在原始数据上设置响应式数据
        const rawValue = value.raw || value
        target.set(key,rawValue)
        if(!had){
            trigger(target,key,TriggerType.ADD)
        }else if(oldValue !== value || (oldValue === oldValue && value ===value)){
            trigger(target,key,TriggerType.SET)
        }
    },
    add(key){
        const target = this.raw
        const hadKey = target.has(key)
        const res = target.add(key)
        if(!hadKey){
            trigger(target,key,TriggerType.ADD)
        }
        return res
    },
    delete(key){
        const target = this.raw
        const hadKey = target.has(key)
        const res = target.delete(key)
        if(hadKey){
            trigger(target,key,TriggerType.DELETE)
        }
        return res
    },
    forEach(callback,thisArg){
        //forEach循环中的参数也是响应式的
        const wrap = (val) => typeof val === 'object' ? reactive(val) : val
        const target = this.raw
        track(target,ITERATE_KEY)
        target.forEach((v,k)=>{
            callback.call(thisArg,wrap(v),wrap(k),this)
        })
    },
    [Symbol.iterator]:iterationMethod,
    entries:iterationMethod,
    values:valuesIterationMethod,
    keys:KeysIterationMethod,
}

//迭代器方法
function iterationMethod(){
    const target = this.raw
    const itr = target[Symbol.iterator]()
	//迭代的每一项都是响应式的
    const wrap = (val) => typeof val === 'object' && val !== null ? reactive(val) : val

    track(target,ITERATE_KEY)

    return{
        next(){
            const {value,done} = itr.next()
            return {
                value : value ? [wrap(value[0]),wrap(value[1])] : value,
                done
            }
        },
        [Symbol.iterator](){
            return this
        }
    }
}

//迭代value
function valuesIterationMethod(){
    const target = this.raw
    const itr = target.values()

    const wrap = (val)=> typeof val === 'object' ? reactive(val) : val

    track(target,ITERATE_KEY)

    return {
        next(){
            const {value,done} = itr.next()
            return {
                value : wrap(value),
                done
            }
        },
        [Symbol.iterator](){
            return this
        } 
    }
}

const MAP_KEY_ITERATE_KEY = Symbol()
//迭代key
function KeysIterationMethod(){
    const target = this.raw
    const itr = target.keys()

    const wrap = (val)=> typeof val === 'object' ? reactive(val) : val

    track(target,MAP_KEY_ITERATE_KEY)

    return {
        next(){
            const {value,done} = itr.next()
            return {
                value : wrap(value),
                done
            }
        },
        [Symbol.iterator](){
            return this
        } 
    }
}
```



### 封装Reactive

```js
const reactiveMap = new Map()

function reactive(obj){
    //防止重复创建响应式对象
    const existionProxy = reactiveMap.get(obj)
    if(existionProxy){
        return existionProxy
    }

    const proxy = createReactive(obj)
    reactiveMap.set(obj,proxy)
    return proxy
}

//浅响应
function shallowReactive(obj){
    return createReactive(obj,true)
}

//只读
function readonly(obj){
    return createReactive(obj,false,true)
}

//浅只读
function shallowReadonly(obj){
    return createReactive(obj,true,true)
}
```



### 计算属性

计算属性实际上是一个懒执行的副作用函数

```js
//计算属性
function computed(getter){
    //用来缓存上一次计算的值
    let value
    //脏值，需要重新计算
    let dirty = true

    //把getter作为副作用函数，创建一个懒执行的effect
    const effectFn = effect(getter,{
        //副作用函数懒执行
        lazy:true,
        //调度器，不为脏值时重新计算
        scheduler(){
            if(!dirty){
                dirty = true
                //计算属性依赖的响应式数据发生变化时，手动调用trigger触发更新
                trigger(obj,'value')
            }
        }
    })

    const obj = {
        //读取value时才执行effectFn
        get value(){
            if(dirty){
                //手动调用副作用函数，获得计算属性值
                value = effectFn()
                dirty = false
            }
            //追踪计算属性的value
            track(obj,'value')
            return value
        }
    }
    return obj
}

```



### Watch

watch利用了副作用函数的可调度性。

同时需要处理的是watch中的竞态问题。

```js
//监听
function watch(source,cb,options = {}){
    let getter
    if(typeof source === 'function'){
        //监听源为getter函数
        getter = source
    }else{
        //递归读取source
        getter = ()=> traverse(source)
    }
    let oldValue,newValue

    let cleanup


    function onInvalidate(fn){
        //将过期的回调存储到cleanup中
        cleanup = fn
    }

    //将getter作为副作用函数，开启懒执行，获得effectFn
    const effectFn = effect(
        ()=>getter(),
        {
            lazy:true,
            scheduler:()=>{
                if(options.flush === 'post'){
                    const p = Promise.resolve()
                    p.then(job)
                }else{
                    job()
                }
            }
        }
    )

    const job = () => {
        //再次执行effectFn，获得新值
        newValue = effectFn()
        //调用cb前，先调用过期回调
        if(cleanup){
            cleanup()
        }
        //执行回调函数
        cb(newValue,oldValue,onInvalidate)
        //更新
        oldValue = newValue
    }

    if(options.immediate){
        //立即执行
        //oldValue为undefined
        job()
    }else{
        //手动执行effectFn，获得旧值
        oldValue = effectFn()
    }
}
```

### 

```js
function traverse(value,seen = new Set()){
    //如果要读取的数据已经被读取过,或者是原始值，则什么都不做
    if(typeof value !== 'object' || value ===null || seen.has(value)){
        return
    }
    //将当前值添加到seen中，表示已经读取过
    seen.add(value)
    //当前值为对象，遍历其属性
    for(const k in value){
        //递归调用
        traverse(value[k],seen)
    }

    return value
}
```





## 原始值数据劫持

### ref

上文中，我们通过使用`Proxy`方案进行数据劫持，但是`Proxy`方案的代理目标必须是引用值，为了使原始值适配这个方案，我们可以将原始值包裹成对象。

```js
function ref(val){
    const wrapper = {
        value:val
    }
    Object.defineProperty(wrapper,'__v_isRef',{
        value:true
    })

    return reactive(wrapper)
}
```

在这段代码中，我们将原始值包装为一个带有`value`属性的对象（这也是为什么我们使用`ref`声明响应的值需要`.value`），并且将其用`__v_isRef`标志为引用值。

### 响应丢失

通常我们需要在`setup`的末尾将需要暴露到模板中的变量`return`出来，但是不做任何处理的话，`return`出来的结果会是一个普通对象，不具备响应式的能力，为了解决这个问题，我们需要`toRef`主动声明变量是一个响应对象

```js
function toRef(obj,key){
    const wrapper = {
        get value(){
            return obj[key]
        },

        set value(val){
            obj[key] = val
        }
    }

    Object.defineProperty(wrapper,'__v_isRef',{
        value:true
    })

    return wrapper
}
```

当然，实际编码中我们可能需要一次性暴露多个数据

```js
function toRefs(obj){
    const ret = {}
    for(constA key in obj){
        ret[key] = toRef(obj,key)
}

return ret
}
```

### 自动脱ref

我们希望在模板中使用响应式数据时不需要`.value`，其实现也非常简单，对数据进行一层代理，进行读取数据时便进行`.value`操作

```js
function proxyRefs(target){
    return new Proxy(target,{
        get(target,key,receiver){
            const value = Reflect.get(target,key,receiver)
            return value.__v_isRef ? value.value : value
        },

        set(target,key,newValue,receiver){
            const value =  target[key]
            if(value.__v_isRef){
                value.value = newValue
                return true
            }
            return Reflect.set(target,key,newValue,receiver)
        }
    })
}
```



最后，附上完整代码

```js
//当前的副作用函数
let activeEffect
//副作用函数栈
//当副作用函数发生嵌套时，
//栈底存储的是外层副作用函数
//栈顶存储的是内层副作用函数
const effectStack = []

//副作用函数
function effect(fn,options={}){

    const effectFn = () => {
        //清楚依赖项
        cleanup(effectFn)
        //当effectFn执行时，将其设置为当前激活的副作用函数
        activeEffect = effectFn
        //将该函数推入副作用函数栈
        effectStack.push(effectFn)
        //执行函数，返回结果
        const res = fn()
        //函数执行完毕，出栈
        effectStack.pop()
        //当前副作用函数为副作用函数栈的栈顶
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }

    //effectFn的配置项
    effectFn.options = options
    //用于存储effectFn相关的依赖项
    effectFn.deps = []

    if(!options.lazy){
        //该副作用函数非懒，直接执行
        effectFn()
    }else{
        //返回副作用函数，让其手动调用执行
        return effectFn
    }

}

//清除依赖
function cleanup(effectFn){
    //遍历该副作用函数的deps
    for(let i = 0 ; i < effectFn.deps.length; i++){
        //deps是依赖集合，可能存有多个副作用函数
        const deps = effectFn.deps[i]
        //从中清除当前副作用函数
        deps.delete(effectFn)
    }
    //重置effectFn.deps数组
    effectFn.deps.length = 0
}

//桶，存储副作用函数
const bucket = new WeakMap()

const ITERATE_KEY = Symbol()

const TriggerType = {
    SET : 'SET',
    ADD : 'ADD',
    DELETE : 'DELETE'
}

//劫持数组
const arrayInstrumentations = {}
;['includes','indexOf','lastIndexOf'].forEach(method => {

    const originMethod = Array.prototype[method]
    arrayInstrumentations[method] = function(...args){
        let res = originMethod.apply(this,args)

        if(res === false){
            res = originMethod.apply(this.raw,args)
        }

        return res
    }
})

let shouldTrack = true
;['push','pop','shift','unshift','splice'].forEach(method => {
    const originMethod = Array.prototype[method]
    arrayInstrumentations[method] = function(...args){
        shouldTrack = false
        let res = originMethod.apply(this,args)
        shouldTrack = true
        return res
    }
})


//劫持集合
const mutableInstrumentations = {
    get(key){
        const target = this.raw
        const had = target.has(key)
        track(target,key)
        if(had){
            const res = target.get(key)
            return typeof res === 'object' ? reactive(res) : res
        }
    },
    set(key,value){
        const target = this.raw
        const had = target.has(key)
        const oldValue = target.get(key)
        const rawValue = value.raw || value
        target.set(key,rawValue)
        if(!had){
            trigger(target,key,TriggerType.ADD)
        }else if(oldValue !== value || (oldValue === oldValue && value ===value)){
            trigger(target,key,TriggerType.SET)
        }
    },
    add(key){
        const target = this.raw
        const hadKey = target.has(key)
        const res = target.add(key)
        if(!hadKey){
            trigger(target,key,TriggerType.ADD)
        }
        return res
    },
    delete(key){
        const target = this.raw
        const hadKey = target.has(key)
        const res = target.delete(key)
        if(hadKey){
            trigger(target,key,TriggerType.DELETE)
        }
        return res
    },
    forEach(callback,thisArg){
        const wrap = (val) => typeof val === 'object' ? reactive(val) : val
        const target = this.raw
        track(target,ITERATE_KEY)
        target.forEach((v,k)=>{
            callback.call(thisArg,wrap(v),wrap(k),this)
        })
    },
    [Symbol.iterator]:iterationMethod,
    entries:iterationMethod,
    values:valuesIterationMethod,
    keys:KeysIterationMethod,
}

function iterationMethod(){
    const target = this.raw
    const itr = target[Symbol.iterator]()

    const wrap = (val) => typeof val === 'object' && val !== null ? reactive(val) : val

    track(target,ITERATE_KEY)

    return{
        next(){
            const {value,done} = itr.next()
            return {
                value : value ? [wrap(value[0]),wrap(value[1])] : value,
                done
            }
        },
        [Symbol.iterator](){
            return this
        }
    }
}

function valuesIterationMethod(){
    const target = this.raw
    const itr = target.values()

    const wrap = (val)=> typeof val === 'object' ? reactive(val) : val

    track(target,ITERATE_KEY)

    return {
        next(){
            const {value,done} = itr.next()
            return {
                value : wrap(value),
                done
            }
        },
        [Symbol.iterator](){
            return this
        } 
    }
}

const MAP_KEY_ITERATE_KEY = Symbol()
function KeysIterationMethod(){
    const target = this.raw
    const itr = target.keys()

    const wrap = (val)=> typeof val === 'object' ? reactive(val) : val

    track(target,MAP_KEY_ITERATE_KEY)

    return {
        next(){
            const {value,done} = itr.next()
            return {
                value : wrap(value),
                done
            }
        },
        [Symbol.iterator](){
            return this
        } 
    }
}

//代理对象
function createReactive(obj, isShallow = false, isReadonly = false){
    return new Proxy(obj,{

        //捕获get操作，执行track，追溯
        get(target,key,receiver){
            if(key === 'raw'){
                return target
            }
            const targetType = Object.prototype.toString.call(target).slice(8,-1);
            switch (targetType) {
                case 'Object':
                case 'Array':
                    if(Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)){
                        return Reflect.get(arrayInstrumentations,key,receiver)
                    }

                    if(!isReadonly && typeof key !== 'symbol'){
                        track(target,key)
                    }
                    const res = Reflect.get(target,key,receiver)

                    if(isShallow){
                        return res
                    }
                    if(typeof res === 'object' && res !== null){
                        return isReadonly ? readonly(res) : reactive(res)
                    }
                    return res
                case 'Map':
                case 'Set':
                case 'WeakMap':
                case 'WeakSet':
                    if(key === 'size'){
                        track(target,ITERATE_KEY)
                        return Reflect.get(target,key,target)
                    }
                    return mutableInstrumentations[key]
                default:
                    return target
            }

        },

        //捕获set操作，执行trigger，触发
        set(target,key,newVal,receiver){

            if(isReadonly){
                console.warn(`属性${key}是只读的`)
                return true
            }
            const oldVal = target[key]
            //判断当前操作的类型
            const type = Array.isArray(target) 
            ? Number(key) < target.length ? TriggerType.SET : TriggerType.ADD
            : Object.prototype.hasOwnProperty.call(target,key) ? TriggerType.SET : TriggerType.ADD
            const res = Reflect.set(target,key,newVal,receiver)
            if(target === receiver.raw){
                if(oldVal !== newVal && (oldVal === oldVal || newVal === newVal)){
                    trigger(target,key,type,newVal)
                }
            }

            return res
        },

        has(target,key){
            track(target,key)
            return Reflect.has(target,key)
        },

        ownKeys(target){
            track(target,Array.isArray(target) ? 'length' : ITERATE_KEY)
            return Reflect.ownKeys(target)
        },

        deleteProperty(target,key){
            if(isReadonly){
                console.warn(`属性${key}是只读的`)
                return true
            }
            const hadKey = Object.prototype.hasOwnProperty.call(target,key)
            const res = Reflect.deleteProperty(target,key)

            if(res && hadKey){
                trigger(target,key,TriggerType.DELETE)
            }

            return res
        }
    })
}

function track(target,key){
    //无副作用函数
    if(!activeEffect || !shouldTrack){
        return
    }
    //从桶中取出当前对象的依赖映射
    let depsMap = bucket.get(target)
    if(!depsMap){
        bucket.set(target,(depsMap = new Map()))
    }
    //从depsMap中取到当前key关联的所有副作用函数
    let deps = depsMap.get(key)
    if(!deps){
        depsMap.set(key,(deps = new Set()))
    }
    //将当前的副作用函数添加进依赖集合deps
    deps.add(activeEffect)
    //为当前副作用函数记录依赖集合
    activeEffect.deps.push(deps)
}

function trigger(target,key,type,newVal){
    //从桶中取出当前对象的依赖映射
    const depsMap = bucket.get(target)
    //该对象未被追溯
    if(!depsMap){
        return
    }

    //从depsMap中取到当前key关联的所有副作用函数
    const effects = depsMap.get(key)

    //创建一个effectsToRun去依次执行副作用函数，防止无限循环
    const effectsToRun = new Set()

    if(Array.isArray(target) && type === TriggerType.ADD){
        const lengthEffects = depsMap.get('length')
        lengthEffects && lengthEffects.forEach(effectFn=>{
            //读取和设置操作在同一个副作用函数中时，会导致无限循环
            //如何trigger要触发的函数和当前正在执行的副作用函数是同一个，则不执行
            if(effectFn !== activeEffect){
                effectsToRun.add(effectFn)
            }
        })
    }

    if(Array.isArray(target) && key==='length'){
        depsMap.forEach((effects,key)=>{
            if(key >= newVal){
                effects.forEach(effectFn=>{
                    effectsToRun.add(effectFn)
                })
            }
        })
    }
    //effects.forEach中直接执行effectFn()，
    //会调用cleanup进行清除副作用函数，
    //但是副作用函数的执行会导致其重新收集到effects中
    //出现无限循环
    effects && effects.forEach(effectFn=>{
        //读取和设置操作在同一个副作用函数中时，会导致无限循环
        //如何trigger要触发的函数和当前正在执行的副作用函数是同一个，则不执行
        if(effectFn !== activeEffect){
            effectsToRun.add(effectFn)
        }
    })

    if(
        type === TriggerType.ADD || 
        type === TriggerType.DELETE ||
        (
            type === TriggerType.SET &&
            Object.prototype.toString.call(target) === '[object Map]'
        )
    ){
        const iterateEffects = depsMap.get(ITERATE_KEY)
        iterateEffects && iterateEffects.forEach(effectFn=>{
            if(effectFn !== activeEffect){
                effectsToRun.add(effectFn)
            }
        })
    }

    if(
        (type === TriggerType.ADD || type === TriggerType.DELETE) &&
        Object.prototype.toString.call(target) === '[object Map]'
    ){
        const iterateEffects = depsMap.get(MAP_KEY_ITERATE_KEY)
        iterateEffects && iterateEffects.forEach(effectFn=>{
            if(effectFn !== activeEffect){
                effectsToRun.add(effectFn)
            }
        })
    }


    effectsToRun.forEach(effectFn=>{
        if(effectFn.options.scheduler){
            //当前副作用函数有调度器，按调度器方式执行
            effectFn.options.scheduler(effectFn)
        }else{
            effectFn()
        }
    })
}

const reactiveMap = new Map()

function reactive(obj){
    const existionProxy = reactiveMap.get(obj)
    if(existionProxy){
        return existionProxy
    }

    const proxy = createReactive(obj)
    reactiveMap.set(obj,proxy)
    return proxy
}

function shallowReactive(obj){
    return createReactive(obj,true)
}

function readonly(obj){
    return createReactive(obj,false,true)
}

function shallowReadonly(obj){
    return createReactive(obj,true,true)
}


//任务队列
const jobQueue = new Set()
//创建一个p添加到微任务队列
const p = Promise.resolve()
//是否正在刷新队列
let isFlushing = false
function flushJob(){
    //正在刷新队列，则不执行
    if(isFlushing){
        return
    }
    isFlushing = true
    //在微任务队列中刷新jobQueue队列
    p.then(()=>{
        jobQueue.forEach(job=>job())
    }).finally(()=>{
        //刷新结束后重置isFlushing
        isFlushing = false
    })
}

//计算属性
function computed(getter){
    //用来缓存上一次计算的值
    let value
    //脏值，需要重新计算
    let dirty = true

    //把getter作为副作用函数，创建一个懒执行的effect
    const effectFn = effect(getter,{
        //副作用函数懒执行
        lazy:true,
        //调度器，不为脏值时重新计算
        scheduler(){
            if(!dirty){
                dirty = true
                //计算属性依赖的响应式数据发生变化时，手动调用trigger触发更新
                trigger(obj,'value')
            }
        }
    })

    const obj = {
        //读取value时才执行effectFn
        get value(){
            if(dirty){
                //手动调用副作用函数，获得计算属性值
                value = effectFn()
                dirty = false
            }
            //追溯计算属性的value
            track(obj,'value')
            return value
        }
    }
    return obj
}

//监听
function watch(source,cb,options = {}){
    let getter
    if(typeof source === 'function'){
        //监听源为getter函数
        getter = source
    }else{
        //递归读取source
        getter = ()=> traverse(source)
    }
    let oldValue,newValue

    let cleanup


    function onInvalidate(fn){
        //将过期的回调存储到cleanup中
        cleanup = fn
    }

    //将getter作为副作用函数，开启懒执行，获得effectFn
    const effectFn = effect(
        ()=>getter(),
        {
            lazy:true,
            scheduler:()=>{
                if(options.flush === 'post'){
                    const p = Promise.resolve()
                    p.then(job)
                }else{
                    job()
                }
            }
        }
    )

    const job = () => {
        //再次执行effectFn，获得新值
        newValue = effectFn()
        //调用cb前，先调用过期回调
        if(cleanup){
            cleanup()
        }
        //执行回调函数
        cb(newValue,oldValue,onInvalidate)
        //更新
        oldValue = newValue
    }

    if(options.immediate){
        //立即执行
        //oldValue为undefined
        job()
    }else{
        //手动执行effectFn，获得旧值
        oldValue = effectFn()
    }
}

function traverse(value,seen = new Set()){
    //如果要读取的数据已经被读取过,或者是原始值，则什么都不做
    if(typeof value !== 'object' || value ===null || seen.has(value)){
        return
    }
    //将当前值添加到seen中，表示已经读取过
    seen.add(value)
    //当前值为对象，遍历其属性
    for(const k in value){
        //递归调用
        traverse(value[k],seen)
    }

    return value
}

function toRef(obj,key){
    const wrapper = {
        get value(){
            return obj[key]
        },

        set value(val){
            obj[key] = val
        }
    }

    Object.defineProperty(wrapper,'__v_isRef',{
        value:true
    })

    return wrapper
}

function toRefs(obj){
    const ret = {}
    for(const key in obj){
        ret[key] = toRef(obj,key)
    }

    return ret
}

function ref(val){
    const wrapper = {
        value:val
    }
    Object.defineProperty(wrapper,'__v_isRef',{
        value:true
    })

    return reactive(wrapper)
}

function proxyRefs(target){
    return new Proxy(target,{
        get(target,key,receiver){
            const value = Reflect.get(target,key,receiver)
            return value.__v_isRef ? value.value : value
        },

        set(target,key,newValue,receiver){
            const value =  target[key]
            if(value.__v_isRef){
                value.value = newValue
                return true
            }
            return Reflect.set(target,key,newValue,receiver)
        }
    })
}
```



















