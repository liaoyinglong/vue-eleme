<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img width="64" height='64' :src='seller.avatar' alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class='brand'></span>
          <span class='name'>{{ seller.name }}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!--为什么要v-if 是因为数据是通过ajax异步请求过来的，header组件开始渲染并且父组件传递过来数据seller的时候，seller的数据还没有被ajax异步请求回来，会导致控制台报错，所以用一个v-if来判断是否请求回来了数据。-->
        <div v-if='seller.supports' class='support'>
          <span class='icon' :class='classMap[seller.supports[0].type]'></span>
          <span class='text'>{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div v-if='seller.supports' @click='showDetail' class='support-count'>
        <span class='count'>{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click='showDetail'>
      <span class='bulletin-title'></span><span class='bulletin-text'>{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width='100%' height='100%'>
    </div>
    <transition name='fade'>
      <div v-show='detailShow' class="detail">
        <!--sticky footer布局 外面两个div一个是容器一个是关闭按钮 容器里面还有一个div才是真正放内容的-->
        <div class="clearfix detail-wrapper">
          <div class="detail-main">
            <h1 class='name'>{{ seller.name }}</h1>
            <div class="star-wrapper">
              <star :size='48' :score='seller.score'></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if='seller.supports' class='supports'>
              <li class='support-item' v-for='(item,index) in seller.supports'>
                <span class='icon' :class='classMap[seller.supports[index].type]'></span>
                <span class='text'>{{ seller.supports[index].description }}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class='content'>{{ seller.bulletin }}</p>
            </div>
          </div>
        </div>
        <div class="detail-close" @click='hideDetail'>
          <i class='icon-close'></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  //小星星组件
  import star from 'components/star/star'
  export default {
    name: 'header',
    data(){
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail(){
        this.detailShow = true
      },
      hideDetail(){
        this.detailShow = false
      }
    },
    props: {
      seller: {
        type: Object
      }
    },
    //在组件渲染之前先建立一个classMap来动态显示对于的class
    created(){
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    components: {
      star,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/stylus/mixin.styl"
  .header
    position: relative
    color: #fff
    background-color: rgba(7, 17, 27, .5)
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      /*设置父元素font-size为0可以消除空白层，从而减少浮动的使用*/
      font-size 0
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        /*由于会继承父元素的font-size所以要从新设置字体大小*/
        font-size: 14px
        .title
          margin: 2px 0 8px
          .brand
            display: inline-block
            /*为了使对齐*/
            vertical-align: top
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
          .name
            margin-left: 6px
            font-size: 16px
            font-weight: bold
            line-height: 18px

        .description
          margin-bottom: 10px
          line-height: 12px
          font-size: 12px
        .support
          .icon
            display: inline-block
            vertical-align: top
            width: 12px
            height: 12px
            margin-right: 4px
            background-size: 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.guarantee
              bg-image('guarantee_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
          .text
            line-height: 12px
            font-size: 10px
      .support-count
        position: absolute
        right: 12px
        bottom: 15px
        padding: 0 8px
        height: 24px
        line-height: 24px
        border-radius: 14px
        background-color: rgba(0, 0, 0, 0.2)
        text-align: center
        .count
          vertical-align: baseline
          font-size: 10px
        .icon-keyboard_arrow_right
          line-height: 24px
          margin-left: 2px
          font-size: 10px
    .bulletin-wrapper
      position: relative
      line-height: 28px
      height: 28px
      padding: 0 22px 0 12px
      /*让超出文字不折行*/
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      background: rgba(7, 17, 27, 0.2)
      .bulletin-title
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        background-repeat: no-repeat
        bg-image('bulletin')
        background-size: cover
      .bulletin-text
        vertical-align: top
        font-size: 10px
        margin: 0 4px
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        right: 12px
        top: 8px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      /*模糊效果*/
      filter: blur(10px)
      overflow: hidden
    .detail
      position: fixed
      top: 0
      left: 0
      z-index: 100
      width: 100%
      height: 100%
      overflow: auto
      opacity: 1
      background: rgba(7, 17, 27, 0.8)
      //只有在ios设备上才能看到这个模糊的效果
      backdrop-filter: blur(10px)
      &.fade-enter-active, &.fade-leave-active
        transition: all 1s
      &.fade-enter, &.fade-leave-active
        opacity: 0
        background: rgba(7, 17, 27, 0)
      .detail-wrapper
        min-height: 100%
        min-width: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            line-height: 16px
            text-align: center
            font-style: 16px
            font-weight: 700
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px
            .line
              flex: 1
              position: relative
              top: -6px
              border-bottom 1px solid rgba(255, 255, 255, .2)
            .text
              padding: 0 12px
              font-size: 14px
              font-weight: 700
          .supports
            margin: 0 auto
            width: 80%
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              font-size: 0
              &:last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                vertical-align: top
                margin-right: 6px
                background-size: cover
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
              .text
                line-height: 16px
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              font-size: 12px
              font-weight: 200
              color: rgb(255, 255, 255)
              line-height: 24px
      .detail-close
        position: relative
        width: 32px
        height: 32px
        margin: -64px auto 0 auto
        clear: both
        font-size 34px

</style>
