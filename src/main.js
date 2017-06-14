// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
//引入vue-router
import VueRouter from 'vue-router';
import VueResource from 'vue-resource'
// components 可以不用写./
import goods from 'components/goods/goods.vue';
import ratings from 'components/ratings/ratings.vue';
import seller from 'components/seller/seller.vue';
import App from './App'



//使用vue-router
Vue.use(VueRouter)
Vue.use(VueResource)
//配置路由
const routes = [{
  path: '/',
  //redirect是用来重定向的
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];
//定义路由
const router = new VueRouter({
  //指定路由匹配触发时候的的class
  linkActiveClass: 'active',
  routes
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router,
});
