---
title: JavaScript中的面对对象（一）
date: '2021-10-08 22:54:53'
categories:
 - FrontEnd
tags:
 - JS
 - 对象
 - 原型/原型链
---



## 对象

> ECMA-262将对象定义为一组属性的无序集合。严格来说，这意味着对象就是一组没有特定顺序的值。

简单来说，我们可以将对象认为是一组键值对的集合，类似于`HashMap`，并且值不仅可以是数据，也可以使一个函数。



## 理解对象

### 对象的属性

**注意：ECMA-262使用一些内部特性来描述属性特征，开发者不能在JavaScript中直接访问这些特性。**

**这些特性用两个中括号包裹，比如[[Enumerable]]**

对象的属性分为两种：数据属性和访问器属性。

- **数据属性**

  - [[Configurable]]：可配置的，表示属性是否可以通过delete删除并重新定义，是否可以修改它的特性，以及是否可以把它修改为访问器属性。

    默认情况下，所有直接定义在对象上的属性的这个特性都是true。

    

  - [[Enumerable]]：可枚举的，表示属性是否可以通过for-in循环返回。

    默认情况下，所有直接定义在对象上的属性的这个特性都是true。

    

  - [[Writable]]：可写的，表示属性的值是否可以被修改。

    默认情况下，所有直接定义在对象上的属性的这个特性都是true。

    

  - [[Value]]：值，表示属性实际暴露出来的值。

    这个特性的默认值为undefined。

    

除了[[value]]这个特性，我们无法通过`.`的方式直接访问其他三个特性。

要修改属性的默认特性，我们需要用到`Object.defineProperty()`这个方法。

这个方法接受三个参数，要操作的对象，对象的属性名和一个描述符对象。

通过最后一个参数，我们能够修改属性的特性。比如：

```js
    let person = {
      name:"ZhangSan"
    }
    console.log(person.name + " First"); //ZhangSan First

    delete person.name;

    console.log(person.name + " Second"); //undefined Second

    Object.defineProperty(person,"name",{
      configurable:false,
      value:"Lisi",
    })

    delete person.name;

    console.log(person.name + " Last"); //Lisi Last
```

在这段代码中，我们定义了一个person对象，并将它的name属性赋值为“ZhangSan”，然后我们第一次打印`person.name`，可以拿到张三的名字，

然后我们用`delete`删除person对象的name属性，再次尝试log输出，发现该值已经被删除，显示undefined，

然后我们通过`Object.defineProperty()`函数，将对象的name属性修改为不可配置的，并且赋值为Lisi，

再次尝试删除后打印，发现我们并不能通过`delete`方法删除该属性。



此时，我们如果想再次将该对象属性修改为可配置的，那么就会发生错误。

在上述代码中在加入一段，如下：

```js
    Object.defineProperty(person,"name",{
      configurable:true,
      value:"ZhangSan",
    })
```

然后查看控制台

![image-20210930101129975](https://gitee.com/ashene/pic-go/raw/master/image-20210930101129975.png)



- **访问器属性**

  访问器属性不包含数据值，相反，他们包含一个`setter`函数和一个`getter`函数

  - [[Configurable]]：可配置的，表示属性是否可以通过delete删除并重新定义，是否可以修改它的特性，以及是否可以把它修改为访问器属性。

    默认情况下，所有直接定义在对象上的属性的这个特性都是true。

    

  - [[Enumerable]]：可枚举的，表示属性是否可以通过for-in循环返回。

    默认情况下，所有直接定义在对象上的属性的这个特性都是true。

    

  - [[Get]]：获取函数，读取属性时调用。默认值为undefined。

    

  - [[Set]]：设置函数，写入属性时调用，默认值为undefined。



访问器属性同样是不能直接定义的，必须通过`Object.defineProperty()`这个方法。

```js
    let student ={
        year_:2018,
        age:22
    }

    Object.defineProperty(student,"year",{
      get(){
        return this.year_;
      },
      set(newValue){
        if(newValue > 2017){
          this.year_ = newValue;
          this.age = this.age + 2018 - newValue;
        }
      }
    })

    student.year = 2020;
    console.log(student.age);
```

在这个🌰中，我们定义了一个学生对象，它有两个默认属性：year_和age。

**注意：year_中的下划线用来表示该属性并不希望在对象方法外部被访问，即私有变量，类似于Java中的`private`。**

然后在` Object.defineProperty()`方法中，为这个对象定义了一个新属性year，该属性为访问器属性，

获取函数的`get`返回year_的值，

而`set`函数则会做一些计算，算出该学生当前的年龄。

**这种用法类似于Java中给变量增加get和set方法，当然，也和Java中一样，这两个函数并不一定都需要定义，如果只设置了get，那么它就是只读属性，如果只设置了set，那么他就是只写属性，当然，这没有什么意义。**



### 读取属性的特性

通过`` Object.defineProperty()``方法可以修改属性的特性，但在某些场景下，我们可能只需要知道属性的特性是什么，而不需要修改它，

这时我们可以使用`Object.getOwnPropertyDescriptor()`方法取得指定属性的描述符。

```js
    let desc =  Object.getOwnPropertyDescriptor(student,"year_");
    console.log(desc);
```

![image-20210930105112194](https://gitee.com/ashene/pic-go/raw/master/image-20210930105112194.png)

当然，有时我们也需要同时拿到一个对象的所有属性。

ECMA为此新增了`Object.getOwnPropertyDescriptors()`方法，结果如下：

![image-20210930105316298](https://gitee.com/ashene/pic-go/raw/master/image-20210930105316298.png)



### 合并对象

考虑到JavaScript开发者认为合并(merge)两个对象是很有必要的，有时这种操作也叫混入("mixin")。

ECMA6提供了`Object.assign()`方法。

该方法接受一个目标对象和一个或多个源对象作为参数。

将每个对象中**可枚举的**，即[[Enumable]]特性值为true

和**自有属性**(直接定义在对象上的属性，与原型对象上的属性做区分，可用`Object.hasOwnproperty()`进行判断，返回true即为自有属性)

复制到目标对象。

这个方法会使用源对象上的[[Get]]取得属性值，然后使用目标对象上的[[Set]]设置属性值。

```js
    let target,source1,source2,result;
    target = {},
    source1 = {
      id:1,
      name:"src1"
    },
    source2 = {
      sid:2,
      sname:"src2"
    }

    result = Object.assign(target,source1,source2)

    console.log(result);	//{id: 1, name: 'src1', sid: 2, sname: 'src2'}
    console.log(target === result)	//true
```

通过这个🌰，我们可以看到result包含了source1和source2对象上的属性和值，

并且该方法会把返回值传给目标参数，因此我们可以得到`target === result`的结果为true。



**注意：如果有同名的属性，会被后面的值覆盖。**

​			**如果源对象中有方法，只会调用该对象上 的[[Get]]方法，并获得返回值，不会将方法合并至目标对象**。

​			**如果目标对象上对应的[[Set]]方法没有执行赋值操作，该值并不会传递过来。**

​			**如果赋值期间出错，则操作会终止并退出，`Object.assign()`没有“回滚”操作。**



### 对象标识

JavaScript中，使用===有时会产生十分糟糕的情况。比如：

```js
    console.log(+0 == -0);	//true
    console.log(NaN === NaN);	//false
```



为此，ECMA6新增了`Object.is()`方法。

```js
    console.log(Object.is(+0,-0));	//false
    console.log(Object.is(NaN,NaN));	//true
```



### 对象解构

对象解构就是使用与对象相匹配的结构来实现对象属性赋值。

```js
    let response = {
      code:"200",
      message:"Succeed",
      data:{
        id:1,
        title:"解构操作"
      }
    }
    
//不使用对象解构
    resultCode = response.code;
    resultData = response.data;
    resultMessage = response.message;

    console.log(resultCode);	//200
    console.log(resultMessage);	//Succeed
    console.log(resultData);	//{id: 1,title: "解构操作"}

//使用对象解构
	let {code: code, message: msg, data} = response;
    console.log(code);	//200
    console.log(msg);	//Succeed
    console.log(data);	//{id: 1,title: "解构操作"}
```

使用对象解构，可以同时执行多个赋值操作。



解构赋值不一定需要与对象的属性完全匹配。赋值的时候可以忽略某些值，而如果引用的属性不存在，则会赋默认值undefined，

当然，我们也可以在解构赋值的同时定义默认值。

```js
    let {code, message: msg, data, append='额外附加'} = response;

    console.log(append);	//额外附加
```



**注意：如果给事先声明好的变量赋值，则赋值表达式必须包含在一对括号内。**	

```js
let resultCode , resultMessage , resultData;

({code: resultCode , message : resultMessage , data : resultData} = response )
```



**注意：与对象合并一样，如果解构过程中出现错误，则整个解构赋值只会完成一部分。**



## 创建对象

通常情况下，我们用`new Object()`的函数来创建对象，但是这种方式有很明显的缺陷。

我们来看这样一段代码：

```js
    let person1 = new Object();
    person1.name = "zhangsan";
    person1.age = 20;
    person1.job = "doctor";
    person1.sayName = function(){
      console.log(this.sayName);
    }
```

在这段代码中，我们用`new Object()`的函数创建了一个`person1`对象，并且给`person1`对象添加了属性和方法。这似乎没什么问题，

但现在如果我们需要一个`person2`对象，那么我们就需要把上述代码再复制一遍，很明显，这样的代码并不是我们提倡的。



### 工厂模式

在工厂模式中，我们可以使用统一的函数创造同一类对象。

```js
//工厂模式
function createPerson(name,age,job){
  let o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;

  o.sayName = function(){
    console.log(this.name);
  }

  return o;
}

let person1 = createPerson("zhangsan",20,"doctor");
let person2 = createPerson("lisi",21,"teacher");
```

在这段代码中，我们使用了`createPerson()`函数，

这个函数帮助我们创建了一个新的Object，并且根据我们传入的参数添加属性并赋值，我们还可以在函数内部为对象添加方法，

这样做的好处是我们在需要创建多个对象时可以用一种更为简便的方式实现，

使用这种模式创建出来的对象就像是工厂里统一生产出来的产品，因此称之为工厂模式。



这种模式可以解决创建多个类似对象的问题，但是仍没有解决对象标识的问题（即新建的对象是什么类型）。

```
console.log(person1.constructor);	//[Function: Object]
console.log(dog1.constructor);		//[Function: Object]
```



### 构造函数模式

```js
//构造函数模式
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;

  this.sayName = function(){
    console.log(this.name);
  }
}

let person1 = new Person("zhangsan",40,"doctor");
```

实际上，使用构造函数和使用工厂模式创建对象几乎是一样的，除了以下几点：

- 构造模式没有是用`new Object()`来显式的 创建对象。
- 属性和方法直接赋值给了this
- 没有返回值



我们不妨来看一下使用构造函数的具体流程：

1. 在内存中创建一个新的对象
2. 这个新对象的[[Prototype]]特性被复制为构造函数的prototype属性
3. 构造函数内部的this指向这个新对象
4. 执行构造函数内部的代码（添加方法和属性）
5. 如果构造函数内部有返回值，则返回该值，否则，返回刚创建的新对象



这次，让我们看看构造函数模式能否帮助我们判断对象的类型。

```js
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;

  this.sayName = function(){
    console.log(this.name);
  }
}

function Dog(){

}

let person1 = new Person("zhangsan",40,"doctor");
let dog1 = new Dog();

console.log(person1.constructor); //[Function: Person]
console.log(dog1.constructor);    //[Function: Dog]
```

这一次，通过对象的`constructor`，我们得到了对象准确的类型。

因此我们可以的出结论，构造函数模式能够同时解决**创建多个类似对象**和**对象标识**的问题。



那么？构造函数模式就是我们创建对象的终极方法了吗？

很明显，答案是否定的。那么构造函数模式有什么问题，我们又应该选择什么样的方式创建对象呢？

先来回答第一个问题，构造函数模式有什么问题



我们先来看一段代码：

```js
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;

  this.sayName = function(){
    console.log(this.name);
  }

}

let person1 = new Person("zhangsan",40,"doctor");
let person2 = new Person("lisi",21,"student");

console.log(person1.sayName == person2.sayName);	//false
```

这段代码本身是没有问题的，问题在于其逻辑，

当我们用`new Person()`创建对象时，实际上是在内存中开辟了一块区域，

由于每个实例对象的属性值大多是不同的，比如说人名，年龄，职业等等，所以每个实例对象的属性单独开辟一块空间是没有问题的，

但是方法呢？如果每个对象的方法都是一样的，那就没有必要在每个实例对象内部都单独开辟一块区域去存储它，这样会造成大量内存的浪费。

解决的办法也很简单，把函数定义在构造函数外部就可以了

```js
function Person(name,age,job){
  this.name = name;
  this.age = age;
  this.job = job;

  this.sayName = sayName;

}

function sayName(){
  console.log(this.name);
}

let person1 = new Person("zhangsan",40,"doctor");
let person2 = new Person("lisi",21,"student");

console.log(person1.sayName == person2.sayName);	//true
```

问题似乎是解决了？

但是这样的代码又带来了一个新的问题，

我们在对象上定义的方法，我们是希望的它只服务于对象本身的，

而将函数定义转移到构造函数外的方法，封装了个寂寞。

这个新问题，我们可以通过原型模式解决。



### 原型模式

在理解原型模式之前，我们需要先搞清楚一个概念，什么是原型？

> 每个函数都会创建一个prototype属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性和方法。
>
> 实际上，这个对象就是通过调用构造函数创建的对象的原型。
>
> 使用原型对象的好处是，在它上面定义的属性和方法可以被对象实例共享。
>
> 原来在构造函数中直接赋给对象的值，可以直接赋值给它们的原型。

简单来说，原型就像是父亲，定义在它身上的属性和方法都可以被儿子（实例对象）继承。



来看一个简单的🌰：

```js
function Person(){};

Person.prototype.name = "zhangsan";
Person.prototype.age = "40";
Person.prototype.job = "doctor";
Person.prototype.sayName = function(){
  console.log(this.name);
}

let person1 = new Person();
let person2 = new Person();

person1.sayName();  //zhangsan
person2.sayName();  //zhangsan

console.log(person1.sayName === person2.sayName); //true
```

在这段代码中，我们创建了一个空的构造函数，

并在这个构造函数的原型上添加了属性和方法，

然后我们通过这个构造函数创建出新的实例对象，

最后我们发现，这些实例对象可以共享同一个方法，不仅如此，在构造函数为空的情况下，实例对象还能访问到构造函数原型上的对象。



在上述过程中，原型做了什么？原型的本质又是什么？



#### 理解原型

无论何时，只要创建一个函数，就会按照特定的规则为这个函数创建一个`prototype`属性，这个属性的值是一个指针，指向原型对象。

默认情况下，所有的原型对象会自动获得一个名为constructor的属性，这个属性的值也是一个指针，指向与之关联的构造函数。

对于前面的🌰而言，`Person.prototype.constructor`指回Person。



在自定义构造函数时，原型对象只会默认获得`constructor`属性，其他所有的方法都继承与Object。

每次调用构造函数创建一个新的实例，这个实例内部的[[Prototype]]指针就会被赋值为构造函数的原型对象。

在Firefox，Safari和Chrome中，我们可以通过`_proto_`属性来访问对象的原型。

在其他实现中，这个特性被完全隐藏了。



关键在于这一点：

实例与构造函数原型之间有直接的联系，但实例与构造函数之间没有。



![image-20211009130218150](https://gitee.com/ashene/pic-go/raw/master/image-20211009130218150.png)

通过这张图，我们可以很直观的看出构造函数和原型可以通过`prototype`和`constructor`能够指向对方。

而由构造函数创建出来的实例能够通过[[Prototype]]属性访问原型的`constructor`

当然，前文我们提到过不时所有实现都对外暴露了[[Prototype]]这个属性，但可以使用i`sPrototypeOf()`方法确定两个对象之间的关系。

```js
console.log(Person.prototype.isPrototypeOf(person1));	//true
console.log(Person.prototype.isPrototypeOf(person2));	//true
```

`person1`和`person2`都有[[prototype]]指向`Person.prototype`,所以结果都返回true。

实际上我们还可以通过`Object.getProototypeOf()`方法获得实例的原型。

```js
console.log(Object.getPrototypeOf(person1));

//输出结果
{
  name: 'zhangsan',
  age: '40',
  job: 'doctor',
  sayName: [Function (anonymous)]
}
```



#### 原型层级

当我们通过对象访问属性时，会按照这个属性的名称从对象实例本身开始搜索，如果在这个实例上发现了相应的名称，则返回其对应的值。

如果没有找到同名属性，才会通过指针去访问原型上的对应属性。

```js
function Person(){};

Person.prototype.name = "zhangsan";
Person.prototype.age = "40";
Person.prototype.job = "doctor";
Person.prototype.sayName = function(){
  console.log(this.name);
}

let person1 = new Person();
let person2 = new Person();

person1.name = "lisi";

console.log(person1.name);	//lisi
console.log(person2.name);	//zhangsan
```

这段代码中我们给`person1`的`name`属性赋值为`“lisi”`,

本质上是在实例对象上创建了该属性然后再进行赋值，而不是覆盖掉原型上的属性值,

这也是为什么`person2`仍然能够访问到原型上的属性。



> 只要给对象实例添加了一个属性，这个属性就被遮蔽（Shadow）原型对象上的同名属性，
>
> 也就是虽然不会修改它，但会屏蔽对它的访问。
>
> 即使在实例上把这个属性设置为`null`，也不会恢复它和原型的联系。
>
> 不过，使用`delete`操作符可以完全删除实例上的这个属性，从而让标志解析过程能够继续搜索原型对象。

```js
function Person(){};

Person.prototype.name = "zhangsan";
Person.prototype.age = "40";
Person.prototype.job = "doctor";
Person.prototype.sayName = function(){
  console.log(this.name);
}

let person1 = new Person();
let person2 = new Person();

person1.name = "lisi";

delete(person1.name)

console.log(person1.name);	//"zhangsan"
console.log(person2.name);	//"zhangsan"
```



有时候我们需要判断某个属性是位于实例对象上还是在原型对象上，

这个时候我们需要使用`hasOwnProperty()`方法，

该方法继承自Object，会在属性存在于调用它的实例对象上时返回`true`

```js
function Person(){};

Person.prototype.name = "zhangsan";
Person.prototype.age = "40";
Person.prototype.job = "doctor";
Person.prototype.sayName = function(){
  console.log(this.name);
}

let person1 = new Person();
let person2 = new Person();

person1.name = "lisi";

console.log(person1.hasOwnProperty("name"));  //true
console.log(person2.hasOwnProperty("name"));  //false
```



#### 原型和in

在单独使用时，`in`操作符会在可以通过对象访问指定属性时返回true，无论属性在实例对象上还是原型对象上。

```js
console.log("name" in person1); //true
console.log("sayName" in person1);  //true
console.log("work" in person1); //false
```

`in`操作符可以和`hasOwnProperty()`方法一起使用，

当`in`的返回为true且`hasOwnProperty()`返回的结果为false时，说明属性在原型对象上。



`in`也可以在`for`循环中使用，可以通过对象访问且可以被枚举的属性都会返回，同样包括实例属性和原型属性。

除此之外，还有`Object.keys()`方法和`Object.getOwnPropertyNames()`方法

前者会返回实例对象上所有可枚举属性的名称的字符串数组

后者则返回所有实例属性，无论是否可以枚举。



> 注意：`Object.getOwnPropertyNames()`、`Object.getOwnPropertySymbol()`、和`Object.assign()`的枚举顺序是确定性的。
>
> 先以升序枚举数值键，然后以插入顺序枚举字符串和符号键。



### 原型相关

1. 原型的其他语法

   观察前文的🌰，我们可以发现每次我们为原型添加属性时都把`Person.prototype`重写了一遍，

   为什么我们不选择更简易的字面量方式呢？

   ```js
   function Person(){};
   
   Person.prototype = {
     name : "zhangsan",
     age : "40",
     job : "doctor",
     sayName(){
       console.log(this.name);
     }
   }
   
   let person1 = new Person();
   let person2 = new Person();
   
   person1.name = "lisi";
   
   console.log(person1.name);  //lisi
   console.log(person2.name);  //zhangsan
   
   console.log(Person.prototype.constructor === Person); //false
   ```

   我们的实例对象仍然可以正常访问到原型对象上的属性

   但是我们也发现，原型对象上的构造函数不再指向`Person`了

   因为我们直接给`Person.prototype`赋值的方式，覆盖了原本的`constructor`，

   当然，我们可以在原型对象上显式的声明它的构造函数

   ```js
   function Person(){};
   
   Person.prototype = {
     constructor:Person,
     name : "zhangsan",
     age : "40",
     job : "doctor",
     sayName(){
       console.log(this.name);
     }
   }
   ```

   以这种方式恢复`constructor`属性会创建一个[[Enumerable]]为`true`的属性。

   而原生的`constructor`属性默认是不可枚举的。

   如果想保持一致，那么我们需要使用`Object.defineProperty()`方法来定义`constructor`属性。

   ```js
   Object.defineProperty(Person.prototype,"constructor",{
     enumerable: true,
     value: Person
   })
   ```

   

2. 原型的动态性

   因为从原型上搜索值的过程是动态的，所以即使实例在修改之前已经存在，任何时候对原型对象所做的修改也会在实例上反应出来。

   ```js
   function Person(){}
   
   let person1 = new Person()
   
   Person.prototype.name = "zhangsan";
   
   console.log(person1.name);	//“zhangsan”
   ```

   

3. 原生对象原型

   原型模式之所以重要，不仅体现在自定义类型上。

   它也是所有原生引用类型的模式。所有原生引用类型的构造函数（包括Object，Array，String等）都在原型上定义了实例方法。

   

   根据原型模式的特点，我们可以手动给这些原生引用类型添加方法

   ```js
   Array.prototype.getSum = function(){
     let sum = 0;
     this.forEach(element => {
       sum += element;
     });
     return sum;
   }
   
   let arr = [1,2,3,4,5];
   console.log(arr.getSum());  //15
   ```

   我们成功在Array对象上自定义了一个方法，可以实现计算数组的和

   但一般情况下，我们并不推荐修改原生对象类型

   推荐的做法是，创建一个自定义类，并继承于原生类型。

   

4. 原型的问题

   原型模式也存在自己的问题，来看下面的🌰：

   ```js
   function Person(){}
   
   Person.prototype = {
     constructor: Person,
     name:"zhangsan",
     age:"40",
     job:"doctor",
   
     friends:["lisi","wangwu"],
   
     sayName(){
       console.log(this.name);
     }
   }
   
   let person1 = new Person();
   let person2 = new Person();
   
   person1.friends.push("xiaoming");
   console.log(person1.friends); //[ 'lisi', 'wangwu', 'xiaoming' ]
   console.log(person2.friends); //[ 'lisi', 'wangwu', 'xiaoming' ]
   ```

   可以看到，我们在`person1`上添加的朋友`"xiaoming"`也被添加到了`person2`的`friends`属性上

   原型模式最大的优势`共享`，此时成了我们的桎梏。

   

   一般来说，不同的实例应该有属于自己的属性副本，这也是为什么实际开发中通常不单独使用原型模式的原因。
