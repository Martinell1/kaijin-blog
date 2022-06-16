---
title: 性能小册（一）-webpack优化
date: '2022-06-014 20:13:51'
categories:
 - FrontEnd
tags:
 - Webpack
 - 优化
---



## 不要让 loader 做太多事情——以 babel-loader 为例

合理设置需要`loader`处理的目录

```js
module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                //开启缓存
                loader: 'babel-loader?cacheDirectory=true',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }
    ]
}
```

## 不要放过第三方库

使用`DllPlugin`处理第三方库

> `DllPlugin` 和 `DllReferencePlugin` 用某种方法实现了拆分 bundles，同时还大幅度提升了构建的速度。"DLL" 一词代表微软最初引入的动态链接库

> `DllReferencePlugin` 和 `DllPlugin` 都是在 *单独的* webpack 配置中使用的。

**webpack.vendor.config.js**

```js
const path = require('path');

new webpack.DllPlugin({
  context: __dirname,
  name: '[name]_[fullhash]',
  path: path.join(__dirname, 'manifest.json'),
});
```

**webpack.app.config.js**

```js
new webpack.DllReferencePlugin({
  context: __dirname,
  manifest: require('./manifest.json'),
  scope: 'xyz',
  sourceType: 'commonjs2',
});
```



## Happypack——将 loader 由单进程转为多进程

> HappyPack makes initial webpack builds faster by transforming files [in parallel](https://www.npmjs.com/package/happypack#how-it-works).

Happy通过开启多进程提高打包速度

```js
// @file: webpack.config.js
const HappyPack = require('happypack');

exports.module = {
    rules: [
        {
            test: /.js$/,
            // 1) replace your original list of loaders with "happypack/loader":
            // loaders: [ 'babel-loader?presets[]=es2015' ],
            use: 'happypack/loader',
            include: [ /* ... */ ],
            exclude: [ /* ... */ ]
        }
    ]
};

exports.plugins = [
    // 2) create the plugin:
    new HappyPack({
        // 3) re-add the loaders you replaced above in #1:
        loaders: [ 'babel-loader?presets[]=es2015' ]
    })
]
```

在测试 Demo 或者小型项目中，使用 `happypack` 对项目构建速度的提升不明显，甚至会增加项目的构建速度

在比较复杂的大中型项目中，使用 `happypack `才能看到比较明显的构建速度提升

因此，在使用 `happypack` 时请根据具体情况进行选择，如果反而延长了项目的构建速度，就没有必要使用 `happypack`

## 拆分资源



## 删除冗余代码

### Tree-Shaking

`ES6`的模块系统通过静态分析，`Tree-Shaking`在编译过程中可以知道哪些代码没有被使用到，这些冗余的代码，会在打包时被忽略。

### UglifyjsWebpackPlugin

```js
module.exports = {
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                //开启缓存
                cache: true,
                //多进程打包
                parallel: true,
                output: {
                    //输出注释
                    comments: false,
                    //压缩代码
                    beautify: false
                },
            }),
        ],
    },
};
```



## 按需加载

我们可以通过按需加载提高页面加载的速度。

下面以`Vue`为例。

> 有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用[命名 chunk](https://webpack.js.org/guides/code-splitting/#dynamic-imports)，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)：

```js
const UserDetails = () =>
  import(/* webpackChunkName: "group-user" */ './UserDetails.vue')
const UserDashboard = () =>
  import(/* webpackChunkName: "group-user" */ './UserDashboard.vue')
const UserProfileEdit = () =>
  import(/* webpackChunkName: "group-user" */ './UserProfileEdit.vue')
```

> webpack 会将任何一个异步模块与相同的块名称组合到相同的异步块中。

## Gzip 压缩

通过`gzip`压缩，可以有效减少响应的体积。

只需要在`request headers `中加上这么一句，即可开启gzip压缩

````
accept-encoding:gzip
````

> HTTP 压缩是一种内置到网页服务器和网页客户端中以改进传输速度和带宽利用率的方式。在使用 HTTP 压缩的情况下，HTTP 数据在从服务器发送前就已压缩：兼容的浏览器将在下载所需的格式前宣告支持何种方法给服务器；不支持压缩方法的浏览器将下载未经压缩的数据。最常见的压缩方案包括 Gzip 和 Deflate。

