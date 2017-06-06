<template>
  <div>
    <transition name='move'>
      <div class="food" v-show="showFlag" ref="food">
        <div class="food-content">
          <div class="img-header">
            <img :src="food.image" alt="">
            <div class="back" @click='hide'>
              <i class="icon-arrow_lift"></i>
            </div>
          </div>
          <div class="content">
            <h1 class="title">{{food.name}}</h1>
            <div class="detail">
              <span class="sell-count">月售{{food.sellCount}}</span>
              <span class="rating">好评率{{food.rating}}%</span>
            </div>
            <div class="price">
              <span class='now'>￥{{food.price}}</span>
              <span v-show='food.oldPrice' class='old'>￥{{food.oldPrice}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food='food' @add='addFood'></cartcontrol>
            </div>
            <transition name='fade'>
              <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent='addFirst'>
                加入购物车
              </div>
            </transition>
          </div>
          <split v-show="food.info"></split>
          <div class="info" v-show="food.info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{food.info}}</p>
          </div>
          <split></split>
          <div class="rating">
            <h1 class="title">商品评价</h1>
            <ratingselect :select-type='selectType' :only-content='onlyContent' :desc='desc' :ratings='food.ratings' @select="selectRating" @toggle="toggleContent"></ratingselect>
            <div class="rating-wrapper">
              <ul v-show="food.ratings && food.ratings.length">
                <li v-for="rating in food.ratings" class="rating-item" v-show='needShow(rating.rateType,rating.text)'>
                  <div class="user">
                    <span class="name">{{rating.username}}</span>
                    <img :src="rating.avatar" alt="" class="avatar" width="12" height="12">
                  </div>
                  <div class="time">{{rating.rateTime|formatDate}}</div>
                  <p class="text">
                    <span :class="{'icon-thumb_up' : rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                  </p>
                </li>
              </ul>
              <!--此处v-show一定是用 || 来判断因为 如果&&判断且food.ratings并不存在  food.ratings为false 取反之后就是 true 。 && 是需要判断了两边才能计算出最终的结果，所以还会去计算右边的表达式，那么就是 undefined.length 就会报错，因为undefined并没有length属性-->
              <div class="on-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import BScroll from 'better-scroll'
import Vue from 'vue'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
import {formatDate} from 'common/js/date'
//为什么是花括号？因为export 的是一个function 

const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
  name: 'food',
  props: {
    food: {
      type: Object,
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show() {
      this.selectType = ALL
      this.onlyContent = true
      this.showFlag = true
      //只有在 $nextTick之后才能保证dom是被渲染了的
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide() {
      this.showFlag = false
    },
    addFirst(event) {
      if (!event._constructed) {
        return
      }
      this.$emit('add', event.target)
      Vue.set(this.food, 'count', 1)
    },
    addFood(target) {
      this.$emit('add', target)
    },
    selectRating(type) {
      this.selectType = type
      this.$nextTick(() => this.scroll.refresh())
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => this.scroll.refresh())
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  components: {
    cartcontrol, split, ratingselect
  },
  filters: {
    formatDate(time){
      let date = new Date(time)
      return formatDate(date,'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/stylus/mixin.styl"
  .food
    position fixed
    left 0
    top 0
    /*为什么要bottom？因为底部是留给购物车组件显示的，购物车组件高是48px*/
    bottom 48px
    // z-index -20
    // width 100vw
    background-color #fff
    transform translate3d(0,0,0)
    &.move-enter-active,&.move-leave-active
      transition all 0.5s linear
    &.move-enter,&.move-leave-active
      transform translate3d(100%,0,0)
    .img-header
      position relative
      width 100%
      height 0
      padding-bottom 100%
      /*padding设置百分比就是按照盒子的宽来计算的，所以此处设置100%的padding就会得到一个宽高相等的容器*/
      img
        position absolute
        top 0
        left 0
        height 100%
        width 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px
          font-style 20px
          color #fff
    .content
      padding 18px
      position relative
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        font-size 0
        margin-bottom 18px
        line-height 10px
        height 10px
        .sell-count,.rating
          font-size 10px
          color rgb(147,153,159)  
        .sell-count
          margin-right 12px
      .price
        font-weight: 700
        line-height: 24px
        .now
          margin-right: 18px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px
      .buy
        position absolute
        right 18px
        bottom 18px
        z-index 30
        height 24px
        line-height 24px
        padding 0 12px
        box-sizing border-box
        font-size 10px
        border-radius 12px
        color #fff
        background-color rgb(0,160,220)
        opacity 1
        &.fade-enter-active,&.fade-leave-active
          transition all 0.5s 
        &.fade-enter,&.fade-leave-active
          opacity 0  
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
      .text
        font-size 12px
        font-weight 200
        color rgb(77,85,93)  
        line-height 24px
        margin 0 8px
    .ratings
      padding-top 18px
      .title
        margin-left 18px      
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            right 0
            top 16px
            font-size 0
            line-height 12px
            .name
              display inline-block
              vertical-align top
              font-size 10px
              color rgb(147,153,159)
              margin-right 6px
            .avatar
              border-radius 50%
          .time
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up, .icon-thumb_down
              margin-right 4px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down  
              color rgb(147,153,159)
        .on-ratings
          padding 16px 0
          font-size 12px
          color rgb(147,153,159)




</style>