---
title: Vue的diff算法
date: '2022-06-06 16:13:51'
categories:
 - FrontEnd
tags:
 - JS
 - Vue
 - 源码


---



## Diff算法

在渲染器中，我们提到了，在更新视图时我们会调用`patchChildren`函数，在该函数内部，会根据子节点的情况采取不同的措施，

当新旧子节点都为数组节点时，为了以最小的性能开销完成更新操作，我们需要采取diiff算法进行比较两组子节点。

### 简单diff

```js
function patchKeyedChildren(n1,n2,container){
    //获取新旧子节点
    const oldChildren = n1.children
    const newChildren = n2.children
    //记录最大索引值
    let lastIndex = 0;
    //遍历新子节点
    for(let i = 0 ; i < newChildren.length; i++){
        const newVNode = newChildren[i]
        //记录对应的旧子节点的下标
        let j = 0
        //记录新子节点是否存在对应旧节点
        let find = false
        //遍历旧子节点
        for(j ; j < oldChildren.length; j++){
            const oldVNode = oldChildren[j]
            //新旧子节点key相同
            if(newVNode.key === oldVNode.key){
                //find标记为true
                find = true
                //执行更新操作
                patch(oldVNode,newVNode,container)
                if(j < lastIndex){
                    //当前节点在旧children中的索引小于最大索引值
                	//需要移动
                    const preVNode = newChildren[i - 1]
                    if(preVNode){
                        const anchor = preVNode.el.nextSibling
                        insert(newVNode.el,container,anchor)
                    }
                }else{
                    lastIndex = j
                }
                break
            }
        }
        //没有找到对应的旧子节点
        //需要执行挂载
        if(!find){
            const preVNode = newChildren[i - 1]
            let anchor = null
            if(preVNode){
                const anchor = preVNode.el.nextSibling
                }else{
                    anchor = container.firstChild
                }
            patch(null,newVNode,container,anchor)
        }
    }

    //遍历旧的子节点，所有不存在于新children中的节点执行卸载
    for(let i = 0 ; i < oldChildren.length; i++){
        const oldVNode = oldChildren[i]
        const has = newChildren.find(
            vnode => vnode.key === oldVNode.key
        )
        if(!has){
            unmount(oldVNode)
        }
    }
}

```



### 双端diff

```js
function patchKeyedChildren(n1,n2,container){
    //拿到新旧子节点及头尾节点和索引
    const oldChildren = n1.children
    const newChildren = n2.children
    let oldStartIdx = 0
    let oldEndIdx = oldChildren.length - 1
    let newStartIdx = 0
    let newEndIdx = newChildren.length - 1
    let oldStartVNode = oldChildren[oldStartIdx]
    let oldEndVNode = oldChildren[oldEndIdx]
    let newStartVNode = newChildren[newStartIdx]
    let newEndVNode = newChildren[newEndIdx]
    
    while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx){
        if(!oldStartVNode){
            //旧的头节点为空
        	//按照索引向后推进
            oldStartVNode = oldChildren[++oldStartIdx]
        }else if(!oldEndVNode){
            //旧的尾节点为空
        	//按照索引向前推进
            oldEndVNode = oldChildren[--oldEndIdx]
        }else if(oldStartVNode.key === newStartVNode.key){
            //新旧头节点的key相同
            patch(oldStartVNode,newStartVNode,container)

            oldStartVNode = oldChildren[++oldStartIdx]
            newStartVNode = newChildren[++newStartIdx]
        }else if(oldEndVNode.key === newEndVNode.key){
            //新旧尾节点的key相同
            patch(oldEndVNode,newEndVNode,container)

            oldEndVNode = oldChildren[--oldEndIdx]
            newEndVNode = newChildren[--newEndIdx]
        }else if(oldStartVNode.key === newEndVNode.key){
            //旧头节点的key与新尾节点的key相同
            patch(oldStartVNode,newEndVNode,container)
            //需要移动oldStartVNode.el到oldEndVNode.el后面
            insert(oldStartVNode.el,container,oldEndVNode.el.nextSibling)

            oldStartVNode = oldChildren[++oldStartIdx]
            newEndVNode = newChildren[--newEndIdx]
        }else if(oldEndVNode.key === newStartVNode.key){
            //旧尾节点的key与新头节点的key相同
            patch(oldEndVNode,newStartVNode,container)
            //需要移动oldEndVNode.oldStartVNode.el前面
            insert(oldEndVNode.el,container,oldStartVNode.el)

            oldEndVNode = oldChildren[--oldEndIdx]
            newStartVNode = newChildren[++newStartIdx]
        }else{
            //以上四条都未命中
            //需要遍历旧children，拿到新children的头节点对应旧节点的索引
            const idxInOld = oldChildren.findIndex(
                node => node.key === newStartVNode.key
            )
          
            if(idxInOld > 0){
                //找到该索引
                //将该索引所在的节点作为旧的头结点
                const vnodeToMove = oldChildren[idxInOld]
                patch(vnodeToMove,newStartVNode,container)
                insert(vnodeToMove.el,container,oldStartVNode.el)
                //该节点已被移动
                //将此社会之为undefined
                oldChildren[idxInOld] = undefined
            }else{
                //没有找到，执行挂载新头节点
                patch(null,newStartVNode,container,oldStartVNode.el)
            }
            newStartVNode = newChildren[++newStartIdx]
        }
    }
   
    if(oldStartIdx < oldEndIdx && newStartIdx <= newEndIdx){
        //有新子节点遗留，需要挂载
        for(let i = newStartIdx; i <= newEndIdx ; i++){
            patch(null,newChildren[i],container,oldStartVNode.el)
        }
    }else if(newEndIdx < newStartIdx && oldStartIdx <= oldEndIdx){
        //有旧子节点遗留，需要卸载
        for(let i = oldStartIdx; i <= oldEndIdx ; i++){
            unmount(oldChildren[i])
        }
    }
}
```



### 快速diff

```js
function patchKeyedChildren(n1,n2,container){
    const newChildren = n2.children
    const oldChildren = n1.children
	//处理相同的前置节点
    //j指向新旧子节点的开头
    let j = 0
    let oldVNode = oldChildren[j]
    let newVNode = newChildren[j]

    while(oldVNode.key === newVNode.key){
        patch(oldVNode,newVNode,container)
        j++
        oldVNode = oldChildren[j]
        newVNode = newChildren[j]
    }

    //处理相同的后置节点
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
        //有新节点需要挂载
        const anchorIndex = newEnd + 1
        const anchor = anchorIndex < newChildren.length ? newChildren[anchorIndex].el : null
        while(j <= newEnd){
            patch(null,newChildren[j++],container,anchor)
        }
    }else if( j > newEnd && j <= oldEnd){
        //旧节点需要卸载
        while(j<=oldEnd){
            unmount(oldChildren[j++])
        }
    }else{
        const count = newEnd - j + 1
        //构造数组处理剩余节点
        const source = new Array(count).fill(-1)

        const oldStart = j
        const newStart = j

        let moved = false
        //遍历中的最大索引值
        let pos = 0

        //索引表
        //新子节点的key对应的index
        const keyIndex = {}
        for(let i = newStart; i <= newEnd ;i++){
            keyIndex[newChildren[i].key] = i
        }
        let patched = 0
        //遍历旧子节点
        for(let i = oldStart; i <= oldEnd ; i++){
            const oldVNode = oldChildren[i]

            if(patched <= count){
              	// k  = oldVNode.key => newVnode.key ? index : undefined
                const k = keyIndex[oldVNode.key]
                if(typeof k !== 'undefined'){
                    //k不为undefined
                    //拿到新子节点
                    newVNode = newChildren[k]
                    patch(oldVNode,newVNode,container)
                    patched++
                    source[k - newStart] = i

                    if(k < pos){
                        //遍历过程中的索引值需要呈递增趋势
                        moved = true
                    }else{
                        pos = k
                    }
                }else{
                    //在新子节点中没有找到，即卸载旧节点
                    unmount(oldVNode)
                }
            }else{
                //新节点已全部处理完，卸载旧节点
                unmount(oldVNode)
            }

        }
        if(moved){
            //计算最长递增子序列
            //不发生位置移动
            const seq = getSequence(source)
            //s指向最长递增子序列中的的最后一个
            let s = seq.length - 1
            //i指向新一组子节点中的最后一个
            let i = count - 1
            //开启for循环使i递减
            for(i; i >= 0 ;i--){
                if(source[i] === -1){
                    //当前位置节点为新节点，应执行挂载
                    const pos = i + newStart
                    const newVNode = newChildren[pos]
                    const nextPos = pos + 1
                    const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
                    patch(null,newVNode,container,anchor)
                }else if(i !== seq[s]){
                    //该节点需要移动
                    const pos = i + newStart
                    const newVNode = newChildren[pos]
                    const nextPos = pos + 1
                    const anchor = nextPos < newChildren.length ? newChildren[nextPos].el : null
                    insert(newVNode.el,container,anchor)

                }else{
                    //i等于seq[s]时，说明该位置的节点不需要移动
                    //只需要让s指向下一个位置
                    s--
                }
            }
        }
    }
}
```



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
```



