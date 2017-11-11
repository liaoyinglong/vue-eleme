<template>
  <div id="app">
    <div>
      <v-header :seller="seller"></v-header>
    </div>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to='/goods'>商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/ratings'>评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to='/seller'>商家</router-link>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view :seller='seller'></router-view>
      </keep-alive>
    </div>
  </div>
</template>

 <script lang='ts'>
import Vue from 'vue'
import header from './components/header/header.vue'
import { urlParse } from './common/ts/util'

const ERR_OK = 0
export default Vue.extend({
  components: {
    'v-header': header,
  },
  data() {
    return {
      seller: {
        id: '',
      },
    }
  },
  created() {},
  methods: {
    getSellerId(): string {
      return urlParse().id
    },
  },
})
// import header from 'components/header/header.vue'
// import { urlParse } from './common/ts/util'

// const ERR_OK = 0
// export default {
//   data() {
//     return {
//       seller: {
//         id: (() => {
//           let queryParam = urlParse()
//           return queryParam.id
//         })(),
//       },
//     }
//   },
//   created() {
//     //因为在dev-server.js中定义了获取数据的接口，所以这里可以省略路径的写法
//     this.$http.get('/api/seller').then(response => {
//       //判断错误码
//       //response的数据存在 response.body.data里面
//       if (response.body.errno == 0) {
//         //Object.assign() 方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
//         //复制的不是指针，是值，所以源对象更改之后不会影响复制之后的
//         //赋值的时候必须要想清楚需要的是什么值，就取什么值给对应的变量
//         this.seller = Object.assign({}, this.seller, response.body.data)
//       }
//     })
//   },
//   components: {
//     'v-header': header,
//   },
// }
</script>

<style lang='stylus' rel='stylesheet/stylus'>
@import './common/stylus/mixin.styl';

#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex: 1;
      text-align: center;

      & > a {
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);

        &.active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
}
</style>
