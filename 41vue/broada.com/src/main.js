import Vue from 'vue';
import VueRouter from 'vue-router';
(function(win){
    var w = document.body && document.body.clientWidth,
    f = w*48/360;
    window.document.getElementsByTagName('html')[0].setAttribute('style', 'font-size:'+f+'px;');
})(window);
localStorage.setItem("baseURL","");
localStorage.setItem("isTest", false);//判断需要模拟的data数据,为真，则是需要模拟数据
//http://10.1.10.244:8080
//加载组件
var HomePage = require('./components/homepage.vue');//首页
var News = require('./components/news.vue');//新闻详情页
var NewsList = require('./components/newslist.vue');//新闻列表页
var NavList = require('./components/navlist.vue');//主导航页
var SecMenu = require('./components/secmenu.vue');//产品和解决方案页菜单页
var Product = require('./components/product.vue')//产品和解决方案详情页
var Strategy = require('./components/strategy.vue')//产品和解决方案详情页

var App = Vue.extend({});
//加载全局样式
require('./style/main');

Vue.use(VueRouter);
var router = new VueRouter();
//配置路由
router.map({
    '/':{
        component: HomePage
    },
    '/news':{
        component:News,
        subRoutes:{
            '/:newsId':{
                name:'news',
                component:News
            }
        }
    },
    '/newslist':{
        component:NewsList
    },
    '/navlist':{
        component:NavList
    },
    '/secmenu':{
        component:SecMenu,
        subRoutes:{
            '/:catalog':{
                name:'secmenu',
                component:SecMenu
            }
        }
    },
    '/product':{
        component:Product,        
        subRoutes:{
            '/:prodId':{
                name:'product',
                component:Product
            }
        }
    },
    '/strategy': {
        component: Strategy
    }
});
router.beforeEach(function(){
    window.scrollTo(0, 0)
});
router.start(App, '#app');
