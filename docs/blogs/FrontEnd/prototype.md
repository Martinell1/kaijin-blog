---
title: Prototype
date: '2021-10-07 00:01:29'
categories:
 - FrontEnd
tags:
 - JS
---

ES6中的类没有变量提升 s


类中共有的属性和方法要加this使用


JavaScript中每次new一个新对象，就会开辟一个内存空间，造成内存浪费。

因此引入prototype，prototyoe存储所有的对象公有的方法，

但对象的共有属性仍定义到构造方法里。



实例对象身上的____proto____和构造函数中的prototype是同一个东西，

或者说实例对象的____proto____指向构造函数中的prototype。