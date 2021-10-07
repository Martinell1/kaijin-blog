(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{541:function(s,a,t){"use strict";t.r(a);var e=t(8),n=Object(e.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"_1-webpack的基本使用"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-webpack的基本使用"}},[s._v("#")]),s._v(" 1.webpack的基本使用")]),s._v(" "),t("h2",{attrs:{id:"_1-1-初始化webpack项目"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-1-初始化webpack项目"}},[s._v("#")]),s._v(" 1.1 初始化webpack项目")]),s._v(" "),t("ul",[t("li",[t("p",[s._v("使用 npm init -y 初始化webpack项目")])]),s._v(" "),t("li",[t("p",[s._v("项目中会自动生成package.json文件")])]),s._v(" "),t("li",[t("p",[s._v("新建src文件夹并在该文件夹下新建index.html和index.js文件")])]),s._v(" "),t("li",[t("p",[s._v("使用npm install jquery -S安装jquery")])]),s._v(" "),t("li",[t("p",[s._v("index.js文件中使用ES6语法导入jquery")])]),s._v(" "),t("li",[t("p",[s._v("在index.html中导入index.js后会显示错误")]),s._v(" "),t("p",[s._v("Uncaught SyntaxError: Cannot use import statement outside a module")])]),s._v(" "),t("li",[t("p",[s._v("我们会发现浏览器无法识别该语法")])])]),s._v(" "),t("h2",{attrs:{id:"_1-2-安装webpack相关"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-2-安装webpack相关"}},[s._v("#")]),s._v(" 1.2 安装webpack相关")]),s._v(" "),t("p",[s._v("输入以下指令安装")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("npm install webpack@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("5.42")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".1")]),s._v(" webpack"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("cli@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("4.7")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v(" \n")])])]),t("p",[s._v("安装完成后可在package.json文件中查看")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v('  "dependencies": {\n    "jquery": "^3.6.0"\n  },\n  \n  "devDependencies": {\n    "webpack": "^5.42.1",\n    "webpack-cli": "^4.7.2"\n  }\n')])])]),t("p",[s._v("-S\t\t--save 安装在dependencies")]),s._v(" "),t("p",[s._v("-D\t\t--save-dev 开发依赖 安装在 devDependencies")]),s._v(" "),t("h2",{attrs:{id:"_1-3-在项目中配置webpack"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-3-在项目中配置webpack"}},[s._v("#")]),s._v(" 1.3 在项目中配置webpack")]),s._v(" "),t("p",[s._v("创建webpack.config.js")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  mode"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'development'")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//production生产环境  development开发环境")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("p",[t("strong",[s._v("production生产环境")])]),s._v(" "),t("ul",[t("li",[s._v("会对打包生成的文件进行代码压缩和性能优化")]),s._v(" "),t("li",[s._v("打包速度慢，适合在生产阶段使用")])]),s._v(" "),t("p",[t("strong",[s._v("development开发环境")])]),s._v(" "),t("ul",[t("li",[s._v("不会对打包生成的文件进行代码压缩和性能优化")]),s._v(" "),t("li",[s._v("打包速度快，适合在开发阶段使用")])]),s._v(" "),t("p",[s._v("在package.json中配置打包指令")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("  "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"scripts"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"dev"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"webpack"')]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])])]),t("p",[s._v("在终端中通过npm run dev执行打包指令")]),s._v(" "),t("h2",{attrs:{id:"_1-4-通过webpack-config-js进行配置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-4-通过webpack-config-js进行配置"}},[s._v("#")]),s._v(" 1.4 通过webpack.config.js进行配置")]),s._v(" "),t("p",[s._v("webpack.config.js 是 webpack 的配置文件。")]),s._v(" "),t("p",[s._v("webpack 在真正开始打包构建之前，会先读取这个配置文件， 从而基于给定的配置，对项目进行打包。")]),s._v(" "),t("p",[s._v("注意：由于 webpack 是基于 node.js 开发出来的打包工具，因此在它的配置文件中，支持使用 node.js 相关 的语法和模块进行 webpack 的个性化配置。")]),s._v(" "),t("p",[s._v("默认的打包入口为 src -> index.js")]),s._v(" "),t("p",[s._v("默认的输出路径是 dist -> main.js")]),s._v(" "),t("p",[s._v("可以在webpack.config.js里修改打包的入口和输出路径。")]),s._v(" "),t("p",[s._v("用entry指定打包的入口，")]),s._v(" "),t("p",[s._v("output指定输出目录")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" path "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'path'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nmodule"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  mode"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'development'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//production生产环境  development开发环境")]),s._v("\n\n  entry"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("path"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("__dirname"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'src/index.js'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//打包的入口文件")]),s._v("\n  output"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    path"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("path"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("__dirname"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"./dist"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//输出文件的目录")]),s._v("\n    filename"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'main.js'")]),s._v("             "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//输出文件名")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h1",{attrs:{id:"_2-webpack中的插件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-webpack中的插件"}},[s._v("#")]),s._v(" 2.webpack中的插件")]),s._v(" "),t("p",[s._v("通过安装和配置第三方的插件，可以拓展 webpack 的能力，从而让 webpack 用起来更方便。")]),s._v(" "),t("p",[s._v("最常用的 webpack 插件有如下两个：")]),s._v(" "),t("p",[t("strong",[s._v("webpack-dev-server")])]),s._v(" "),t("ul",[t("li",[s._v("类似于nodemon工具")]),s._v(" "),t("li",[s._v("当源代码发生修改，会自动打包")])]),s._v(" "),t("p",[t("strong",[s._v("html-webpack-plugin")])]),s._v(" "),t("ul",[t("li",[s._v("webpack中的html插件")]),s._v(" "),t("li",[s._v("可以通过该插件定制index.html的内容")])]),s._v(" "),t("h2",{attrs:{id:"_2-1-webpack-dev-server"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-1-webpack-dev-server"}},[s._v("#")]),s._v(" 2.1 webpack-dev-server")]),s._v(" "),t("p",[s._v("运行该代码安装")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("npm install webpack"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("dev"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("server@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("3.11")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v("\n")])])]),t("p",[s._v("配置webpack-dev-server")]),s._v(" "),t("p",[s._v("修改package.json -> script中的dev指令")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("  "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"scripts"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"dev"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"webpack serve"')]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])])]),t("p",[s._v("再次运行npm run dev指令")]),s._v(" "),t("h3",{attrs:{id:"打包生成的文件在哪里"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#打包生成的文件在哪里"}},[s._v("#")]),s._v(" 打包生成的文件在哪里？")]),s._v(" "),t("p",[t("strong",[s._v("不配置 webpack-dev-server 的情况下，webpack 打包生成的文件，会存放到实际的物理磁盘上")])]),s._v(" "),t("ul",[t("li",[s._v("严格遵守开发者在 webpack.config.js 中指定配置")]),s._v(" "),t("li",[s._v("根据 output 节点指定路径进行存放")])]),s._v(" "),t("p",[t("strong",[s._v("根据 output 节点指定路径进行存放")])]),s._v(" "),t("ul",[t("li",[s._v("不再根据 output 节点指定的路径，存放到实际的物理磁盘上")]),s._v(" "),t("li",[s._v("提高了实时打包输出的性能，因为内存比物理磁盘速度快很多")])]),s._v(" "),t("h3",{attrs:{id:"生成到内存中的文件该如何访问"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#生成到内存中的文件该如何访问"}},[s._v("#")]),s._v(" 生成到内存中的文件该如何访问?")]),s._v(" "),t("p",[t("strong",[s._v("webpack-dev-server 生成到内存中的文件，默认放到了项目的根目录中，而且是虚拟的、不可见的。")])]),s._v(" "),t("ul",[t("li",[s._v("可以直接用 / 表示项目根目录，后面跟上要访问的文件名称，即可访问内存中的文件")]),s._v(" "),t("li",[s._v("例如 /bundle.js 就表示要访问 webpack-dev-server 生成到内存中的 bundle.js 文件")])]),s._v(" "),t("h2",{attrs:{id:"_2-2-html-webpack-plugin"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-2-html-webpack-plugin"}},[s._v("#")]),s._v(" 2.2 html-webpack-plugin")]),s._v(" "),t("p",[s._v("在终端中运行以下代码安装")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("npm install html"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("webpack"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("plugin@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("5.3")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v("\n")])])]),t("p",[s._v("配置 html-webpack-plugin")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" path "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'path'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" HtmlPlugin "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'html-webpack-plugin'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" htmlPlugin "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("HtmlPlugin")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  template"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./src/index.html'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//指定原文件的存放路径")]),s._v("\n  filename"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'./index.html'")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//指定生成文件的存放路径")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\nmodule"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  mode"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'development'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//production生产环境  development开发环境")]),s._v("\n\n  entry"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("path"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("__dirname"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'src/index.js'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//打包的入口文件")]),s._v("\n  output"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    path"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("path"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("__dirname"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"./dist"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//输出文件的目录")]),s._v("\n    filename"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'main.js'")]),s._v("             "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//输出文件名")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n\n  plugins"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("htmlPlugin"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("p",[s._v("通过 HTML 插件复制到项目根目录中的 index.html 页面，也被放到了内存中")]),s._v(" "),t("p",[s._v("HTML 插件在生成的 index.html 页面，自动注入了打包的 main.js 文件")]),s._v(" "),t("h3",{attrs:{id:"devserver-节点"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#devserver-节点"}},[s._v("#")]),s._v(" devServer 节点")]),s._v(" "),t("p",[s._v("在 webpack.config.js 配置文件中，可以通过 devServer 节点对 webpack-dev-server 插件进行更多的配置， 示例代码如下：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("  devServer"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    open"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//打包完成后自动打开页面")]),s._v("\n    host"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'127.0.0.1'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//打包时使用的主机地址")]),s._v("\n    port"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("80")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//打包时用的端口号")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h1",{attrs:{id:"_3-webpack-中的-loader"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-webpack-中的-loader"}},[s._v("#")]),s._v(" 3.webpack 中的 loader")]),s._v(" "),t("p",[s._v("在实际开发过程中，webpack 默认只能打包处理以 .js 后缀名结尾的模块。")]),s._v(" "),t("p",[s._v("其他非 .js 后缀名结尾的模块， webpack 默认处理不了，需要调用 loader 加载器才可以正常打包，否则会报错！")]),s._v(" "),t("p",[t("strong",[s._v("loader 加载器的作用：协助 webpack 打包处理特定的文件模块。")])]),s._v(" "),t("p",[s._v("比如：")]),s._v(" "),t("ul",[t("li",[s._v("css-loader 可以打包处理 .css 相关的文件")]),s._v(" "),t("li",[s._v("less-loader 可以打包处理 .less 相关的文件")]),s._v(" "),t("li",[s._v("babel-loader 可以打包处理 webpack 无法处理的高级 JS 语法")])]),s._v(" "),t("p",[t("strong",[s._v("loader的调用过程如下")])]),s._v(" "),t("p",[t("img",{attrs:{src:"C:%5CUsers%5CYinshi%5CAppData%5CRoaming%5CTypora%5Ctypora-user-images%5Cimage-20210928233233819.png",alt:"image-20210928233233819"}})]),s._v(" "),t("h2",{attrs:{id:"_3-1-打包处理css文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-1-打包处理css文件"}},[s._v("#")]),s._v(" 3.1 打包处理CSS文件")]),s._v(" "),t("p",[s._v("运行以下命令，安装处理 css 文件的 loader")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v(" npm i style"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("loader@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("3.0")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),s._v(" css"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("loader@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("5.2")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".6")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v("\n")])])]),t("p",[s._v("在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("  module"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    rules"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("test"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token regex"}},[t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[s._v("\\.css$")]),t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")])]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" use"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'style-loader'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'css-loader'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//test表示文件名，use表示要调用的loader")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("ul",[t("li",[s._v("use 数组中指定的 loader 顺序是固定的")]),s._v(" "),t("li",[s._v("多个 loader 的调用顺序是：从后往前调用")])]),s._v(" "),t("h2",{attrs:{id:"_3-2-打包处理-less-文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-2-打包处理-less-文件"}},[s._v("#")]),s._v(" 3.2 打包处理 less 文件")]),s._v(" "),t("p",[s._v("运行以下命令，安装处理 less文件的 loader")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v(" npm i less"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("loader@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("10.0")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".1")]),s._v(" less@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("4.1")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".1")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v("\n")])])]),t("p",[s._v("在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("test"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token regex"}},[t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[s._v("\\.less$")]),t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")])]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" use"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'style-loader'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'css-loader'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'less-loader'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h2",{attrs:{id:"_3-3-打包处理样式表中与-url-路径相关的文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-3-打包处理样式表中与-url-路径相关的文件"}},[s._v("#")]),s._v(" 3.3 打包处理样式表中与 url 路径相关的文件")]),s._v(" "),t("p",[s._v("运行以下命令")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("npm i url"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("loader@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("4.1")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".1")]),s._v(" file"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("loader@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("6.2")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v("\n")])])]),t("p",[s._v("在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("test"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token regex"}},[t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[s._v("\\.jpg|png|gif$")]),t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")])]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" use"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'url-loader?limit-22229'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("p",[s._v("其中 ? 之后的是 loader 的参数项：")]),s._v(" "),t("ul",[t("li",[s._v("limit 用来指定图片的大小，单位是字节（byte）")]),s._v(" "),t("li",[s._v("只有 ≤ limit 大小的图片，才会被转为 base64 格式的图片")])]),s._v(" "),t("h2",{attrs:{id:"_3-4-打包处理js中的高级语法"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-4-打包处理js中的高级语法"}},[s._v("#")]),s._v(" 3.4 打包处理JS中的高级语法")]),s._v(" "),t("p",[s._v("webpack 只能打包处理一部分高级的 JavaScript 语法。对于那些 webpack 无法处理的高级 js 语法，需要借 助于 babel-loader 进行打包处理。")]),s._v(" "),t("p",[s._v("安装 babel-loader 相关的包")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("npm i babel"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("loader@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("8.2")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".2")]),s._v(" @babel"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("core@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("7.14")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".6")]),s._v(" @babel"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("/")]),s._v("plugin"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("proposal"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("decorators@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("7.14")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".5")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v("\n")])])]),t("p",[s._v("在 webpack.config.js 的 module -> rules 数组中，添加 loader 规则如下：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("test"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token regex"}},[t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[s._v("\\.js$")]),t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")])]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" use"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'babel-loader'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("exclude"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token regex"}},[t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[s._v("node_modules")]),t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")])]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])])]),t("p",[s._v("node_modules目录下的第三方依赖包不需要babel处理，因此用exclude排除")]),s._v(" "),t("p",[s._v("在项目根目录下，创建名为 babel.config.js 的配置文件，定义 Babel 的配置项如下：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("module"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),s._v("exports "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  plugins"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'@babel/plugin-proposal-decorators'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("legacy"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("true")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),t("h1",{attrs:{id:"_4-打包发布"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-打包发布"}},[s._v("#")]),s._v(" 4.打包发布")]),s._v(" "),t("p",[s._v("在 package.json 文件的 scripts 节点下，新增 build 命令如下：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("  "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"scripts"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"dev"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"webpack serve"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"build"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"webpack --mode production"')]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])])]),t("p",[s._v("--model 是一个参数项，用来指定 webpack 的运行模式。")]),s._v(" "),t("p",[s._v("production 代表生产环境，会对打包生成的文件 进行代码压缩和性能优化。")]),s._v(" "),t("p",[t("strong",[s._v("注意：通过 --model 指定的参数项，会覆盖 webpack.config.js 中的 model 选项。")])]),s._v(" "),t("h2",{attrs:{id:"_4-1-将同类型文件放入指定文件夹"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-1-将同类型文件放入指定文件夹"}},[s._v("#")]),s._v(" 4.1 将同类型文件放入指定文件夹")]),s._v(" "),t("h3",{attrs:{id:"把-javascript-文件统一生成到-js-目录中"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#把-javascript-文件统一生成到-js-目录中"}},[s._v("#")]),s._v(" 把 JavaScript 文件统一生成到 js 目录中")]),s._v(" "),t("p",[s._v("在 webpack.config.js 配置文件的 output 节点中，进行如下的配置：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("  output"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    path"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v("path"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("join")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("__dirname"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"./dist"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("   "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//输出文件的目录")]),s._v("\n    filename"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'js/main.js'")]),s._v("             "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//输出文件名")]),s._v("\n  "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])])]),t("h3",{attrs:{id:"把图片文件统一生成到-image-目录中"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#把图片文件统一生成到-image-目录中"}},[s._v("#")]),s._v(" 把图片文件统一生成到 image 目录中")]),s._v(" "),t("p",[s._v("修改 webpack.config.js 中的 url-loader 配置项，新增 outputPath 选项即可指定图片文件的输出路径：")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("test"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token regex"}},[t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")]),t("span",{pre:!0,attrs:{class:"token regex-source language-regex"}},[s._v("\\.jpg|png|gif$")]),t("span",{pre:!0,attrs:{class:"token regex-delimiter"}},[s._v("/")])]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" use"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        loader"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'url-loader'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n        options"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n          limit"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("22229")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n          outputPath"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'image'")]),s._v("\n        "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n      "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])])]),t("h3",{attrs:{id:"自动清理-dist-目录下的旧文件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#自动清理-dist-目录下的旧文件"}},[s._v("#")]),s._v(" 自动清理 dist 目录下的旧文件")]),s._v(" "),t("p",[s._v("为了在每次打包发布时自动清理掉 dist 目录中的旧文件，可以安装并配置 clean-webpack-plugin 插件")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("npm install clean"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("webpack"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),s._v("plugin@"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("3.0")]),t("span",{pre:!0,attrs:{class:"token number"}},[s._v(".0")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("-")]),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("D")]),s._v("\n")])])]),t("p",[s._v("在webpack.config.js中按需导入插件并配置")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("CleanWebpackPlugin"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("require")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'clean-webpack-plugin'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("const")]),s._v(" cleanPlugin "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("CleanWebpackPlugin")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n\nplugins"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("htmlPlugin"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("cleanPlugin"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])])]),t("h1",{attrs:{id:"_5-source-map"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_5-source-map"}},[s._v("#")]),s._v(" 5.Source Map")]),s._v(" "),t("p",[s._v("在开发环境下，webpack 默认启用了 Source Map 功能。当程序运行出错时，可以直接在控制台提示错误行 的位置，并定位到具体的源代码.")]),s._v(" "),t("p",[s._v("开发环境下，推荐在 webpack.config.js 中添加如下的配置，即可保证运行时报错的行数与源代码的行数 保持一致")]),s._v(" "),t("div",{staticClass:"language-javascript extra-class"},[t("pre",{pre:!0,attrs:{class:"language-javascript"}},[t("code",[s._v("devtool"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'eval-source-map'")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n")])])]),t("p",[t("strong",[s._v("开发环境下：")])]),s._v(" "),t("ul",[t("li",[s._v("建议把 devtool 的值设置为 eval-source-map")]),s._v(" "),t("li",[s._v("好处：可以精准定位到具体的错误行")])]),s._v(" "),t("p",[t("strong",[s._v("生产环境下：")])]),s._v(" "),t("ul",[t("li",[s._v("建议关闭 Source Map 或将 devtool 的值设置为 nosources-source-map")]),s._v(" "),t("li",[s._v("好处：防止源码泄露，提高网站的安全性")])])])}),[],!1,null,null,null);a.default=n.exports}}]);