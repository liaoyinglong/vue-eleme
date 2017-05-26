<template>
  <div class="carcontrol">
    <transition name='move'>
      <div class="cart-decrease" v-show='food.count > 0' @click.stop=' decreaseCart '>
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show='food.count > 0'>{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop='addCart'></div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  props: {
    food: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    addCart(evevnt) {
      //因为引用了BScroll会导致pc端点击的时候BScroll会派发一个事件，所以用if判断来停止这个事件
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
        //为不存在的属性赋值，常规方式会是vue不能动态监测这个值，需要使用vue提供的一个接口来设置
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++
      }
      //派发一个事件叫做add
      this.$emit('add', event.target)
    },
    decreaseCart(event) {
      //同理阻止BScroll派发的点击事件
      if (!event._constructed) {
        return;
      }
      this.food.count--
    }
  },
  computed: {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' rel='stylesheet/stylus'>
  .carcontrol
    font-size: 0
    .cart-decrease
      display: inline-block
      /*为什么要加padding？为了UI美观设计的时候是没有那么大的，但是为了用户体验是用户能够更加方便的点到这些按钮，所以在不增大显示样式的情况下通过增加padding来增加用户可点击的区域*/
      padding: 6px
      opacity:1
      transition:all 0.4s linear
      /*为什么要用translate3d ？？因为这个属性可以给开启一个硬件加速效果，让动画更为流畅一点*/
      transform translate3d(0, 0, 0)
      .inner
        display inline-block
        line-height 24px
        font-size 24px
        color rgb(0,160,220)
        transition all 0.4s linear
        transform rotate(0)
      &.move-enter-active,&.move-leave-active
        transition all 0.4s linear
      &.move-enter,&.move-leave-active
        opacity 0
        transform: translate3d(24px, 0, 0)
        .inner
          transform: rotate(180deg)    
    .cart-count
      display: inline-block
      padding-top:6px
      font-size:10px
      line-height 24px
      text-align center
      vertical-align top
      color rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      font-size: 24px
      line-height: 24px
      color: rgb(0, 160, 220)
</style>
