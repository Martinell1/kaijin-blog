---
title: JavaScript基础-继承
date: '2021-12-10 22:54:53'
categories:
 - FrontEnd
tags:
 - JS
 - 原型/原型链
---



## 原型链继承

```JavaScript
function A(){
}

function B(){

}

**A.prototype = new B();**
```

引用值问题

## 盗用构造函数继承

```JavaScript
function A(value){
  **B.call(this,value)**
}

function B(value){
  this.value = value;
}
```

函数重用问题

## 组合式继承

```JavaScript
function A(value){
 ** B.call(this,value)**
}

function B(value){
  this.value = value;
}

**B.prototype.fn = ()=>{
  console.log('需要共享的属性定义在B.prototype上');
}**

**A.prototype = new B();**
```

调用两次父类构造函数

## 原型式继承

```JavaScript
function A(){

}

function B(o){
**  function F(){}
  F.prototype = o;
  return new F()**
}
```

引用值问题

## 寄生式继承

```JavaScript
function A(){

}

function B(o){
**  let cloneObj = Object.create(o)
  cloneObj.fn = ()=>{
    console.log('对象增强');
  }
  return cloneObj;**
}
```

函数重用问题

## 寄生式组合继承

```JavaScript
function inherit(son,father){
**  let prototype = Object.create(father.prototype);
  prototype.constructor = son;
  son.prototype = prototype; **
}
```