---
title: JavaScript中的面对对象（三）
date: '2021-10-19 23:00:35'
categories:
 - FrontEnd
tags:
 - JS
 - 对象
 - 原型/原型链
---

## 类

ES6中新引入的`class`关键字拥有正式定义类的能力。

尽管它背后仍是原型和构造函数的概念，但新语法糖的引入使得代码不会过于冗长和混乱。



### 类定义

定义类有两种主要方式：类声明和类表达式。

```js
//类声明
class Person{}

//类表达式
const Animal = class{}
```

与函数表达式类似，类表达式在它们被求值前也不能引用。

不过，与函数定义不同的是，函数声明可以提升，而类定义不可以。

```js
console.log(FunctionExpression);      //undefined
var FunctionExpression = function(){};
console.log(FunctionExpression);      //[Function: FunctionExpression]

console.log(FunctionDeclaration);         //[Function: FunctionDeclaration]
function FunctionDeclaration(){};
console.log(FunctionDeclaration);         //[Function: FunctionDeclaration]

console.log(ClassExpression);      //undefined
var ClassExpression = class{};
console.log(ClassExpression);      //[class ClassExpression]

console.log(ClassDeclaration);         //ReferenceError: Cannot access 'ClassExpression' before initialization
class ClassDeclaration{};
console.log(ClassDeclaration);         //[class ClassDeclaration]
```

另一个与函数声明不同的地方是：函数受函数作用域限制，而类受块作用域限制。

```js
{
  function FunctionDeclaration(){}  
  class ClassDeclaration{}
}

console.log(FunctionDeclaration); //[Function: FunctionDeclaration]
console.log(ClassDeclaration);    //ReferenceError: ClassDeclaration is not defined
```



### 类构造函数

`constructor`关键字用于在类定义块内部创建类的构造函数。

方法名`constructor`会告诉解释器在使用`new`操作符创建类的新实例时，应该调用这个函数。



#### 实例化

使用`new`调用类的构造函数会执行如下操作：

1. 在内存中创建一个新对象。
2. 这个新对象内部的[[Prototype]]指针被赋值为构造函数的`prototype`属性。
3. 构造函数内部的`this`被赋值为这个新对象。
4. 执行构造函数内部的代码。
5. 如果构造函数返回非空对象，则返回该对象；否则，返回新创建的对象。



#### 把类当做特殊函数

ES中并没有正式的类这个类型。

从各方面来看，ES中的类就是一种特殊函数。

声明一个类后，通过`typeof`操作符检测类，可以看出它是一个函数。

```js
class Person{}

console.log(typeof Person); //function
```



类本身具有和普通构造函数一样的行为。

在类的上下文中，类本身在使用`new`调用时就会被当做构造函数。

重点在于，类中定义的`constructor`方法不会被当成构造函数，在对它使用`instanceof`操作符时会返回`false`。

但是，如果再创建实例时直接将类构造函数当成普通构造函数来使用，那么`instanceof`操作符被返回`true`。

```js
class Person{}

let p1 = new Person();

console.log(p1.constructor === Person);         //true
console.log(p1 instanceof Person);              //true
console.log(p1 instanceof Person.constructor);  //false

let p2 = new Person.constructor();

console.log(p2.constructor === Person);         //false
console.log(p2 instanceof Person);              //false
console.log(p2 instanceof Person.constructor);  //true
```



### 实例，原型和类成员

类的语法可以非常方便的定义应该存在于实例上的成员、应该存在于原型上的成员、以及应该存在于类本身的成员。



#### 实例成员

每次通过`new`调用类标识符时，都会执行类构造函数。

在这个函数内部，可以为新创建的实例（this）添加“自有”属性。

在构造函数执行完毕后，仍然可以给实例继续添加新成员。



每个实例都对应一个唯一的成员对象，这意味着所有成员都不会在原型上共享。

```js
class Person{
  constructor(){
    this.name = new String("zhangsan");

    this.sayName = () => {
      console.log(this.name);
    }

    this.nicknames = ["san","zhang"]
  }
}


let p1 = new Person();
let p2 = new Person();

p1.sayName(); //[String: 'zhangsan']
p2.sayName(); //[String: 'zhangsan']

console.log(p1.name === p2.name);           //false
console.log(p1.namsayNamee === p2.sayName); //false
console.log(p1.nicknames === p2.nicknames); //false

p1.name = p1.nicknames[0];
p2.name = p2.nicknames[1];

p1.sayName(); //san
p2.sayName(); //zhang
```



#### 原型方法和访问器

为了在实例间共享方法，类兴义语法把在类块中定义的方法作为原型方法。

```js
class Person{
  constructor(){
    this.locate = () => {
      console.log('instance');
    }
  }

  locate(){
    console.log('prototype');
  }
}

let p = new Person();
p.locate();                 //instance
Person.prototype.locate();  //prototype
```

可以把方法定义在类构造函数中或者类块中，但不能在类块中给原型添加原始值或对象作为成员数据。

```js
class Person{
  name:"zhangsan"
}
//SyntaxError: Unexpected identifier
```



类方法等同于对象属性，因此可以用字符串、符号或计算的值作为建。

```js
const symbolKey = Symbol('symbolKey');

class Person{

  stringKey(){
    console.log('invoked stringKey');
  }

  [symbolKey](){
    console.log('invoked symbolKey');
  }

  ['computed' + 'Key'](){
    console.log('invoked computedKey');
  }
}

let p = new Person();
p.stringKey();    //invoked stringKey
p[symbolKey]();   //invoked symbolKey
p.computedKey();  //invoked computedKey
```



类定义也支持获取和设置访问器。

```
class Person{
  set name(newName){
    this.name_ = newName;
  }

  get name(){
    return this.name_;
  }
}

let p = new Person();
p.name = "zhangsan";
console.log(p.name);  //zhangsans
```



#### 静态类方法

可以在类上定义静态方法。

这些方法通常用于执行不特定于实例的操作，也不要求存在类的实例。

与原型成员相似，每个类上只能有一个静态成员。



静态成员在类定义中使用`static`关键字作为前缀。

在静态成员中，`this`引用类自身。其他约定和原型成员一样。

```js
class Person{
  constructor(){
    this.locate = () => {
      console.log('instance',this);
    }    
  }

  locate(){
    console.log('prototype',this);
  }

  static locate(){
    console.log('class',this);
  }
}

let p = new Person();
p.locate();                 //instance Person { locate: [Function (anonymous)] }
Person.locate();            //class [class Person]
Person.prototype.locate();  //prototype {}
```



静态类方法非常适合作为实例工厂。

```js
class Person{
  constructor(age){
    this.age_ = age;
  }

  sayAge(){
    console.log(this.age_);
  }

  static create(){
    return new Person(Math.floor(Math.random()*100))
  }
}


console.log(Person.create());   //Person { age_: 44 }
```



#### 非函数原型和类成员

虽然类定义并不显示支持在原型或类上添加成员数据，但在定义类外部，可以手动添加；

```js
class Person{
  sayName(){
    console.log(this.name);
  }
}

Person.prototype.name = "zhangsan";

let p = new Person();
p.sayName();    //zhangsan
```



### 继承

ES6中类支持单继承。

使用`extends`关键字，就可以继承任何拥有[[Construct]]和原型的对象。

这意味着不仅可以继承一个类，还可以继承普通构造函数。

```js
class Vehicle{}

class Bus extends Vehicle{}

let b = new Bus();
console.log(b instanceof Bus);      //true
console.log(b instanceof Vehicle);  //true

function Person(){}

class Engineer extends Person{}

let e = new Engineer();
console.log(e instanceof Engineer); //true
console.log(e instanceof Person);   //true
```



类和原型上定义的方法都会带到派生类。

`this`的值会反应调用相应方法的实例或者类。

```JS
class Vehicle{
  identifyPrototype(id){
    console.log(id,this);
  }

  static identifyClass(id){
    console.log(id,this);
  }
}

class Bus extends Vehicle{};

let v = new Vehicle();
let b = new Bus();

b.identifyPrototype('bus');       //bus Bus {}
v.identifyPrototype('vehicle');   //vehicle Vehicle {}

Bus.identifyClass('bus');         //bus [class Bus extends Vehicle]
Vehicle.identifyClass('vehicle'); //vehicle [class Vehicle]
```



#### 构造函数、`HomeObject`和`super()`

派生类的方法可以通过`super`关键字引用他们的原型。

这个关键字只能在派生类中使用，而且仅限于类构造函数、实例方法和静态方法内部。

在类构造函数中使用`super`可以调用父类构造函数。

```js
class Vehicle{
  constructor(){
    this.hasEngine = true;
  }
}

class Bus extends Vehicle{
  constructor(){
    super();
    console.log(this instanceof Vehicle);   //true
    console.log(this);                      //Bus { hasEngine: true }
  }
}

new Bus();
```



在静态方法中可以通过`super`调用继承的类上定义的静态方法。

```js
class Vehicle{
  static identify(){
    console.log('vehicle');
  }
}

class Bus extends Vehicle{
  static identify(){
    super.identify();
  }
}

Bus.identify(); //vehicle
```



在使用`super`时要注意几个问题。

- `super`只能在派生类构造函数和静态方法中使用。

  ```js
  class Vehicle{
    constructor(){
      super();    //SyntaxError: 'super' keyword unexpected here
    }
  }
  ```

  

- 不能单独使用`super`关键字，要么它调用构造函数，要么用它引用静态方法。

  ```js
  class Vehicle{}
  
  class Bus extends Vehicle{
    constructor(){
      console.log(super);   //SyntaxError: 'super' keyword unexpected here
    }
  }
  ```

  

- 调用`super()`会调用父类构造函数，并将返回的实例赋给`this`。

  ```js
  class Vehicle{}
  
  class Bus extends Vehicle{
    constructor(){
      super();
  
      console.log(this instanceof Vehicle);   //true
    }
  }
  
  new Bus();
  ```

  

- `super()`的行为如同调用构造函数，如果需要父类构造函数传参，则需要手动输入。

  ```js
  class Vehicle{
    constructor(licensePlate){
      this.licensePlate = licensePlate;
    }
  }
  
  class Bus extends Vehicle{
    constructor(licensePlate){
      super(licensePlate)
    }
  }
  
  console.log(new Bus("133531"));   //Bus { licensePlate: '133531' }
  ```

  

- 如果没有定义类构造函数，在实例化派生类时会调用`super()`，而且传入所有传给派生类的参数。

  ```js
  class Vehicle{
    constructor(licensePlate){
      this.licensePlate = licensePlate;
    }
  }
  
  class Bus extends Vehicle{}
  
  console.log(new Bus('12312'));     //Bus { licensePlate: '12312' }
  ```

  

- 在类构造函数中，不能在调用`super()`·之前引用`this`

  ```js
  class Vehicle{}
  
  class Bus extends Vehicle{
    constructor(){
      console.log(this);
    }
  }
  
  new Bus();  
  //ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
  ```

  

- 如果派生类中显示定义了构造函数，则要么必须在期中调用`super()`，要么必须在其中返回一个对象。

  ```js
  class Vehicle{}
  
  class Car extends Vehicle{}
  
  class Bus extends Vehicle{
    constructor(){
      super()
    }
  }
  
  class Van extends Vehicle{
    constructor(){
      return {}
    }
  }
  
  console.log(new Car());   //Car {}
  console.log(new Bus());   //Bus {}
  console.log(new Van());   //{}
  ```

  

#### 抽象基类

有时候可能需要定义这样一个类，它可供其他类继承，但本身不会被实例化。

虽然ES中没有专门支持这种类的语法，但通过`new.target`也很容易实现。

`new.target`保存通过`new`关键字调用的类或函数。

通过在实例化时检测`new.target`是不是抽象基类，可以阻止对抽象基类的实例化。

```js
class Vehicle{
  constructor(){
    console.log(new.target);

    if(new.target === Vehicle){
      throw new Error("Vehicle cannot be directly instantiated")
    }
  }
}

class Bus extends Vehicle{}

new Bus();      //[class Bus extends Vehicle]
new Vehicle();  //Error: Vehicle cannot be directly instantiated
```



#### 继承内置类型

ES6类为继承内置引用类型提供了顺畅的机智，开发者可以方便地扩展内置类型。

```js
class SuperArray extends Array{
  shuffle(){
    for(let i = this.length - 1 ; i > 0 ; i--){
      const j = Math.floor(Math.random()*(i+1));
      [this[i],this[j]] = [this[j],this[i]]
    }
  }
}

let a = new SuperArray(1,2,3,4,5);
console.log(a instanceof Array);      //true
console.log(a instanceof SuperArray); //true

console.log(a);                       //SuperArray(5) [ 1, 2, 3, 4, 5 ]
a.shuffle();
console.log(a);                       //SuperArray(5) [ 2, 3, 4, 5, 1 ]
```



有些内置的类型有返回新实例。

默认情况下，返回实例的类型与原始实例的类型是一致的。

```js
class SuperArray extends Array{}

let a1 = new SuperArray(1,2,3,4,5);
let a2 = a1.filter(x => !!(x%2));
console.log(a1);                        //SuperArray(5) [ 1, 2, 3, 4, 5 ]
console.log(a2);                        //SuperArray(3) [ 1, 3, 5 ]
console.log(a1 instanceof SuperArray);  //true
console.log(a2 instanceof SuperArray);  //true
```

如果想覆盖这个默认行为，则可以覆盖`Sumbol.species`访问器，这个访问器决定在创建返回的实例时使用的类。

```js
class SuperArray extends Array{
  static get [Symbol.species](){
    return Array;
  }
}

let a1 = new SuperArray(1,2,3,4,5);
let a2 = a1.filter(x => !!(x%2));
console.log(a1);                        //SuperArray(5) [ 1, 2, 3, 4, 5 ]
console.log(a2);                        //[ 1, 3, 5 ]
console.log(a1 instanceof SuperArray);  //true
console.log(a2 instanceof SuperArray);  //false
```



#### 类混入

把不同类的行为集中到一个类是一种常见的JavaScript模式。

虽然ES6没有显示的支持多类继承，但通过现有特性可以轻松模拟这种行为。



在下面的代码片段中，`extends`关键字后面是一个JavaScript表达式。

任何可以解析为一个类或者一个构造函数的表达式都是有效的。

这个表达式会在求值类定义时被求值。

```js
class Vehicle{}

function getParentClass(){
  console.log('evaluated expression');
  return Vehicle;
}

class Bus extends getParentClass(){}
```



混入模式可以通过在一个表达式中连缀多个混入元素来实现，这个表达式最终会被解析成一个可以被继承的类。

如果`Person`类需要组合A、B、C，则需要某种机制实现B继承A，C继承B，而`Person`再继承C，从而把A、B、C组合到这个超类中。



一个策略是定义一组“可嵌套”的函数，每个函数分别接受一个超类作为参数，而将混入类定义为这个参数的子类，并返回这个类。

这些组合函数可以连缀调用，最终组合成超类表达式。

```js
class Vehicle{}

let FooMixin = (SuperClass) => 
  class extends SuperClass{
  foo(){
    console.log('foo');
  }
}

let BarMixin = (SuperClass) => 
  class extends SuperClass{
  bar(){
    console.log('bar');
  }
}

let BazMixin = (SuperClass) => 
  class extends SuperClass{
  baz(){
    console.log('baz');
  }
}

class Bus extends FooMixin(BarMixin(BazMixin(Vehicle))){}

let b = new Bus();
b.foo();      //foo
b.bar();      //bar
b.baz();      //baz
```

通过写一个辅助函数，可以把嵌套调用展开：

```js
class Vehicle{}

let FooMixin = (SuperClass) => 
  class extends SuperClass{
  foo(){
    console.log('foo');
  }
}

let BarMixin = (SuperClass) => 
  class extends SuperClass{
  bar(){
    console.log('bar');
  }
}

let BazMixin = (SuperClass) => 
  class extends SuperClass{
  baz(){
    console.log('baz');
  }
}

function mix(BaseClass,...Mixins){
  return Mixins.reduce((accumulator,current) => current(accumulator),BaseClass )
}

class Bus extends mix(Vehicle,FooMixin,BarMixin,BazMixin){}

let b = new Bus();
b.foo();      //foo
b.bar();      //bar
b.baz();      //baz
```

