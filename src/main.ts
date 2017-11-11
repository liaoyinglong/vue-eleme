// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
// import * as VueResource from 'vue-resource'

// import goods from 'components/goods/goods.vue'
// import ratings from 'components/ratings/ratings.vue'
// import seller from 'components/seller/seller.vue'
import App from './App.vue'

import 'common/stylus/index.styl'

//使用vue-router
// Vue.use(VueRouter)
// Vue.use(VueResource)
//配置路由
// const routes = [
//   {
//     path: '/',
//     redirect: '/goods',
//   },
//   {
//     path: '/goods',
//     component: goods,
//   },
//   {
//     path: '/ratings',
//     component: ratings,
//   },
//   {
//     path: '/seller',
//     component: seller,
//   },
// ]
// const router = new VueRouter({
//   linkActiveClass: 'active',
//   routes,
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  // router,
})
