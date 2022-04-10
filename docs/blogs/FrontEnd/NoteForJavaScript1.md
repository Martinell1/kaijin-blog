---
title: 读书笔记-你不知道的JavaScript（一）
date: '2022-03-31 20:32:09'
categories:
 - FrontEnd
tags:
 - JS
---

## LHS和RHS

左查询和右查询

当变量出现在赋值操作左边时是左查询

当变量出现在赋值操作右边时是右查询

左查询和右查询可以出现在同一个语句里，如下：

```JavaScript
let a = 3 //LHS
let b = a //LHS and RHS

```



## eval和with

### eval

```Mermaid
flowchart LR
      A([eval函数])-->B[接收一个参数]
      B-->C{是否为字符串类型?}
      C--是-->D[该字符串作为JavaScript代码进行编译]
      C--否-->E[返回该参数]
      D-->F{是否为编译成功?}
      F--是-->G[开始执行代码]
      F--否-->H[语法错误syntaxError]
      G-->I{是否有返回值}
      I--是-->J[返回值]
      I--否-->K[返回undefined]

```

eval所声明和查询的变量在它所处的作用域范围。

```JavaScript
var geval = eval; 
var x = 'global',y = 'global'; 
function f(){
    var x = 'local';
    eval('x += "changed";');
    return x;
}
function g(){
    var y = 'local';
    geval('y += "changed";');
    return y;
}
console.log(f(),x);//localchanged global
console.log(g(),y);//local globalchanged
```

在函数f内查询的x值为局部作用域定义的'local'，

在函数g内查询的y值，由于调用的geval方法定义在全局作用域，所以geval中变量y的查询会在全局作用域中进行。



### with

> with通常被当作重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身。

```JavaScript
var obj = {
  a:1,
  b:2,
  c:3
}

obj.a = 1;
obj.b = 2;
obj.c = 3;

with(obj){
    a = 1,
    b = 2,
    c = 3
}
```

with的使用可以帮助我们快速的进行对象的属性赋值，但是with操作不能添加不存在的属性，如下：

```JavaScript
var obj = {
    
}

with(obj){
    o = 1
}

console.log(obj.o); //undefined
console.log(o);     //1

```

可以看到，并没有如我们预期的那样执行obj.o = 1，且该o变量泄漏到了全局变量中。

> with可以将对象处理为一个完全隔离的词法作用域，因此该对象的属性也会被处理为定义在该作用域中的词法标识符。

当我们执行with(...)时，它会将obj作为作用域，并且进行LHS查询。

由于在全局作用域内也没有找到o变量，最终在全局作用域中声明了o并执行o=1。



eval和with都会使引擎无法在编译阶段进行优化，从而导致性能下降。

且在实际编码中很少用到，在严格模式下也不支持。

因此二者都不推荐使用。