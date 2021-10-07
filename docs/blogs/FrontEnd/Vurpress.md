---
title: 使用Vuepress搭建静态博客网站
date: '2021-10-07 00:01:29'
categories:
 - FrontEnd
tags:
 - Vuepress
 - blog
 - github
---



## 快速搭建vuepress项目

::: warning

前提条件

VuePress 需要 [Node.js (opens new window)](https://nodejs.org/en/)>= 8.6

:::

1. 创建一个新文件夹

   ```sh
   mkdir vuepress-starter && cd vuepress-starter
   ```

2. 使用包管理器进行管理，官方推荐使用yarn

   ```sh
   yarn init # npm init
   ```

   ::: warning

   注意

   如果你的现有项目依赖了 webpack 3.x，我们推荐使用 [Yarn (opens new window)](https://classic.yarnpkg.com/zh-Hans/)而不是 npm 来安装 VuePress。因为在这种情形下，npm 会生成错误的依赖树

   :::

3. 安装vuepress依赖

   ```sh
   yarn add -D vuepress # npm install -D vuepress
   ```

4. 创建docs目录和第一篇文档

   ```sh
   mkdir docs && echo '# Hello VuePress' > docs/README.md
   ```

5. 在`package.json`中进行设置

   ```json
   {
     "scripts": {
       "docs:dev": "vuepress dev docs",
       "docs:build": "vuepress build docs"
    shel }
   }
   ```

6. 在本地启动服务器

   ```shell
   yarn docs:dev # npm run docs:dev
   ```

   vuepress会在本地启动一个热重载的开发服务器

   ::: warning

   注意

   热重载只会监控docs里的变更，如果修改了`package.json`等目录外文件，需要手动重启服务器

   :::



完成上述步骤后，应该有一个初步可以使用的vuepress项目，下面我们可以进一步丰富他。



## 目录结构

vuepress的目录及说明如下

- docs：我们在上一步创建的目录，vuepress的主要内容
  - .vuepress：用于存放全局的配置、组件、静态资源等。
    - dist：打包后的文件
    - public：静态资源目录
    - styles：用于存放样式相关的文件。
    - config.js：配置文件的入口文件。
  - blogs：我们存放文章的文件夹，不一定叫这个名字，可以新建多个二级文件夹，打包时会把md文件解析成.html文件，注意不要用中文命名文章。
  - README.md：项目的首页，打包后会被解析成index.html文件。

- node_modules：yarn管理的依赖包。
- package.json：包管理文件。



上述文件和文件夹有些是命令行帮助我们创建的，比如`package.json`和 `node_modules`,有些则需要我们手动创建,比如`.vuepress`和`blogs`

其他还有一些`yarn.lock`,`.gitignore`文件等不做说明



## 使用主题

在这里我选择的是`vuepress-theme-reco`主题，你可以访问官方文档查看更多详细的内容

[`vuepress-theme-reco`官方文档](https://vuepress-theme-reco.recoluan.com/)

1. 安装和引用主题

   ```sh
   npm install vuepress-theme-reco --save-dev
   
   # or
   
   yarn add vuepress-theme-reco
   ```

   ```js
   // .vuepress/config.js
   
   module.exports = {
     theme: 'reco'
   }  
   ```

2. 首页配置

   ```js
   // .vuepress/config.js
   
   module.exports = {
     theme: 'reco',
     themeConfig: {
       type: 'blog'
     }
   }
   ```

   将主题的风格设置为`blog`,

   然后找到`docs`目录下的`README.md`文件

   ```markdown
   ---
   home: true
   heroText:
   tagline:
   bgImage: '/hero.png'
   bgImageStyle: {
     height: '650px'
   }
   ---
   ```

3. Front Matter

   每篇md文件最上方插入Yarm Front Matter,帮助网站解析，格式如下

   ```markdown
   ---
   title: 使用Vuepress搭建静态博客网站
   date: '2021-10-07 00:01:29'
   categories:
    - FrontEnd
   tags:
    - Vuepress
    - blog
    - github
    ---
   ```

4. 定制样式

   我们希望可以对项目中的一些样式进行修改，或者定义一些变量供以后使用，你可以创建一个 `.vuepress/styles/palette.styl` 文件

   ```stylus
   //.vuepress/styles/palette.styl
   
   // 颜色
   $accentColor = #F25260  // 主题颜色
   $textColor = #D95525   // 文本颜色
   $borderColor = #F2A03D  // 边框线颜色
   $codeBgColor = #282c34  // 代码块背景色
   
   $arrowBgColor = #F2E6CE
   
   $badgeTipColor = #42b983
   $badgeWarningColor = #F2A03D
   $badgeErrorColor = #F22727
   
   // 布局
   $navbarHeight = 3.6rem
   $sidebarWidth = 20rem
   $contentWidth = 740px
   $homePageWidth = 960px
   
   // 响应式变化点
   $MQNarrow = 959px
   $MQMobile = 719px
   $MQMobileNarrow = 419px
   ```

   对样式进行修改，可以通过F12查看控制台

   在这里我希望修改社交图标为等距显示

   ```stylus
   //.vuepress/styles/index.styl
   
   .personal-info-wrapper .social-links{
     justify-content: space-between  
   }
   ```

   

5. 其他个人配置

   ```js
   module.exports = {
     title:'YinShi\'Stack', //博客名称
     description:null,      //博客介绍
   
     base: '/stack/',       //博客路径,默认为'/'，需要与github仓库同名，暂时可忽略
   
     theme: 'reco',         //主题
     head: [
       ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }], //移动端适配
       ['link', { rel: 'icon', href: '/logo.png' }]                                                    //页面logo设置
     ],
     themeConfig: {
       type: 'blog',                            //该主题的样式，博客或者文档
       logo: '/logo.png',                       //nav栏上的logo
       authorAvatar: '/avatar.png',             //用户信息栏的头像
       subSidebar: 'auto',                      //文章详情页的目录，默认开启
       nav: [
         { text: 'Home', icon:'reco-home', link: '/' },
         // { text: 'About',icon:'reco-account', link: '/about/' },
         // { text: 'External',  link: '#' },
       ],
       blogConfig: { 
         category: {
           location: 2,     // 在导航栏菜单中所占的位置，默认2
           text: 'Category' // 默认文案 “分类”
         },
         tag: {
           location: 3,     // 在导航栏菜单中所占的位置，默认3
           text: 'Tag'      // 默认文案 “标签”
         },
         socialLinks: [     // 信息栏展示社交信息
           { icon: 'reco-github', link: 'https://github.com/kaijin1' },
           { icon: 'reco-bilibili', link: 'https://space.bilibili.com/7181347' },
           { icon: 'reco-mayun', link: 'https://gitee.com/ashene' },
           { icon: 'reco-weibo', link: 'https://weibo.com/5986027790/profile?topnav=1&wvr=6' },
           { icon: 'reco-jianshu', link: 'https://www.jianshu.com/u/b2c70922d114' },
           { icon: 'reco-juejin', link: 'https://juejin.cn/user/4072246801085575' }
         ]
       },
       author: 'YinShi'      //全局配置作者信息
     },
   
     markdown:{
       lineNumbers:true,     //markdown代码块是否显示行号
     }
     
   }
   ```

   ::: warning

   更多配置可以查看

   [vuepress-theme-reco官方文档](https://vuepress-theme-reco.recoluan.com/views/1.x/configJs.html) 和 [Vuepress官方文档](https://vuepress.vuejs.org/zh/config/#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE)

   :::

   

## 部署

1. 新建一个github仓库

   ![image-20211007115653722](https://gitee.com/ashene/pic-go/raw/master/image-20211007115653722.png)

   ::: warning

   在 `docs/.vuepress/config.js` 中设置正确的 `base`。

   如果你打算发布到 `https://<USERNAME>.github.io/`，则可以省略这一步，因为 `base` 默认即是 `"/"`

   如果你打算发布到 `https://<USERNAME>.github.io/<REPO>/`（也就是说你的仓库在 `https://github.com/<USERNAME>/<REPO>`），则将 `base` 设置为 `"/<REPO>/"`。

   :::

2. 将该仓库克隆到本地，并将vuepress项目复制到该仓库

3. 创建一个新的分支`gh-pages`,并删除`gh-pages`内的所有内容

4. 在项目的根路径下新建`deploy.sh`脚本，并添加以下内容（请自行判断去掉高亮行的注释）

   ```sh
   # 确保脚本抛出遇到的错误
   set -e
   
   # 生成静态文件
   npm run docs:build
   
   # 进入生成的文件夹
   cd docs/.vuepress/dist
   
   # 如果是发布到自定义域名
   # echo 'www.example.com' > CNAME
   
   git init
   git add -A
   git commit -m 'deploy'
   
   # 如果发布到 https://<USERNAME>.github.io
   # git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
   
   # 如果发布到 https://<USERNAME>.github.io/<REPO>
   # git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
   
   cd -
   ```

5. 执行该脚本

   ```sh
   bash deploy.sh
   ```

6. 前往github仓库 => Settings => Pages

   ![image-20211007115538341](https://gitee.com/ashene/pic-go/raw/master/image-20211007115538341.png)

   将主页修改为gh-pages目录下的`/root`，点击save。

7. 打开网站，查看网站是否部署成功。



## 自动化部署

项目虽然成功部署了，但是我们每一次push后都需要手动运行一次`deploy.sh`脚本，十分麻烦。

因此我们希望有方法可以实现在每次Push后自动执行打包指令。



1. 生成Token

   - 前往github的Person access tokens

   ![image-20211007120438011](https://gitee.com/ashene/pic-go/raw/master/image-20211007120438011.png)

   - 点击生成token，依次填入信息
     - Note：输入vuepress的仓库名
     - Expiration：过期时间，选择NoExpiration
     - Select scopes：选择repo和workflow
   - 生成后的token先复制下来，保存在一个文档里

2. 将token添加到Actions secrets

   - 来到github仓库，Setting =>  Secrets
   - 点击新增secret，依次填入信息
     - ACCESS_TOKEN
     - 上面生成的token

3. 使用github Action实现自动部署

   - 来到github仓库，Action =>  New workflow => Set up this workflow

   - 输入以下信息

     ::: warning

     主分支名`main`还是`master`，包管理工具`yarn`还是`npm`，根据自己的情况进行修改

     :::

     ```yml
     name: 'github actions build and deploy gh-pages'
     on: 
       push:
         branches:
           - main
     jobs:
       build-and-deploy:
         runs-on: ubuntu-latest
         steps:
           - name: Checkout
             uses: actions/checkout@v2.3.1   
             with: 
               persist-credentials: false
           - name: install and build
             run: |        
               yarn install
               yarn run docs:build
     
           - name: Deploy
             uses: JamesIves/github-pages-deploy-action@4.1.5
             with: 
               ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
               BRANCH: gh-pages
               FOLDER: docs/.vuepress/dist
     
     ```

   - 将远程仓库的变更`fetch`到本地



大功告成，效果如下

![image-20211007150850005](https://gitee.com/ashene/pic-go/raw/master/image-20211007150850005.png)