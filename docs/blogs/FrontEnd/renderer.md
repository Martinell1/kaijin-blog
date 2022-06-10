---
title: Vue的渲染器
date: '2022-06-05 14:53:10'
categories:
 - FrontEnd
tags:
 - JS
 - Vue
 - 源码

---



## 渲染器

渲染器用来执行渲染任务。我们用虚拟dom描述一个节点，使用渲染器将其渲染成真实dom元素并挂载到页面上。

### 实现

```js
function createRenderer(options){
    //解构出渲染执行的操作
    //不固定为浏览器API，实现跨平台
    const {
        createElement,
        removeElement,
        insert,
        setElementText,
        createText,
        settext,
        patchProps
    } = options

    //挂载元素
    function mountElement(vnode,container,anchor){
        //调用目标平台的创建元素方法，将虚拟dom转化成真实dom并挂载在el属性上。
        const el = vnode.el = createElement(vnode.type)
        if(typeof vnode.children === 'string'){
            //文本节点
            setElementText(el,vnode.children)
        }else if(Array.isArray(vnode.children)){
            //多个子节点
            vnode.children.forEach(child => {
                patch(null,child,el)
            })
        }
        //为节点设置props
        if(vnode.props){
            for(const key in vnode.props){
                //挂载阶段，preValue为null
                patchProps(el,key,null,vnode.props[key])
            }
        }
        //挂载到页面上
        insert(el,container,anchor)
    }

    //对比元素
    function patchElement(n1,n2){
        const el = n2.el = n1.el
        const oldProps = n1.props
        const newProps = n2.props
        //对比新旧prop进行修改
        for(const key in newProps){
            if(newProps[key] !== oldProps[key]){
                patchProps(el,key,oldProps[key],newProps[key])
            }
        }
        //删除prop
        for(const key in oldProps){
            if(!key in newProps){
                patchProps(el,key,oldProps[key],null)
            }
        }
        //对比子节点
        patchChildren(n1,n2,el)
    }

    //对比子节点
    function patchChildren(n1,n2,container){
        //新节点为文本节点
        //旧节点为数组节点
        //将旧节点依次卸载
        //设置新节点
        if(typeof n2.children === 'string'){
            if(Array.isArray(n1.children)){
                n1.children.forEach((c)=>unmount(c))
            }
            //将新的文本内容设置给容器
            setElementText(container,n2.children)
        }else if(Array.isArray(n2.children)){
            if(Array.isArray(n1.children)){
                //新旧节点皆为数组节点
            	//采用diff算法
                //diff
                patchKeyedChildren(n1,n2,container)
            }else{
                //新节点为数组节点
                //旧节点不为数组节点
                //将文本节点清除
                //新节点依次挂载
                setElementText(container,'')
                n2.children.forEach((c)=>patch(null,c,container))
            }
        }else{
            //没有新节点，执行清除
            if(Array.isArray(n1.children)){
                n1.children.forEach((c)=>unmount(c))
            }else if(typeof n1.children === 'string'){
                setElementText(container,'')
            }
        }
    }

    function patchKeyedChildren(n1,n2,container){
		//diff算法
    }

    //卸载操作
    function unmount(vnode){
        //节点type为Fragment，需要依次卸载
        if(vnode.type === Fragment){
            vnode.children.forEach(c=>unmount(c))
            return
        }
		removeElement(vnode.el)
    }

    //对比新旧节点
    function patch(n1,n2,container,anchor){
        //新旧节点类型不同
        //卸载旧节点
        if(n1 && n1.type !== n2.type){
            unmount(n1)
            n1 = null
        }
        const {type} = n2
        //普通标签元素
        if(typeof type === 'string'){
            if(!n1){
                //无旧节点，直接挂载
                mountElement(n2,container,anchor)
            }else{
                //对比新旧节点
                patchElement(n1,n2)
            }
        }else if(type === Text){
            //新节点为文本节点
            if(!n1){
                //无旧节点
                //进行挂载
                const el = n2.el = createText(n2.children)
                insert(el,container)
            }else{
                //更新旧节点文本内容
                const el = n2.el = n1.el
                if(n2.children !== n1.children){
                    setText(el,n2.children)
                }
            }
        }else if(type === Fragment){
            //新节点类型为Fragment
            if(!n1){
                //无旧节点
                //新节点依次挂载
                n2.children.forEach(c=>patch(null,c,container))
            }else{
                //对比新旧节点
                patchChildren(n1,n2,container)
            }
        }

    }

    function render(vnode,container) {
        //渲染函数
        if(vnode){
            //container._vnode为旧节点
            patch(container._vnode,vnode,container)
        }else{
            //执行卸载
            if(container._vnode){
                unmount(container._vnode)
            }
        }
        //将container的旧节点设置为当前节点，以便下次更新
        container._vnode = vnode
    }

    return {
        render
    }
}
```

上文是一段渲染器的具体实现代码。

我们可以借此分析渲染器执行挂载，更新，卸载时都经历了哪些步骤。

首先是挂载，

我们从`render`函数进入，在首次进入时，`container`上并没有`container._vnode`属性，

即容器上并没有旧节点，因此在`render`函数中会执行`patch`操作。

我们可以假设当前`vnode`类型为`Text`，

在`patch`函数内部，它应该会依次执行`createText`和`insert`操作

然后是卸载

同样从`render`函数进入，此时我们没有vnode参数，因此应该执行`unmount`，

在`unmount`我们调用了结构出的`removeElement`来执行删除元素。

最后是更新

更新的步骤类似于挂载，与之区别的是执行更新时`container._vnode`不为空，

也就是说在执行`patch`时会根据新旧节点的属性执行不同的路径，

假设当前`vnode`是更新过后的`Fragement`，那么接着应该执行`patchChildren`，

在`patchChildren`中，会将节点分为三种情况，无子节点，文本子节点，数组子节点，

并依据新旧子节点的类型进行判断，最复杂的情况即是新旧都为数组子节点，

在这种情况下，为了尽可能减少dom操作，我们需要设计一个算法使得旧节点能以最小的代价更新成新的节点，

这就是我们常说的`diff`算法。



### 创建渲染器实例

当然，观察上文代码，我们发现除了`diff`算法的实现之外，我们也不清楚诸如`createElement`这样的操作真实dom的函数的具体实现。

为什么要将``createElement``等方法作为参数传进来呢？

这是因为考虑到跨平台的需求，在不同的平台我们可能需要调用不同的`API`，因此我们将这些平台相关的代码单独抽离出来。

```js
//创建渲染器实例
const renderer = createRenderer({
    //创建元素
    createElement(tag){
        return document.createElement(tag)
    },
    //删除元素
    removeElement(el){
        const parent = el.parentNode
        if(parent){
            parent.removeChild(el)
        }
    },
    //设置元素文本
    setElementText(el,text){
        el.textContent = text
    },
    //挂载元素
    insert(el,parent,anchor = null){
        parent.insertBefore(el,anchor)
    },
    //创建文本节点
    createText(text){
        return document.createTextNode(text)
    },
    //设置文本内容
    setText(el,text){
        el.nodeValue = text
    },
    //对比props
    patchProps(el,key,preValue,nextValue){
        //属性以on开头，为事件属性
        if(/^on/.test(key)){
            //获取事件处理函数
            const invokers = el._vei || (el._vei = {})
            let invoker = invokers[key]
            const name = key.slice(2).toLowerCase()
            if(nextValue){
                if(!invoker){
                    //没有invoker，手动创建一个invoker
                    invoker = el._vei[key] = (e) => {
                        //事件处理函数被绑定的时间晚于时间发生时间，则不执行函数
                        if(e.timeStamp < invoker.attached){
                            return
                        }
                        if(Array.isArray(invoker.value)){
                            invoker.value.forEach(fn => fn(e))
                        }else{
                            invoker.value(e)
                        }
                    }
                    //将具体的实现赋值给invoker.value
                    invoker.value =  nextValue
                    invoker.attached = performance.now()
                    //绑定invoker作为事件处理函数
                    el.addEventListener(name,invoker)
                }else{
                    //更新invoker.value的值
                    invoker.value = nextValue
                }
            }else if(invoker){
                //新的事件绑定函数不存在
                //需要删除之前的invoker
                el.removeEventListener(name,invoker)
            }
        }else if(key === 'class'){
            //设置class
            el.className = nextValue || ''
        }else if(shouldSetAsProps(el,key,nextValue)){
            //处理prop为布尔值时，''会被认定为false
            //需手动修正
            const type = typeof el[key]
            if(type === 'boolean' && nextValue === ''){
                el[key] = true
            }else{
                el[key] = nextValue
            }
        }else{
            el.setAttribute(key,nextValue)
        }
    }
})
```

在这段代码中，我们看到了`options`的具体内容，我们封装了一个对象，将操作浏览器端真实DOM的相关方法放在里面，

当我们需要切换到另一个平台时，只需要修改`options`里的具体实现。

同时，值得注意的是在处理事件属性时，我们需要解决事件冒泡的问题。

解决的方法也很简单，

首先我们需要确认更新和事件触发的流程：

点击元素	->	元素的事件处理函数执行	->	副作用函数重新执行	->	渲染器	->	为父元素绑定事件	->	父元素的事件处理函数执行

我们发现，父元素上的绑定事件事件实际是晚于触发事件的时间的，

因此我们只需要屏蔽所有绑定事件晚于事件触发时间的事件处理函数的执行。



## 完整代码

```js
function getSequence(arr){
    const p = arr.slice()
    const result = [0]
    let i,j,u,v,charset
    const len = arr.length
    for(i = 0 ; i < len; i++){
        const arrI = arr[i]
        if(arrI !== 0){
            j = result[result.length - 1]
            if(arr[j] < arrI){
                p[i] = result.push(i)
                continue
            }
            u = 0
            v = result.length - 1
            while(u < v){
                c = ((u+v)/2) | 0
                if(arr[result[c]] < arrI){
                    u = c + 1
                }else{
                    v = c
                }
            }
            if(arrI < arr[result[u]]){
                if(u > 0){
                    p[i] = result[u - 1]
                }
                result[u] = i
            }
        }
    }
    u = result.length
    v = result[u - 1]
    while(u-- > 0){
        result[u] = v
        v = p[v]
    }
    return result
}

function normalizeClass(classList){
    const type = typeof classList
    let res = ''
    if(type === 'string'){
        return classList
    }else if(type === 'object'){
        if(Array.isArray(classList)){
            for(const clz of classList){
                if(typeof clz === 'string'){
                    if(res !== ''){
                        res += ' '
                    } 
                }
                res += normalizeClass(clz)
            }
        }else{
            for(const key in classList){
                if(classList[key]){
                    res += ' ' + key
                }
            }
        }
    }
    return res
}

function shouldSetAsProps(el,key,value){
    if(key === 'form' && el.tagName === 'INPUT'){
        return false
    }else{
        return key in el
    }
}

function createRenderer(options){
    const {
        createElement,
        removeElement,
        insert,
        setElementText,
        createText,
        settext,
        patchProps
    } = options

    function mountElement(vnode,container,anchor){
        const el = vnode.el = createElement(vnode.type)
        if(typeof vnode.children === 'string'){
            setElementText(el,vnode.children)
        }else if(Array.isArray(vnode.children)){
            vnode.children.forEach(child => {
                patch(null,child,el)
            })
        }
        if(vnode.props){
            for(const key in vnode.props){
                patchProps(el,key,null,vnode.props[key])
            }
        }
        insert(el,container,anchor)
    }

    function patchElement(n1,n2){
        const el = n2.el = n1.el
        const oldProps = n1.props
        const newProps = n2.props
        for(const key in newProps){
            if(newProps[key] !== oldProps[key]){
                patchProps(el,key,oldProps[key],newProps[key])
            }
        }
        for(const key in oldProps){
            if(!key in newProps){
                patchProps(el,key,oldProps[key],null)
            }
        }
        patchChildren(n1,n2,el)
    }

    function patchChildren(n1,n2,container){
        if(typeof n2.children === 'string'){
            if(Array.isArray(n1.children)){
                n1.children.forEach((c)=>unmount(c))
            }
            setElementText(container,n2.children)
        }else if(Array.isArray(n2.children)){
            if(Array.isArray(n1.children)){
                //diff
                patchKeyedChildren(n1,n2,container)
            }else{
                setElementText(container,'')
                n2.children.forEach((c)=>patch(null,c,container))
            }
        }else{
            if(Array.isArray(n1.children)){
                n1.children.forEach((c)=>unmount(c))
            }else if(typeof n1.children === 'string'){
                setElementText(container,'')
            }
        }
    }

    function patchKeyedChildren(n1,n2,container){
        const newChildren = n2.children
        const oldChildren = n1.children

        let j = 0
        let oldVNode = oldChildren[j]
        let newVNode = newChildren[j]

        while(oldVNode.key === newVNode.key){
            patch(oldVNode,newVNode,container)
            j++
            oldVNode = oldChildren[j]
            newVNode = newChildren[j]
        }

        let oldEnd = oldChildren.length - 1
        let newEnd = newChildren.length - 1
        oldVNode = oldChildren[oldEnd]
        newVNode = newChildren[newEnd]

        while(oldVNode.key === newVNode.key){
            patch(oldVNode,newVNode,container)
            oldEnd--
            newEnd--
            oldVNode = oldChildren[oldEnd]
            newVNode = newChildren[newEnd]
        }

        if(j > oldEnd && j <= newEnd){
            const anchorIndex = newEnd + 1
            const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
            while(j <= newEnd){
                patch(null,newChildren[j++],container,anchor)
            }
        }else if( j > newEnd && j <= oldEnd){
            while(j<=oldEnd){
                unmount(oldChildren[j++])
            }
        }else{
            const count = newEnd - j + 1
            const source = new Array(count).fill(-1)

            const oldStart = j
            const newStart = j

            let moved = false
            let pos = 0

            const keyIndex = {}
            for(let i = newStart; i <= newEnd ;i++){
                keyIndex[newChildren[i].key] = i
            }
            let patched = 0
            for(let i = oldStart; i <= oldEnd ; i++){
                const oldVNode = oldChildren[i]

                if(patched <= count){
                    const k = keyIndex[oldVNode.key]
                    if(typeof k !== 'undefined'){
                        newVNode = newChildren[k]
                        patch(oldVNode,newVNode,container)
                        patched++
                        source[k - newStart] = i

                        if(k < pos){
                            moved = true
                        }else{
                            pos = k
                        }
                    }else{
                        unmount(oldVNode)
                    }
                }else{
                    unmount(oldVNode)
                }

            }
            if(moved){
                const seq = getSequence(source)
                let s = seq.length - 1
                let i = count - 1
                for(i; i >= 0 ;i--){
                    if(source[i] === -1){
                        const pos = i + newStart
                        const newVNode = newChildren[pos]
                        const nextPos = pos + 1
                        const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
                        patch(null,newVNode,container,anchor)
                    }else if(i !== seq[s]){
                        const pos = i + newStart
                        const newVNode = newChildren[pos]
                        const nextPos = pos + 1
                        const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
                        insert(newVNode.el,container,anchor)

                    }else{
                        s--
                    }
                }
            }
        }
    }

    function unmount(vnode){
        if(vnode.type === Fragment){
            vnode.children.forEach(c=>unmount(c))
            return
        }
        removeElement(vnode.el)
    }

    function patch(n1,n2,container,anchor){
        if(n1 && n1.type !== n2.type){
            unmount(n1)
            n1 = null
        }
        const {type} = n2

        if(typeof type === 'string'){
            if(!n1){
                mountElement(n2,container,anchor)
            }else{
                patchElement(n1,n2)
            }
        }else if(type === Text){
            if(!n1){
                const el = n2.el = createText(n2.children)
                insert(el,container)
            }else{
                const el = n2.el = n1.el
                if(n2.children !== n1.children){
                    setText(el,n2.children)
                }
            }
        }else if(type === Fragment){
            if(!n1){
                n2.children.forEach(c=>patch(null,c,container))
            }else{
                patchChildren(n1,n2,container)
            }
        }

    }

    function render(vnode,container) {
        if(vnode){
            patch(container._vnode,vnode,container)
        }else{
            if(container._vnode){
                unmount(container._vnode)
            }
        }
        container._vnode = vnode
    }

    return {
        render
    }
}

const renderer = createRenderer({
    createElement(tag){
        return document.createElement(tag)
    },
    removeElement(el){
        const parent = el.parentNode
        if(parent){
            parent.removeChild(el)
        }
    },
    setElementText(el,text){
        el.textContent = text
    },
    insert(el,parent,anchor = null){
        parent.insertBefore(el,anchor)
    },
    createText(text){
        return document.createTextNode(text)
    },
    setText(el,text){
        el.nodeValue = text
    },
    patchProps(el,key,preValue,nextValue){
        if(/^on/.test(key)){
            const invokers = el._vei || (el._vei = {})
            let invoker = invokers[key]
            const name = key.slice(2).toLowerCase()
            if(nextValue){
                if(!invoker){
                    invoker = el._vei[key] = (e) => {
                        if(e.timeStamp < invoker.attached){
                            return
                        }
                        if(Array.isArray(invoker.value)){
                            invoker.value.forEach(fn => fn(e))
                        }else{
                            invoker.value(e)
                        }
                    }
                    invoker.value =  nextValue
                    invoker.attached = performance.now()
                    el.addEventListener(name,invoker)
                }else{
                    invoker.value = nextValue
                }
            }else if(invoker){
                el.removeEventListener(name,invoker)
            }
        }else if(key === 'class'){
            el.className = nextValue || ''
        }else if(shouldSetAsProps(el,key,nextValue)){
            const type = typeof el[key]
            if(type === 'boolean' && nextValue === ''){
                el[key] = true
            }else{
                el[key] = nextValue
            }
        }else{
            el.setAttribute(key,nextValue)
        }
    }
})

const Text = Symbol()
const Comment = Symbol()
const Fragment = Symbol()
```

