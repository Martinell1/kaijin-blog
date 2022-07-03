---
title: 设计模式小册（一）-工厂模式
date: '2022-06-2417:13:51'
categories:
 - FrontEnd
tags:
 - 设计模式
 - 工厂模式
---



## 工厂模式

### 构造器模式

如果我们需要创建一个对象，我们有哪些方法？

最简单的，我们可以通过`{}`直接声明一个对象实例。

```js
const xiaoming = {
    name:'小明',
    age:22,
    gender:'male'
}
```

如果我们还想声明另一个对象，则需要添加如下代码

```js
const xiaohong = {
    name:'小红',
    age:21,
    gender:'female'
}
```

如果我们要添加一个班的人，通过这种方式，我们至少需要50*5行代码，那么，有没有什么办法能够进行改善呢？

答案是肯定的，通过构造函数，我们可以快速声明同类型的实例。

```js
function Person(name,age,gender){
    this.name = name
    this.age = age
    this.gender = gender
}

const xiaoming = new Person('小明',22,'male')
```

这样一来，我们的代码量骤降，只需要5+50行代码便可解决上述问题。

当然，我们也可以使用`class`写法

```js
class Person{
    constructor(name,age,gender){
        this.name = name
        this.age = age
        this.gender = gender
    }
}

const xiaoming = new Person('小明',22,'male')
```



### 工厂模式

现在，我们的需求发生了变化，假如这是一盘狼人杀游戏，每个人都拥有各自的身份，那么我们应该怎么做？

首先，我们想到了可以创建多个构造函数。

```js
//狼人
function Werewolf(name){
    this.name = name
    this.identity = 'werewolf'
    this.talent = ['kill']
}

//村民
function Civilian(name){
    this.name = name
    this.identity = 'civilian'
    this.talent = []
}

//女巫
function Witch(name){
    this.name = name
    this.identity = 'Witch'
    this.talent = ['poison','antidote']
}
```

可以看到，我们需要为每个身份创建一个构造函数，并且为每个玩家手动调用一次相应的构造函数，当然，我们可以将这个过程进行一个封装。

```js
function Factory(name,identity){
    switch(identity){
        case 'werewolf':
            return new Werewolf(name,identity)
            break
        case 'civilian':
            return new Civilian(name,identity)
            break
        case 'witch':
            return new Witch(name,identity)
            break
    }
}
```

可以看到，我们创建了一个工厂函数，我们可以直接将`name`和`identity`传递给工厂函数，让它帮助我们实现创建实例的过程，看上去似乎很完美，但它仍然有一个问题，我们知道，狼人杀游戏中可不止这三个身份，预言家，猎人，野孩子，盗贼，白狼王等等，随着参与人数的增加有多个可扩展的身份，难道我们对每一个身份都写一个构造函数吗，当然，这是一个可行的方案，但是有没有更好的解决方法呢？

观察代码，我们发现，所有构造函数所需要的参数都是相同的，基于这种情况，我们是否能将其进行一定的抽象处理？

```js
function Player(name,identity,talent){
    this.name = name
    this.identity = identity
    this.talent = talent
}
function Factory(name,identity){
    let talent = []
    switch(identity){
        case 'werewolf':
            talent = ['kill']
            break
        case 'civilian':
            talent = []
            break
        case 'witch':
            talent = ['poison','antidote']
            break
    }
    return new Player(name,identity,talent)
}
```

将所有身份抽象为`Player`类，抽离出公共的属性，这样一套操作下来，我们的代码量骤减且运行良好。

回顾工厂模式和构造器模式的区别，构造器模式帮助我们解决创建多个类似实例的问题，而工厂模式则是处理多个类似构造器的问题。



### 抽象工厂模式

如何组装一台手机？

首先，我们先确定需求，一台手机由必备的系统和硬件两部分组成

根据生产的型号不同，系统和硬件可能有所差异，但是二者都是必备的，这个类就像`java`中的接口，只做声明，不做实现。

```js
class MobilePhoneFactory{
    createOS(){
        throw new Error('需要重写')
    }

    createHardWare(){
        throw new Error('需要重写')
    } 
}
```

其次，手机的系统应该分为两类，安卓和IOS

二者的操作方式应该一致，因此我们使用一个抽象类OS，并且定义一个方法`controllerHardWare`

安卓和IOS系统都拥有这个接口，但是二者的具体实现同样有所差异,因此需要将其重写

```js
class OS{
    controllerHardWare(){
        throw new Error('需要重写')
    }
}

class AndroidOS extends OS{ 
    controllerHardWare(){
        console.log('安卓手机');
    }
}

class AppleOS extends OS{
    controllerHardWare(){
        console.log('苹果手机');
    }
}
```

然后，手机的硬件也应该由多个厂商提供，这里我们简单例举为三个芯片厂商

```js
class HardWare{
    operateByOrder(){
        throw new Error('需要重写')
    }
}

class AppleHardWare extends HardWare{
    operateByOrder(){
        console.log('苹果芯片');
    } 
}

class QualcommHardWare extends HardWare{
    operateByOrder(){
        console.log('高通芯片');
    }
}

class DimensityHardWare extends HardWare{
    operateByOrder(){
        console.log('天玑芯片');
    }
}
```

最后，我们给出具体的生产方式，该工厂应该实现事先声明的接口

```js
class MyPhoneFactory extends MobilePhoneFactory{

    constructor(OS,HardWare){
        super()
        this.OS = OS
        this.HardWare = HardWare
    }

    createOS(){
        if(this.OS === 'Android'){
            return new AndroidOS()
        }else{
            return new AppleOS()
        }
    }

    createHardWare(){
        if(this.HardWare === 'Dimensity'){
            return new DimensityHardWare()
        }else if(this.HardWare === 'Apple'){
            return new AppleHardWare()
        }else{
            return new QualcommHardWare()
        }
    }
}
```

开始生产

```js
    const myPhone = new MyPhoneFactory('Android','Qualcomm')
    const myOS = myPhone.createOS()
    const myHardWare = myPhone.createHardWare()

    myOS.controllerHardWare()
    myHardWare.operateByOrder()
```

大家现在回头对比一下抽象工厂和简单工厂的思路，思考一下：它们之间有哪些异同？

它们的共同点，在于都**尝试去分离一个系统中变与不变的部分**。它们的不同在于**场景的复杂度**。在简单工厂的使用场景里，处理的对象是类，并且是一些非常好对付的类——它们的共性容易抽离，同时因为逻辑本身比较简单，故而不苛求代码可扩展性。抽象工厂本质上处理的其实也是类，但是是一帮非常棘手、繁杂的类，这些类中不仅能划分出门派，还能划分出等级，同时存在着千变万化的扩展可能性——这使得我们必须对**共性**作更特别的处理、使用抽象类去降低扩展的成本，同时需要对类的性质作划分，于是有了这样的四个关键角色：

- **抽象工厂（抽象类，它不能被用于生成具体实例）：** 用于声明最终目标产品的共性。在一个系统里，抽象工厂可以有多个（大家可以想象我们的手机厂后来被一个更大的厂收购了，这个厂里除了手机抽象类，还有平板、游戏机抽象类等等），每一个抽象工厂对应的这一类的产品，被称为“产品族”。
- **具体工厂（用于生成产品族里的一个具体的产品）：** 继承自抽象工厂、实现了抽象工厂里声明的那些方法，用于创建具体的产品的类。
- **抽象产品（抽象类，它不能被用于生成具体实例）：** 上面我们看到，具体工厂里实现的接口，会依赖一些类，这些类对应到各种各样的具体的细粒度产品（比如操作系统、硬件等），这些具体产品类的共性各自抽离，便对应到了各自的抽象产品类。
- **具体产品（用于生成产品族里的一个具体的产品所依赖的更细粒度的产品）：** 比如我们上文中具体的一种操作系统、或具体的一种硬件等。