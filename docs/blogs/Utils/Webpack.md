---
title: webpack配置
date: '2021-10-07 10:33:03'
categories:
 - Utils
tags:
 - Webpack
 - 配置
---

# 基本配置

## 初始化项目

```shell
npm init -y

npm install webpack webpack-cli -D
```

修改package.json配置

```json
{
  "scripts": {
    "dev": "webpack-dev-server --config config/webpack.dev.js",
    "build": "webpack --config config/webpack.prod.js"
  },
}
```



## 配置路径

新建path.js文件，配置src目录路径和dist目录路径并导出。

```js
const path = require('path');

const srcPath = path.join(__dirname,'..','src')

const distPath = path.join(__dirname,'..','dist')

module.exports =  {
  srcPath,
  distPath
}
```

新建webpack.config.js文件



## 配置入口

一般为src目录下的index.js文件。

```js
module.exports = {
  entry:{
    index:path.join(srcPath,'index'),
  }
}
```

## 配置模块

- 配置不需要处理的模块

  第三方导入的库不需要处理，包括各种xxxx.min.js文件

  ```js
  const { srcPath } = require('./path');
  
  module.exports = {
  //......
    module:{
  	noParse:[/react\.min\.js$/]
    }
  //.....
  }
  ```

  

- 配置打包规则

  `test`	使用正则命中文件后缀

  `use`	该类文件需要哪些loader,需要通过npm导入，数组结构，从后往前

  `include`和`exclude`	命中或排除指定目录内的文件。

  ```js
  const { srcPath } = require('./path');
  
  module.exports = {
  //......
    module:{
      rules:[
        {
          test:/\.js$/,
          use:['babel-loader?cacheDirectory'],
          include:srcPath,
        },
        {
          test:/\.vue$/,
          use:['vue-loader'],
          include:srcPath,
        }
      ]
    }
  //.....
  }
  ```



## 配置插件

- HtmlWebpackPlugin

  创建一个html作为页面入口

  ```shell
  npm install --save-dev html-webpack-plugin
  ```

  ```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const { srcPath } = require('./path');
  
  module.exports = {
  //......
    plugins:[
      new HtmlWebpackPlugin({
        template:path.join(srcPath,'index.html'),
        filename:'index.html',
        chunks:['index']
      })
    ]
  }
  ```



## 配置多入口示例

```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { srcPath } = require('./path');

module.exports = {
  entry:{
    index:path.join(srcPath,'index'),
    other:path.join(srcPath,'other'),
  },
//......
  plugins:[
    new HtmlWebpackPlugin({
      template:path.join(srcPath,'index.html'),
      filename:'index.html',
      //chunks 引入那些入口文件
      chunks:['index','vendor','common']
    }),

    new HtmlWebpackPlugin({
      template:path.join(srcPath,'other.html'),
      filename:'other.html',
      chunks:['other','common']
    })
  ]
}
```



## 配置babel

```shell
npm install -D babel-loader @babel/core @babel/preset-env webpack
```

新建.babelrc文件

```js
{
  "presets":["@babel/preset-env"],
  "plugins": []
}
```



# 开发环境

新建webpack.dev.js文件

## 导入公共配置

```shell
npm install webpack-merge
```

```js
const {merge} = require('webpack-merge')

module.exports = merge(webpackCommonConf,{
  mode:'development',
//......
})
```



## 配置模块

```js
const {merge} = require('webpack-merge')
const webpackCommonConf = require('./webpack.common.js')

module.exports = merge(webpackCommonConf,{
  mode:'development',
  module:{
    rules:[
      {//图片资源
        test:/\.(png|jpg|jpeg|gif)$/,
        use:['file-loader']
      },
      {//css资源
        test:/\.css$/,
        use:['style-loader','css-loader','postcss-loader']
      },
      {//less资源
        test:/\.less$/,
        use:['style-loader','css-loader','less-loader']
      }
    ]
  }
})
```



## 配置插件

- DefinePlugin

  可定义全局变量

  ```shell
  npm install webpack
  ```

  ```js
  const webpack = require('webpack') 
  const {merge} = require('webpack-merge')
  const { distPath } = require('./path.js')
  const webpackCommonConf = require('./webpack.common.js')
  
  module.exports = merge(webpackCommonConf,{
  //......
    plugins:[
      new webpack.DefinePlugin({
        ENV:JSON.stringify('development')
      })
    ],
  //......
  })
  ```



## 配置端口

```js
const {merge} = require('webpack-merge')
const { distPath } = require('./path.js')
const webpackCommonConf = require('./webpack.common.js')

module.exports = merge(webpackCommonConf,{
//......
  devServer:{
    port:3001,	//端口号
    client:{	//进度条
      progress:true
    },
    static:distPath,	//静态文件目录
    open:true,	//自启动
    compress:true,	//启用gzip
  }
})
```



## 配置postcss

自动添加厂商前缀

新建postcss.config.js

```js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

# 发布环境

## 配置出口

```js
const {merge} = require('webpack-merge')
const { distPath } = require('./path')
const webpackCommonConf = require('./webpack.common')

module.exports = merge(webpackCommonConf,{
  mode:'production',
  output:{
    filename:'[name].js',
    path:distPath
  }
//......
})
```



## 配置模块

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack') 
const {merge} = require('webpack-merge')
const { distPath } = require('./path')
const webpackCommonConf = require('./webpack.common')

module.exports = merge(webpackCommonConf,{
//......
  module:{
    rules:[
      {//小图片转base64格式
        test:/\.(png|jpg|jpeg|gif)$/,
        use:{
          loader:'url-loader',
          options:{
            limit:5 * 1024,
            outputPath:'/img1/'
          }
        }
      },
      {
        test:/\.css$/,
        use:[
          MiniCssExtractPlugin.loader,	//抽离css --取代style-loader
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test:/\.less$/,
        use:[
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader'
        ]
      }
    ]
  }
//......
})
```



## 配置插件

```js
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack') 
const {merge} = require('webpack-merge')
const webpackCommonConf = require('./webpack.common')

module.exports = merge(webpackCommonConf,{
  plugins:[
    //清楚多余代码
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({	
      ENV:JSON.stringify('production')
    }),
      
	//抽离css
    new MiniCssExtractPlugin({	
      filename:'css/main.css'
    }),

    //忽略moment下的locale库
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    })
  ]
})
```



## 配置优化

```js
module.exports = merge(webpackCommonConf,{
  optimization:{
    realContentHash: false,	//处理静态资源是否添加hash,false开启
    //压缩css文件
    minimizer:[
      new TerserPlugin({}),
      new OptionCssAssetsPlugin({})
    ],
    //分割代码块
    splitChunks: {
      chunks: 'all',
      //缓存分组
      cacheGroups: {
        //第三方模块
        vendor: {
          name:'vendor',	//chunk 名称
          test: /node_modules/,
          priority: 1,	//权限更高,优先抽离
          minSize:0,	//大小限制
          minChunks:1	//最少复用过几次
        },
        //公共模块
        common: {
          name:'common',
          priority: 0,
          minSize:0,
          minChunks:2
        },
      },
    },
  }
})
```





