/**
 * Created by zwwill on 2017/8/29.
 */
import Router from 'vue-router'
import ViewHome from './views/home.vue'


Vue.use(Router)


export default new Router({
  // mode: 'abstract',
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: ViewHome },
   
  ]
})