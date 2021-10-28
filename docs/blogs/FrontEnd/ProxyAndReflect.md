---
title: 代理与反射
date: '2021-10-22 23:32:57'
categories:
 - FrontEnd
tags:
 - JS
 - 代理与反射
---



## 代理基础

### 什么是代理

Proxy可以理解为目标对象的拦截层，

外界对该对象的任何访问，都必须先经过这层拦截。

通过这层拦截，开发者可以向基本操作嵌入额外的行为。



### 创建代理

具体的代理如何，让我们从创建一个代理开始。

```js
const target = {
  name:"oldTarget"
}

const proxy = new Proxy(target,{})

console.log(target);  //{ name: 'oldTarget' }
console.log(proxy);   //{ name: 'oldTarget' }
```

这段代码非常简单，我们首先定义了一个`target`作为被代理的对象，然后通过`new Proxy()`的方法创建了一个代理对象，

该对象拥有和目标对象一致的属性。

```
target.type = "object";

console.log(target.type); //object
console.log(proxy.type);  //object

console.log(target === proxy);  //false
```

当我们为`target`添加了一个`type`属性后，`proxy`同样可以访问到该属性。

值得一提的是，在严格相等模式下，`target`和`proxy`并不相等。



### 捕获器

使用代理的主要目的就是为了可以定义捕获器。捕获器就是在处理程序对象中定义的“基本操作的拦截器”。

也正是这些捕获器，界定了目标对象和代理对象的不同之处。

在上文的代码中，目标对象和代理对象几乎没有任何区别，关键就在于我们 没有将带有捕获器的对象传给`Proxy`的构造方法。

现在，我们尝试传入一个`handle`。

```
const target = {
  name:"oldTarget"
}

const handle = {
  get(){
    return "对象被访问";
  }
}

const proxy = new Proxy(target,handle)

console.log(target.name);  //oldTarget
console.log(proxy.name);   //对象被访问
```

在这段代码中，我们定义了一个`handle`对象，该对象内部有一个`get()`方法。

并且，我们把这个对象传给了`Proxy`构造函数。

可以看到，传入这个构造函数后，`target`对象和`proxy`对象发生了区别。

在目标对象未被改变的情况下，通过代理对象去访问其中的任何一个属性，都会触发`handle`中对应的`get()`方法

这样，我们可以说代理对象劫持了目标对象。



### 捕获器参数和反射

所有的捕获器都有相对应的参数，通过这些参数，我们可以还原目标对象未被拦截时的行为。

比如`get()`捕获器能接收到目标对象、要查询的属性和代理对象三个参数。

```js
const target = {
  name:"zhangsan"
}

const proxy = new Proxy(target,{
  get(target,properrt,receiver){
    console.log(...arguments);  //{ name: 'zhangsan' } id { name: 'zhangsan' }
    return "get被拦截"
  }
})

console.log(proxy.id);  //get被拦截
```

对于`get()`捕获器，我们可以很容易的还原目标对象原始的行为。

```js
const target = {
  name:"zhangsan"
}

const proxy = new Proxy(target,{
  get(target,properrt,receiver){
    return target[properrt];
  }
})

console.log(proxy.name);  //zhangsan
```

但并不是所有捕获器都像`get()`一样，想要通过手动写码如法炮制所有捕获器行为的想法是不现实的。

实际上，我们并不需要手动重建原始行为，而是可以通过调用全局`Reflect`对象（封装了原始行为）的同名方法来实现重建。

```js
const target = {
  name:"zhangsan"
}

const proxy = new Proxy(target,{
  get(target,properrt,receiver){
    return Reflect.get(...arguments);
  }
})

console.log(target.name); //zhangsan
console.log(proxy.name);  //zhangsan
```

甚至还可以更简洁一点：

```js
const target = {
  name:"zhangsan"
}

const proxy = new Proxy(target,{
  get:Reflect.get
})

console.log(target.name); //zhangsan
console.log(proxy.name);  //zhangsan
```

事实上，如果我们需要创建一个可以捕获所有方法，然后将每个方法转发给相应反射API的空代理，那么只需要这样：

```js
const target = {
  name:"zhangsan"
}

const proxy = new Proxy(target,Reflect)

console.log(target.name); //zhangsan
console.log(proxy.name);  //zhangsan
```



### 撤销代理

有些时候，或许我们需要切断代理对象和目标对象之间的联系。

`Proxy`暴露了`revocable()`方法，这个方法支持撤销代理对象与目标对象的关联。

撤销代理的操作是不可逆的。撤销代理之后再调用代理会抛出错误。

```js
const target = {
  name:"zhangsan"
}

const handler = {
  get(){
    return "get被拦截"
  }
}

const {proxy,revoke} = Proxy.revocable(target,handler)
const proxy = new Proxy(target,handler)

console.log(target.name); //zhangsan
console.log(proxy.name);  //get被拦截

revoke();

console.log(proxy.name);  //SyntaxError: Identifier 'proxy' has already been declared
```



### 反射API

某些情况下应该优先使用反射API，这是有一些已有的。

- 反射API与对象API

  在使用反射API时，要记住：
  - 反射API并不限于捕获处理程序

  - 大多数反射API方法在`Object`类上有相应的方法。

    通常，`Object`上的方法适用于通用程序，而反射方法适用于细粒度的对象控制与操作。

- 状态标记

  很多反射方法返回称作“状态标记”的布尔值，表示意图执行的操作是否成功。

  有时候，状态标记比那些返回修改后的对象或抛出错误的反射API方法更有效。

  ```js
  const person = {}
  
  try{
    Object.defineProperty(person,'name',"zhangsan");
    
    console.log("success");
  }catch(e){
    console.log("fialure");
  }
  
  //重构后的代码
  
  if(Reflect.defineProperty(person,"name",{value:"zhangsan"})){
    console.log("success");
  }else{
    console.log("fialure");
  }
  
  ```

  以下反射方法都会提供状态标记：

  - `Reflect.defineProperty()`
  - `Reflect.preventExtensions()`
  - `Reflect.setPrototypeOf()`
  - `Reflect.set()`
  - `Reflect.deleteProperty()`

- 用一等函数代替操作符

  以下反射方法提提供只有操作符才能完成的操作。

  - `Reflect.get()`：可以替代对象属性访问操作符。
  - `Reflect.set()`：可以替代=赋值操作符。
  - `Reflect.has()`：可以替代in操作符或with()。
  - `Reflect.deleteProperty()`：可以替代delete操作符。
  - `Reflect.construct()`：可以替代new操作符。

- 安全地应用函数

  在通过`apply`方法调用函数时，被调用的函数可能也定义了自己的`apply`属性，

  为了绕过这个问题，可以使用定义在`Function`原型上的`apply`方法

  ```js
  Function.prototype.apply.call(myFunc,thisVal,arguementList);
  ```

  这种代码可以通过`Reflect.apply`来避免.

  ```js
  Reflect.apply(myFunc,thisVal,arguementList)
  ```

​		

## 代理捕获器与反射方法

在JavaScript中，代理可以捕获13种不同的基本操作。

这些操作有各自不同的反射API方法，参数，关联ES操作和不定式。



### get()

`get()`捕获器会在获取属性值的操作中被调用。

对应的反射API方法为`Reflect.get()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  get(target,property,receiver){
    console.log("get()");
    return Reflect.get(...arguments);
  }
})

proxy.name
//get()
```

1. **返回值**

   返回值无限制。

2. **拦截的操作**

   - `proxy.property`
   - `proxy[property]`
   - `Object.create(proxy)[property]`
   - `Reflect.get(proxy,property,receiver)`

3. **捕获器处理程序参数**

   - target：目标对象。
   - property：引用的目标对象上的字符串键属性。
   - receiver：代理对象或继承代理对象的对象。

4. **捕获器不定式**

   如果`target.property`不可写且不可配置，则处理程序返回的值必须与`target.property`匹配。

   如果`target.property`不可配置且[[Get]]特性为`undefined`，处理程序的返回值也必须是`undefined`。

   

### set()

`set()`捕获器会在设置属性值的操作中被调用。

对应的反射API方法为`Reflect.set()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  set(target,property,value,receiver){
    console.log("set()");
    return Reflect.set(...arguments);
  }
})

proxy.name = "zhangsan"
//set()
```

1. **返回值**

   返回值`true`表示成功；返回`false`表示失败，严格模式下会抛出`TypeError`。

2. **拦截的操作**

   - `proxy.property = value`
   - `proxy[property] = value`
   - `Object.create(proxy)[property] = value`
   - `Reflect.set(proxy,property,value,receiver)`

3. **捕获器处理程序参数**

   - target：目标对象。
   - property：引用的目标对象上的字符串键属性。
   - value：要赋给属性的值。
   - receiver：代理对象或继承代理对象的对象。

4. **捕获器不定式**

   如果`target.property`不可写且不可配置，则不能修改目标属性的值。

   如果`target.property`不可配置且[[Set]]特性为`undefined`，则不能修改目标属性的值。



### has()

`has()`捕获器会在设置属性值的操作中被调用。

对应的反射API方法为`Reflect.has()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  has(target,property){
    console.log("has()");
    return Reflect.has(...arguments);
  }
})

'name' in proxy
//has()
```

1. **返回值**

   `has()`必须返回布尔值，表示属性是否存在。返回非布尔值会被转型为布尔值。

2. **拦截的操作**

   - `property in proxy `
   - `property in Object.create(proxy)`
   - `with(proxy){(property);}`
   - `Reflect.has(proxy,property)`

3. **捕获器处理程序参数**

   - target：目标对象。
   - property：引用的目标对象上的字符串键属性。

4. **捕获器不定式**

   如果`target.property`存在且不可配置，则处理程序必须返回`true`。

   如果`target.property`存在且目标对象不可扩展，则处理程序必须返回`true`。

   

### defineProperty()

`defineProperty()`捕获器会在`Object.defineProperty()`中被调用。

对应的反射API方法为`Reflect.defineProperty()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  defineProperty(target,property,descriptor){
    console.log("defineProperty()");
    return Reflect.defineProperty(...arguments);
  }
})

Object.defineProperty(proxy,'name',{value:'zhangsan'})
//defineProperty()
```

1. **返回值**

   `defineProperty()`必须返回布尔值，表示属性是否被定义。返回非布尔值会被转型为布尔值。

2. **拦截的操作**

   - `Object.defineProperty(proxy,property,descriptor)`
   - `Reflect.defineProperty(proxy,property,descriptor)`

3. **捕获器处理程序参数**

   - target：目标对象。
   - property：引用的目标对象上的字符串键属性。
   - descriptor：包含可选的`enumerable`、`configurable`、`writable`、`value`、`get`和`set`定义的对象。

4. **捕获器不定式**

   如果目标对象不可扩展，则无法定义属性。

   如果目标对象有一个可配置的属性，则不同添加同名的不可配置属性。

   如果目标对象有一个不可配置的属性，则不同添加同名的可配置属性。

   

### getOwnPropertyDescriptor()

`getOwnPropertyDescriptor()`捕获器会在`Object.getOwnPropertyDescriptor()`中被调用。

对应的反射API方法为`Reflect.getOwnPropertyDescriptor()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  getOwnPropertyDescriptor(target,property){
    console.log("getOwnPropertyDescriptor()");
    return Reflect.getOwnPropertyDescriptor(...arguments);
  }
})

Object.getOwnPropertyDescriptor(proxy,'name')
//getOwnPropertyDescriptor()
```

1. **返回值**

   `getOwnPropertyDescriptor()`必须返回对象，或者在属性不存在时返回`undefined`。

2. **拦截的操作**

   - `Object.getOwnPropertyDescriptor(proxy,property)`
   - `Reflect.getOwnPropertyDescriptor(proxy,property)`

3. **捕获器处理程序参数**

   - target：目标对象。
   - property：引用的目标对象上的字符串键属性。

4. **捕获器不定式**

   如果自由的`target.property`存在且不可配置，则处理程序对象必须返回一个表示该属性存在的对象。

   如果自由的`target.property`存在且可配置，则处理程序对象必须返回一个表示该属性可配置的对象。

   如果自由的`target.property`存在且`target`不可扩展，则处理程序对象必须返回一个表示该属性存在的对象。

   如果自由的`target.property`不存在且`target`不可扩展，则处理程序对象必须返回`undefined`表示该属性不存在。

   如果自由的`target.property`不存在，则处理程序对象不能返回表示该属性可配置的对象。



### deleteProperty()

`deleteProperty()`捕获器会在`delere`操作符中被调用。

对应的反射API方法为`Reflect.deleteProperty()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  deleteProperty(target,property){
    console.log("deleteProperty()");
    return Reflect.deleteProperty(...arguments);
  }
})

delete proxy.name
//deleteProperty()
```

1. **返回值**

   `deleteProperty()`必须返回布尔值，表示删除该属性是否成功。返回非布尔值会被转型为布尔值。

2. **拦截的操作**

   - `delete proxy.property  `
   - `delete proxy[property]`
   - `Reflect.deleteProperty(proxy,property)`

3. **捕获器处理程序参数**

   - target：目标对象。
   - property：引用的目标对象上的字符串键属性。

4. **捕获器不定式**

   如果`target.property`存在且不可配置，则处理程序不能删除这个属性。



### ownKeys()

`ownKeys()`捕获器会在`Object.keys()`及类似方法中被调用。

对应的反射API方法为`Reflect.ownKeys()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  ownKeys(target){
    console.log("ownKeys()");
    return Reflect.ownKeys(...arguments);
  }
})

Object.keys(proxy);
//ownKeys()
```

1. **返回值**

   `ownKeys()`必须返回包含字符串或符号的可枚举对象。

2. **拦截的操作**

   - `Object.getOwnPropertyNames(proxy)`
   - `Object.getOwnPropertySymbols(proxy)`
   - `Object.keys(proxy);`
   - `Reflect.keys(proxy)`

3. **捕获器处理程序参数**

   - target：目标对象。

4. **捕获器不定式**

   返回的可枚举对象必须包含`target`的所有不可配置的自有属性。

   如果`target`不可扩展，则返回可枚举对象必须准确地包含自由属性键。



### getPrototypeOf()

`getPrototypeOf()`捕获器会在`Object.getPrototypeOf()`中被调用s。

对应的反射API方法为`Reflect.getPrototypeOf()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  getPrototypeOf(target){
    console.log("getPrototypeOf()");
    return Reflect.getPrototypeOf(...arguments);
  }
})

Object.getPrototypeOf(proxy);
//getPrototypeOf()
```

1. **返回值**

   `getPrototypeOf()`必须返回对象或`null`。

2. **拦截的操作**

   - `Object.getPrototypeOf(proxy) `
   - `Reflect.getPrototypeOf(proxy)`
   - `proxy.__proto__`
   - `Object.protype.isPrototypeOf(proxy)`
   - `proxy instanceof Object`

3. **捕获器处理程序参数**

   - target：目标对象。

4. **捕获器不定式**

   如果`target`不可扩展，则`Object.getPrototypeOf(proxy) `唯一的有效返回值就是`Object.getPrototypeOf(target)`的返回值。



### setPrototypeOf()

`setPrototypeOf()`捕获器会在`Object.setPrototypeOf()`中被调用。

对应的反射API方法为`Reflect.setPrototypeOf()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  setPrototypeOf(target,prototype){
    console.log("setPrototypeOf()");
    return Reflect.setPrototypeOf(...arguments);
  }
})

Object.setPrototypeOf(proxy,Object);
//setPrototypeOf()
```

1. **返回值**

   `setPrototypeOf()`必须返回布尔值，表示原型赋值是否成功。返回非布尔值会被转型为布尔值。

2. **拦截的操作**

   - `Object.setPrototypeOf(proxy) `
   - `Reflect.setPrototypeOf(proxy)`

3. **捕获器处理程序参数**

   - target：目标对象。
   - prototype：`target`的替代原型，如果是顶级原型则为`null`

4. **捕获器不定式**

   如果`target`不可扩展，则`Object.getPrototypeOf(proxy) `唯一的有效返回值就是`Object.getPrototypeOf(target)`的返回值。



### isExtensible()

`isExtensible()`捕获器会在`Object.isExtensible()`中被调用。

对应的反射API方法为`Reflect.isExtensible()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  isExtensible(target){
    console.log("isExtensible()");
    return Reflect.isExtensible(...arguments);
  }
})

Object.isExtensible(proxy);
//isExtensible()
```

1. **返回值**

   `has()`必须返回布尔值，表示`target`是否可以扩展。返回非布尔值会被转型为布尔值。

2. **拦截的操作**

   - `Object.isExtensible(proxy) `
   - `Reflect.isExtensible(proxy) `

3. **捕获器处理程序参数**

   - target：目标对象。

4. **捕获器不定式**

   如果`target`可扩展，则处理程序必须返回true。

   如果`target`不可扩展，则处理程序必须返回false。

   

### preventExtensions()

`preventExtensions()`捕获器会在`Object.preventExtensions()`中被调用。

对应的反射API方法为`Reflect.preventExtensions()`。

```js
const targetObject = {};

const proxy = new Proxy(targetObject,{
  preventExtensions(target){
    console.log("preventExtensions()");
    return Reflect.preventExtensions(...arguments);
  }
})

Object.preventExtensions(proxy);
//preventExtensions()
```

1. **返回值**

   `has()`必须返回布尔值，表示`target`是否已经可以扩展。返回非布尔值会被转型为布尔值。

2. **拦截的操作**

   - `Object.preventExtensions(proxy) `
   - `Reflect.preventExtensions(proxy) `

3. **捕获器处理程序参数**

   - target：目标对象。

4. **捕获器不定式**

   如果`Object.isExtensible(proxy)`可扩展，则处理程序必须返回true。

   

### apply()

`apply()`捕获器会在调用函数时被调用。

对应的反射API方法为`Reflect.apply()`。

```js
const targetObject = () => {};

const proxy = new Proxy(targetObject,{
  apply(target,thisArg,...argumentsList){
    console.log("apply()");
    return Reflect.apply(...arguments);
  }
})

proxy();
//apply()
```

1. **返回值**

   返回值无限制。

2. **拦截的操作**

   - `proxy(...argumentsList)`
   - `Function.prototype.apply(thisArg,...argumentsList)`
   - `Function.prototype.call(thisArg,...argumentsList)`
   - `Reflect.apply((target,thisArgument,...argumentsList)`

3. **捕获器处理程序参数**

   - target：目标对象。
   - thisArg：调用函数时的this参数。
   - argumentsList：调用函数时的 参数列表。

4. **捕获器不定式**

   target必须是一个函数对象。



### construct()

`construct()`捕获器会在`new`操作时被调用。

对应的反射API方法为`Reflect.construct()`。

```js
const targetObject = function() {};

const proxy = new Proxy(targetObject,{
  construct(target,argumentsList,newTarget){
    console.log("construct()");
    return Reflect.construct(...arguments);
  }
})

new proxy;
//construct()
```

1. **返回值**

   `construct()`必须返回一个对象。

2. **拦截的操作**

   - `new proxy(...argumentsList) `
   - `Reflect.construct(target,argumentsList,c)`

3. **捕获器处理程序参数**

   - target：目标构造对象。
   - argumentsList：传给目标构造函数的参数列表。
   - newTarget：最初被调用的构造函数。

4. **捕获器不定式**

   `target`必须可以用作构造函数。



## 代理模式

### 跟踪属性访问

通过捕获get、set和has等操作，可以知道对象属性什么时候被访问、被查询。

把实现相应捕获器的某个对象代理放到应用中，可以监控这个对象合适在何处被访问过：

```js
const user = {
  name:"zhangsan"
}

const proxy = new Proxy(user,{
  get(target,property,receiver){
    console.log('Getting ${property}');
    return Reflect.get(...arguments);
  },

  set(target,property,value,receiver){
    console.log('Setting ${property} = ${value}');
    return Reflect.set(...arguments);
  }
})

proxy.name;       //Getting ${property}
proxy.age = "20"; //Setting ${property} = ${value}
```



### 隐藏属性

代理的内部实现对外部代码是不可见的，因此要隐藏目标对象上的属性也轻而易举。

```js
const hiddenProperties = ['id']

const targetObject = {
  id:1,
  name:"zhangsan",
  age:20
}

const proxy = new Proxy(targetObject,{
  get(target,property){
    if(hiddenProperties.includes(property)){
      return undefined;
    }else{
      return Reflect.get(...arguments);
    }
  },
  has(target,property){
    if(hiddenProperties.includes(property)){
      return false;
    }else{
      return Reflect.has(...arguments);
    }
  }
})

console.log(proxy.id);    //undefined
console.log(proxy.name);  //"zhangsan"
console.log(proxy.age);   //20

console.log('id' in proxy);    //false
console.log('name' in proxy);  //true
console.log('age' in proxy);   //true
```



### 属性验证

因为所有赋值操作都会触发`set()`捕获器，所以可以根据所赋的值决定是否允许还是拒绝赋值。

```js
const target = {
  allowNumber : 0
}

const proxy = new Proxy(target,{
  set(target,property,value){
    if(typeof value !== 'number'){
      return false
    }else{
      return Reflect.set(...arguments);
    }
  }
})

proxy.allowNumber = 1;
console.log(proxy.allowNumber); //1

proxy.allowNumber = "2"
console.log(proxy.allowNumber); //1
```



### 函数与构造函数参数验证

跟保护和验证对象属性类似，也可对函数和构造函数参数进行审查。

```js
function median(...nums){
  return nums.sort()[Math.floor(nums.length / 2)];
}

const proxy = new Proxy(median,{
  apply(target,thisArg,...argumentsList){
    for(const arg of argumentsList){
      if(typeof arg !== 'number'){
        console.log("Error");
      }
    }

    return Reflect.apply(...arguments);
  }
})

console.log(proxy(4,7,1));    //4
console.log(proxy(4,'7',1));  //Error
```

类似地，可以要求实例化时必须给构造函数传参。

```js
class User{
  constructor(id){
    this.id_ = id;
  }
}

const proxy = new Proxy(User,{
  construct(target,argumentsList,newTarget){
    if(argumentsList[0] === undefined){
      console.log("参数为0");
    }else{
      return Reflect.construct(...arguments)
    }
  }
})

new proxy(1)

new proxy() // 参数为0
```



### 数据绑定与可观察对象

通过代理可以把运行时原本不相关的部分联系到一起。这样就可以实现各种模式，从而让不 同的代码互操作。

比如，可以将被代理的类绑定到一个全局实例集合，让所有创建的实例都被添加到这个集合中：

```js
const userList = [];
class User{
  constructor(name){
    this.name_ = name;
  }
}

const proxy = new Proxy(User,{
  construct(){
    const newUser = Reflect.construct(...arguments);
    userList.push(newUser);
    return newUser;
  }
})

new proxy('zhangsan');
new proxy('lisi');
new proxy('wangwu');

console.log(userList);
/**
 [
  User { name_: 'zhangsan' },
  User { name_: 'lisi' },
  User { name_: 'wangwu' }
]
 */
```

另外，还可以把集合绑定到一个事件分派程序，每次插入新实例时都会发送消息：

```js
const userList = []
function emit(newValue){
  console.log(newValue);
}

const proxy = new Proxy(userList,{
  set(target,property,value,receiver){
    const result = Reflect.set(...arguments);
    if(result){
      emit(Reflect.get(target,property,receiver))
    }
    return result;
  }
})

proxy.push("zhangsan");
proxy.push("lisi")
```

