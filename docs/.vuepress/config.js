module.exports = {
  title:'YinShi\'Stack',
  description:null,

  base: '/stack/',

  theme: 'reco',
  head: [
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
    ['link', { rel: 'icon', href: '/logo.png' }]
  ],
  themeConfig: {
    type: 'blog',
    logo: '/logo.png',
    authorAvatar: '/avatar.png',
    subSidebar: 'auto',
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
    author: 'YinShi'
  },

  markdownit:{
    lineNumbers:true,
  }
  
}