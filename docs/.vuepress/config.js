module.exports = {
  title:'YinShi\'Stack', //博客名称
  description:null,      //博客介绍

  base: '/stack/',       //博客路径,默认为'/'，需要与github仓库同名

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

    // 备案
    record: 'ICP 皖ICP备2021014180号',
    recordLink: 'ICP https://beian.miit.gov.cn/',
    // 项目开始时间，只填写年份
    startYear: '2021'
  },

  markdown:{
    lineNumbers:true,     //markdown代码块是否显示行号
  }
  
}