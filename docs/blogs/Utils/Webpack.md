---
title: Webpack基本配置
date: '2021-10-07 10:33:03'
categories:
 - Utils
tags:
 - Webpack
 - 配置
---

# 1.webpack的基本使用

## 1.1 初始化webpack项目

- 使用 npm init -y 初始化webpack项目

  

- 项目中会自动生成package.json文件

  

- 新建src文件夹并在该文件夹下新建index.html和index.js文件

  

- 使用npm install jquery -S安装jquery

  

- index.js文件中使用ES6语法导入jquery

  

- 在index.html中导入index.js后会显示错误

  Uncaught SyntaxError: Cannot use import statement outside a module

  

- 我们会发现浏览器无法识别该语法

## 1.2 安装webpack相关

输入以下指令安装

```javascript
npm install webpack@5.42.1 webpack-cli@4.7.2 -D 
```



安装完成后可在package.json文件中查看

```
  "dependencies": {
    "jquery": "^3.6.0"
  },
  
  "devDependencies": {
    "webpack": "^5.42.1",
    "webpack-cli": "^4.7.2"
  }
```

-S		--save 安装在dependencies

-D		--save-dev 开发依赖 安装在 devDependencies



## 1.3 在项目中配置webpack

创建webpack.config.js

```javascript
module.exports = {
  mode:'development'  //production生产环境  development开发环境
}
```

**production生产环境** 

- 会对打包生成的文件进行代码压缩和性能优化
- 打包速度慢，适合在生产阶段使用



**development开发环境**

- 不会对打包生成的文件进行代码压缩和性能优化
- 打包速度快，适合在开发阶段使用



在package.json中配置打包指令

```javascript
  "scripts": {
    "dev": "webpack"
  },
```



在终端中通过npm run dev执行打包指令



## 1.4 通过webpack.config.js进行配置

webpack.config.js 是 webpack 的配置文件。

webpack 在真正开始打包构建之前，会先读取这个配置文件， 从而基于给定的配置，对项目进行打包。 

注意：由于 webpack 是基于 node.js 开发出来的打包工具，因此在它的配置文件中，支持使用 node.js 相关 的语法和模块进行 webpack 的个性化配置。



默认的打包入口为 src -> index.js

默认的输出路径是 dist -> main.js



可以在webpack.config.js里修改打包的入口和输出路径。

用entry指定打包的入口，

output指定输出目录

```javascript
const path = require('path')
module.exports = {
  mode:'development', //production生产环境  development开发环境

  entry:path.join(__dirname,'src/index.js'),   //打包的入口文件
  output:{
    path:path.join(__dirname,"./dist"),   //输出文件的目录
    filename:'main.js'             //输出文件名
  }

}
```





# 2.webpack中的插件

通过安装和配置第三方的插件，可以拓展 webpack 的能力，从而让 webpack 用起来更方便。

最常用的 webpack 插件有如下两个： 

**webpack-dev-server**

- 类似于nodemon工具
- 当源代码发生修改，会自动打包



**html-webpack-plugin**

- webpack中的html插件
- 可以通过该插件定制index.html的内容

## 2.1 webpack-dev-server

运行该代码安装

```javascript
npm install webpack-dev-server@3.11.2 -D
```



配置webpack-dev-server

修改package.json -> script中的dev指令

```javascript
  "scripts": {
    "dev": "webpack serve"
  },
```



再次运行npm run dev指令



### 打包生成的文件在哪里？

**不配置 webpack-dev-server 的情况下，webpack 打包生成的文件，会存放到实际的物理磁盘上**

- 严格遵守开发者在 webpack.config.js 中指定配置
- 根据 output 节点指定路径进行存放



**根据 output 节点指定路径进行存放**

- 不再根据 output 节点指定的路径，存放到实际的物理磁盘上
- 提高了实时打包输出的性能，因为内存比物理磁盘速度快很多



### 生成到内存中的文件该如何访问?

**webpack-dev-server 生成到内存中的文件，默认放到了项目的根目录中，而且是虚拟的、不可见的。**

- 可以直接用 / 表示项目根目录，后面跟上要访问的文件名称，即可访问内存中的文件
-  例如 /bundle.js 就表示要访问 webpack-dev-server 生成到内存中的 bundle.js 文件



## 2.2 html-webpack-plugin

在终端中运行以下代码安装

```javascript
npm install html-webpack-plugin@5.3.2 -D
```



配置 html-webpack-plugin

```javascript
const path = require('path')

const HtmlPlugin = require('html-webpack-plugin')

const htmlPlugin = new HtmlPlugin({
  template:'./src/index.html',  //指定原文件的存放路径
  filename:'./index.html'   //指定生成文件的存放路径
})

module.exports = {
  mode:'development', //production生产环境  development开发环境

  entry:path.join(__dirname,'src/index.js'),   //打包的入口文件
  output:{
    path:path.join(__dirname,"./dist"),   //输出文件的目录
    filename:'main.js'             //输出文件名
  },

  plugins:[htmlPlugin]

}
```



通过 HTML 插件复制到项目根目录中的 index.html 页面，也被放到了内存中

HTML 插件在生成的 index.html 页面，自动注入了打包的 main.js 文件



### devServer 节点

在 webpack.config.js 配置文件中，可以通过 devServer 节点对 webpack-dev-server 插件进行更多的配置， 示例代码如下：

```javascript
  devServer:{
    open:true, //打包完成后自动打开页面
    host:'127.0.0.1', //打包时使用的主机地址
    port:80,  //打包时用的端口号
  }
```



# 3.webpack 中的 loader

在实际开发过程中，webpack 默认只能打包处理以 .js 后缀名结尾的模块。

其他非 .js 后缀名结尾的模块， webpack 默认处理不了，需要调用 loader 加载器才可以正常打包，否则会报错！



**loader 加载器的作用：协助 webpack 打包处理特定的文件模块。**

比如： 

- css-loader 可以打包处理 .css 相关的文件
- less-loader 可以打包处理 .less 相关的文件 
- babel-loader 可以打包处理 webpack 无法处理的高级 JS 语法



**loader的调用过程如下**

![image-20210928233233819](C:\Users\Yinshi\AppData\Roaming\Typora\typora-user-images\image-20210928233233819.png)



## 3.1 打包处理CSS文件

运行以下命令，安装处理 css 文件的 loader

```javascript
 npm i style-loader@3.0.0 css-loader@5.2.6 -D
```



在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下：

```javascript
  module:{
    rules:[
      {test:/\.css$/, use:['style-loader','css-loader']}  //test表示文件名，use表示要调用的loader
    ]
  }
```

- use 数组中指定的 loader 顺序是固定的
- 多个 loader 的调用顺序是：从后往前调用



## 3.2 打包处理 less 文件

运行以下命令，安装处理 less文件的 loader

```javascript
 npm i less-loader@10.0.1 less@4.1.1 -D
```



在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下：

```javascript
{test:/\.less$/, use:['style-loader','css-loader','less-loader']}
```



## 3.3 打包处理样式表中与 url 路径相关的文件

运行以下命令

```javascript
npm i url-loader@4.1.1 file-loader@6.2.0 -D
```



在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下：

```javascript
{test:/\.jpg|png|gif$/, use:['url-loader?limit-22229']}
```

其中 ? 之后的是 loader 的参数项：

- limit 用来指定图片的大小，单位是字节（byte）
- 只有 ≤ limit 大小的图片，才会被转为 base64 格式的图片



## 3.4 打包处理JS中的高级语法

webpack 只能打包处理一部分高级的 JavaScript 语法。对于那些 webpack 无法处理的高级 js 语法，需要借 助于 babel-loader 进行打包处理。

安装 babel-loader 相关的包

```javascript
npm i babel-loader@8.2.2 @babel/core@7.14.6 @babel/plugin-proposal-decorators@7.14.5 -D
```



在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下：

```javascript
{test:/\.js$/, use:'babel-loader',exclude:/node_modules/},
```

node_modules目录下的第三方依赖包不需要babel处理，因此用exclude排除



在项目根目录下，创建名为 babel.config.js 的配置文件，定义 Babel 的配置项如下：

```javascript
module.exports = {
  plugins:['@babel/plugin-proposal-decorators',{legacy:true}]
}
```



# 4.打包发布

在 package.json 文件的 scripts 节点下，新增 build 命令如下：

```javascript
  "scripts": {
    "dev": "webpack serve",
    "build":"webpack --mode production"
  },
```

--model 是一个参数项，用来指定 webpack 的运行模式。

production 代表生产环境，会对打包生成的文件 进行代码压缩和性能优化。



**注意：通过 --model 指定的参数项，会覆盖 webpack.config.js 中的 model 选项。**



## 4.1 将同类型文件放入指定文件夹

### 把 JavaScript 文件统一生成到 js 目录中

在 webpack.config.js 配置文件的 output 节点中，进行如下的配置：

```javascript
  output:{
    path:path.join(__dirname,"./dist"),   //输出文件的目录
    filename:'js/main.js'             //输出文件名
  },
```



### 把图片文件统一生成到 image 目录中

修改 webpack.config.js 中的 url-loader 配置项，新增 outputPath 选项即可指定图片文件的输出路径：

```javascript
      {test:/\.jpg|png|gif$/, use:{
        loader:'url-loader',
        options:{
          limit:22229,
          outputPath:'image'
        }
      }},
```



###  自动清理 dist 目录下的旧文件

为了在每次打包发布时自动清理掉 dist 目录中的旧文件，可以安装并配置 clean-webpack-plugin 插件

```javascript
npm install clean-webpack-plugin@3.0.0 -D
```



在webpack.config.js中按需导入插件并配置

```javascript
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const cleanPlugin = new CleanWebpackPlugin()

plugins:[htmlPlugin,cleanPlugin],
```



# 5.Source Map

在开发环境下，webpack 默认启用了 Source Map 功能。当程序运行出错时，可以直接在控制台提示错误行 的位置，并定位到具体的源代码.



开发环境下，推荐在 webpack.config.js 中添加如下的配置，即可保证运行时报错的行数与源代码的行数 保持一致

```javascript
devtool:'eval-source-map',
```



**开发环境下：**

- 建议把 devtool 的值设置为 eval-source-map
- 好处：可以精准定位到具体的错误行



**生产环境下：**

- 建议关闭 Source Map 或将 devtool 的值设置为 nosources-source-map
- 好处：防止源码泄露，提高网站的安全性