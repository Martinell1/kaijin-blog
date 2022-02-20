---
title: JavaScript基础-原型链
date: '2021-12-09 22:54:53'
categories:
 - FrontEnd
tags:
 - JS
 - 原型/原型链
---

## What

简单来说，我们尝试访问对象的某个属性时，它会先在自身属性上寻找，如果找不到，那么它会__proto__这个属性找到自身的原型对象，并在原型对象上搜索是否有同名的属性，这样的寻找会在两种情况下停止：

1. 在某个对象上找到了同名属性，返回该值。
2. 寻找到了null，返回undefined。

这样链状的结构便是我们所说的原型链。

## How

```JavaScript
function Person(name,age){
  this.name = name;
  this.age = age;
  this.race = '人类'
}

function Animal(){
  this.eat = function(){
    console.log('该物种能吃东西');
  }
}

Person.prototype = new Animal();

const person1 = new Person('zs',20);
person1.eat() //该物种能吃东西
console.log(person1);//Animal { name: 'zs', age: 20, race: '人类' }

const person2 = new Person('ls',22);
person1.eat() //该物种能吃东西
console.log(person2);//Animal { name: 'ls', age: 22, race: '人类' }
```

通过上面代码，我们可以得到两个结论：

- 在原型上定义的属性和方法，可以在多个实例间共享。
- 属性的值会在原型链上逐级寻找。

## Why

通过原型链，可以实现类似“继承”的效果

### 原型链的不足

原型上的属性若是引用值，如数组类型，该属性会被其所有实例对象所共享。

## Others

### prototype

构造函数上的属性，可通过该属性访问原型。

### **proto**

实例上的属性，可通过该属性访问原型。

### constructor

原型上的属性，可通过该属性访问构造函数。