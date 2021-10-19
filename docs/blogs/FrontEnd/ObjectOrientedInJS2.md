---
​---
title: JavaScript中的面对对象（二）
date: '2021-10-10 23:00:19'
categories:
 - FrontEnd
tags:
 - JS
 - 原型/原型链
 - 继承
​---
---



## 继承

与其他面对对象语言，JavaScript中并不支持接口继承，实现继承是JavaScript唯一支持的继承方式，

而这种继承主要是通过原型链实现的。



### 原型链

回顾一下构造函数，实例和原型的关系：

每个构造函数都有一个原型对象，

每个原型对象都有一个`constructor`属性指向构造函数

每个实例对象都可以通过[[Prototype]]属性找到它的原型



那么，如果原型是另一个类型的实例呢？

那就意味着这个原型本身就有一个[[Prototype]]属性指向另一个原型，

而相应的，另一个原型也有一个`constructor`属性指向它对应的构造函数。



这样就在实例和原型之间构造了一条原型链。

```js
function SuperType(){
  this.property = true;
}

SuperType.prototype.getSuperValue = function(){
  return this.property;
}

function SubType(){
  this.subProperty = false;
}

SubType.prototype = new SuperType();
SubType.prototype.getSubValue = function(){
  return this.subProperty;
}

let instance = new SubType();

console.log(instance.getSuperValue());  //true
```

以上代码定义了两个类型：`SubperType`和`SubTyp`。

`SubType`通过将自己的`prototype`属性设置为`SuperType`实例，

从而实现了继承，基于此，`SuperType`实例可以访问的所有属性和方法都会存在于`SubType.prototype`。

![image-20211011002619172](https://gitee.com/ashene/pic-go/raw/master/image-20211011002619172.png)



当`instance`调用`getSuperValue()`方法时，由于其构造函数中并没有这个方法，

于是`instance`顺着原型链向上寻找，在找到`SubType`的原型时，仍没有找到该方法，

于是`instance`继续向上寻找，找到`SuperType.protype`上定义了该方法时，将该方法返回给`instance`

同时，由于方法的实际调用者是`instance`，此时的`this`指向`instance`

所以成功打印出`true`



#### 默认原型

![image-20211011003909975](https://gitee.com/ashene/pic-go/raw/master/image-20211011003909975.png)

实际上，原型链还有默认的一环，`Object`，所有的引用类型都继承于`Object`

而函数的默认原型也是一个`Object`的实例，这意味着这个实例有一个内部指针指向`Object.prototype`

这也是为什么自定义类型能够继承包括`toString()`，`valueOf()`等默认方法的原因



#### 原型与继承关系

原型与实例的关系可以通过两种方法来确定

第一种方式是使用`instanceof`操作符，如果一个实例的原型链中出现过相应的构造函数，则`instanceof`返回`true`

```js
console.log(instance instanceof Object);    //true
console.log(instance instanceof SuperType); //true
console.log(instance instanceof SubType);   //true
```

第二种方式是使用`isPrototypeOf`

```js
console.log(Object.prototype.isPrototypeOf(instance));      //true
console.log(SuperType.prototype.isPrototypeOf(instance));   //true
console.log(SubType.prototype.isPrototypeOf(instance));     //true
```



#### 关于方法

子类有时候需要覆盖父类的方法，或者增加父类没有的方法。

为此，这些方法必须在原型赋值之后再添加到原型上：

```js
function SuperType(){
  this.property = true;
}

SuperType.prototype.getSuperValue = function(){
  return this.property;
}

function SubType(){
  this.subProperty = false;
}

SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function(){
  return this.subProperty;
}

SubType.prototype.getSuperValue = function(){
  return false;
}

let instance = new SubType();
console.log(instance.getSuperValue());  //false
```



通过对象字面量方式创建原型方法会破坏之前的原型链，因为这相当于重写了原型链。

```js
function SuperType(){
  this.property = true;
}

SuperType.prototype.getSuperValue = function(){
  return this.property;
}

function SubType(){
  this.subProperty = false;
}

SubType.prototype = new SuperType();

SubType.prototype = {
  getSubValue(){
    return this.subProperty;
  }
  getSuperValue(){
    return false;
  }

}

let instance = new SubType();
console.log(instance.getSuperValue());  //Unexpected identifier
```

在这段代码中，`SubType。prototype`被对象字面量覆盖后，

失去了原本指向原型的[[Prototype]]指针，因此无法再正确指向`SuperType`的实例。



#### 原型链的问题

原型链的主要问题在于原型中包含引用值的时候，该引用值会全局共享，类似于`static`

这也是为什么属性通常在构造函数中定义而不会定义在原型上

在使用原型实现继承时，原型实际上变成了另一个类型的实例。

这意味着原先的实例属性变成了原型属性。

比如前文我们尝试过给`person1`的`friends`属性中添加一个人名，而这个人名同样会出现在`person2`的`friends`中



原型链的第二个问题是，子类型在实例化时不能给父类型的构造函数传参。

事实上，我们无法在不影响所有对象实例的情况下把参数传进父亲的构造函数。



加上引用值问题，就导致了原型链基本不会被单独使用。



### 盗用构造函数

为了解决原型包含引用值导致的继承问题，一种叫作`盗用构造函数`（constructor stealing）的技术在开发社区流行起来

（这种技术有时也称作`对象伪装`，或`经典继承`）。

基本思路是：在子类构造函数中调用父类构造函数。

因为函数就是在特定上下文中执行代码的简单对象，所以可以使用`apply()`和`call()`方法以新创建的对象为上下文执行构造函数。

```js
function SuperType(){
  this.colors = ["red","blue","green"];
}

function SubType(){
  SuperType.call(this);
}

let instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors);  //[ 'red', 'blue', 'green', 'black' ]

let instance2 = new SubType();
console.log(instance2.colors);  //[ 'red', 'blue', 'green' ]
```

通过使用`apply()`或`call()`方法，`SuperType`的构造函数在为`SubType`的实例创建的新对象的上下文中执行了。

这相当于新的`SubType`对象上运行了`SuperType(`)函数中的所有初始化代码。

结果就是每个实例都会有自己的`colors`属性



#### 传递参数

相比于使用原型链，盗用构造函数的一个优点就是可以在子类构造函数中调用父类构造函数传参。

```js
function SuperType(name){
  this.name = name;
}

function SubType(){
  SuperType.call(this,"zhangsan");

  this.age = 29;
}

let instance = new SubType();
console.log(instance.name); //"zhangsan"
console.log(instance.age);  //29
```

在这个🌰中，`SuperType`构造函数接受一个参数`name`，然后将它赋给一个属性。

在`SubType`构造函数中调用`SuperType`构造函数时传入这个参数，实际上会在`SubType`的实例上定义name属性。

为确保`SuperType`构造函数不会覆盖`SubType`定义的属性，可以在调用父类构造函数之后再给予子类实例添加额外的属性。



#### 盗用构造函数的问题

盗用构造函数的主要缺点，也是使用构造函数模式自定义类型的问题：

必须在构造函数中定义方法，因此函数不能重用。

此外，子类也不能访问父类原型上定义的方法，

因此所有类型只能使用构造函数模式。

由于这些问题，盗用构造函数基本上不能单独使用。



### 组合继承

组合继承（也叫伪经典继承）综合了原型链和盗用构造函数，将两者的优点集中了起来。

基本的思路是：使用原型链继承上的属性和方法，而通过盗用构造函数继承实例属性。

这样既可以把方法定义在原型上以实现重用，又可以让每个实例都有自己的属性。

```js
function SuperType(name){
  this.name = name;
  this.colors = ["red","blue","green"]
}

SuperType.prototype.sayName = function(){
  console.log(this.name);
}

function SubType(){
  //继承方法
  SuperType.call(this,"zhangsan");

  this.age = 29;
}

SubType.prototype = new SuperType();

SubType.prototype.sayAge = function(){
  console.log(this.age);
}

let instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors);  //[ 'red', 'blue', 'green', 'black' ]
instance1.sayName();            //"zhangsan"
instance1.sayAge();             //29

let instance2 = new SubType();  
console.log(instance2.colors);  //[ 'red', 'blue', 'green' ]
instance2.sayName();            //"zhangsan"
instance2.sayAge();             //29
```

在这个🌰中，`SuperType`构造函数定义了两个属性，`name`和`colors`,而它的原型上也定义了一个方法叫`sayName()`。

`SubType`构造函数调用了`SuperType`构造函数，传入了`name`参数，然后又定义了自己的属性`age`.

`SubType.prototype`也被赋值为`SuperType`的实例。

原型赋值之后，又在这个原型上添加了新方法`sayAge()`。

这样，就可以创建两个`SubType`实例，

让这两个实例都有自己的属性，包括colors，同时还共享方法。



组合继承弥补了原型链和盗用构造函数的不足，是`JavaScript`中使用最多的继承模式。

而且组合继承也保留了`instanceof`操作符和`isPrototypeOf()`方法识别合成对象的能力。



### 原型式继承

即时不自定义类型也可以通过原型实现对象之间的信息共享。

```js
function object(o){
  function F(){}
  F.prototype = o;
  return new F();
}
```

这个`object()`函数会创建一个临时构造函数，将传入的对象赋值给这个构造函数的原型，然后返回这个临时类型的一个实例。

本质上`object()`是对传入的对象执行了一次浅复制。

```js
let person = {
  name:"zhangsan",
  friends:["lisi","wangwu"]
}

let anotherPerson = object(person);
anotherPerson.name = "ming"
anotherPerson.friends.push("uzi")

let yetAnotherPerson = object(person);
yetAnotherPerson.name = "gala"
yetAnotherPerson.friends.push("xiaohu");

console.log(person.friends);  //[ 'lisi,wangwu', 'uzi', 'xiaohu' ]
```

这种原型式继承适用于这种情况：

你有一个对象，想在它的基础上再创建一个新对象。你需要把这个对象先传给`object()`，然后再对返回的对象进行适当修改。

在这个🌰中，`person`对象定义了另一个对象也应该共享的信息，把它传给`object()`之后会返回一个新对象。

这个新对象的原型是person，意味着它的原型上既有原始值属性又有引用值属性。

这也意味着`person.friends`不仅是person的属性，也会跟`anotherPerson`和`yetAnotherPerson`共享。这里实际克隆了两个`person`。



ECMAScript5通过增加`Object.create()`方法将原型式继承的概念规范化了。

这个方法接受两个参数：作为新对象原型的对象，以及给新对象定义额外属性的对象（第二个可选）。

在只有一个参数时，`Object.create()`与这里的Object()方法效果相同

```js
let person = {
  name:"zhangsan",
  friends:["lisi","wangwu"]
}

let anotherPerson = Object.create(person)
anotherPerson.name = "ming"
anotherPerson.friends.push("uzi")

let yetAnotherPerson = Object.create(person)
yetAnotherPerson.name = "gala"
yetAnotherPerson.friends.push("xiaohu");

console.log(person.friends);  //[ 'lisi,wangwu', 'uzi', 'xiaohu' ]
```

`Object.create()`的第二个参数与`Object.defineProperties()`的第二个参数一样：

每个新增属性都通过各自的描述符来描述。以这种方式添加的属性被遮蔽原型对象上的同名属性。

```js
let person = {
  name:"zhangsan",
  friends:["lisi","wangwu"]
}

let anotherPerson = Object.create(person,{
  name:{
    value:"lisi"
  }
})

console.log(anotherPerson.name);  //"lisi"
```

原型式继承非常适合不需要单独创建构造函数，但仍需在对象间共享信息的长河。

但是原型式继承中，属性中包含的引用值始终会在相关对象间共享，跟使用原型模式是一样的。



### 寄生式继承

与原型式继承比较接近的一种继承方式是寄生式继承（parasitic inheritance）。

寄生式继承背后的思路类似于寄生构造函数和工厂模式：

创建一个实现继承的函数，以某种方式增强对象，然后返回这个对象。

```js
function createAnother(original){
  let clone = object(original);	//通过调用函数创建一个新对象
  clone.sayHi = function(){		//以某种方式增强这个对象
    console.log("hi");
  }
  return clone;					//返回这个对象
}
```

在这段代码中，`createAnother()`函数接收了一个参数，就是新对象的基准对象。

这个对象`original`会被传给`objet()`函数，然后将返回的新对象赋值给`clone`。

接着`clone`对象添加一个新方法`sayHi()`，最后返回这个对象。

```js
let person = {
  name:"zhangsan",
  friends:["lisi","wangwu"]
}

let anotherPerson = createAnother(person)
anotherPerson.sayHi();  //"hi"
```

这个🌰基于`person`对象返回了一个新对象。

新返回的`anotherPerson`对象具有`person`的所有属性和方法，还有一个新方法叫`sayHi()`



寄生式继承同样适合主要关注对象，而不在乎类型和构造函数的场景。

`object()`函数不是寄生式继承所必须的，任何返回新对象的函数都可以在这里使用。



**注意：通过寄生式继承给对象添加函数会到时函数难以重用，与构造函数模式类似。**



### 寄生式组合继承

组合继承其实也存在效率问题。

最主要的效率问题是父类构造函数始终会被调用两次：

一次是在创建子类原型时调用，另一次是子类构造函数中调用。

本质上，子类原型最终是要包含超类对象的所有实例属性，子类构造函数只要在执行时重写自己的原型就行了。

```js
function SuperType(name){
  this.name = name;
  this.colors = ["red","green","black"];
}

SuperType.prototype.sayName = function(){
  console.log(this.name);
}

function SubType(name,age){
  SuperType.call(this,name);  //第二次调用SuperType()
  this.age = age;
}

SubType.prototype = new SuperType();  //第一次调用SuperType()
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
  console.log(this.age);
}
```



寄生式组合继承通过盗用构造函数继承属性，但使用混合式原型链继承方法。

基本思路是不通过父类构造函数给子类原型赋值，而是取得父类原型的一个副本。

说到底就是用寄生式继承来继承父类原型，然后将返回的新对象赋值给子类原型。

```js
function inheritPrototype(subType,superType){
  let prototype = Object(superType.prototype);  //创建对象
  prototype.constructor = subType;              //增强对象
  subType.prototype = prototype;                //赋值对象
}
```

这个`inheritPrototype()`函数实现了寄生式组合继承的核心逻辑。

这个函数接收两个参数：子类构造函数和父类构造函数。

在这个函数内部，第一步是创建父类原型的一个副本。

然后，给返回的`prototype`对象设置`constructor`属性，解决由于重写原型导致默认`constructor`丢失的问题。

最后将新创建的对象赋值给子类型的原型。

```js
function SuperType(name){
  this.name = name;
  this.colors = ["red","green","black"];
}

SuperType.prototype.sayName = function(){
  console.log(this.name);
}

function SubType(name,age){
  SuperType.call(this,name);
  this.age = age;
}

inheritPrototype(SubType,SuperType);

SubType.prototype.sayAge = function(){
  console.log(this.age);
}
```

这里只调用了一次`SuperType`构造函数，避免了`SubType.prototype`上不必要也用不到的属性，因此可以说这个🌰的效率更高。

而且，原型键仍保持不变，因此`instanceOf`操作符和`isPrototypeOf()`方法正常有效。

寄生式组合继承可以算是引用类型继承的 最佳模式。