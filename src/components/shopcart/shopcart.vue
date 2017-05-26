<template>
  <div>
    <transition name='fade'>
      <div class="list-mask" v-show="listShow" @click='hideList'></div>
    </transition>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click='toggleList'>
          <div class="logo-wrapper">
            <div class="logo" :class='{highlight: totalCount > 0}'>
              <i class='icon-shopping_cart' :class='{highlight: totalCount > 0}'></i>
            </div>
            <div class="num" v-show='totalCount > 0'>
              {{totalCount}}
            </div>
          </div>
          <div class="price" :class='{highlight: totalCount > 0}'>￥{{totalPrice}}</div>
          <div class="desc">另需要配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click='pay'>
          <div class="pay" :class='payClass'>
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="ball in balls">
          <transition name="drop" @before-enter='beforeDrop' @enter='dropping' @after-enter='afterDrop'>
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name='fold'>
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click='empty'>清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{ food.name }}</span>
                <div class="price">
                  <span>￥{{ food.price * food.count }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food='food'></cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
  import cartcontrol from 'components/cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'
  export default {
    name: 'shopcart',
    props: {
      selectFoods: {
        type: Array,
        default () {
          return []
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [{
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }, {
          show: false
        }],
        dropBalls: [],
        fold: true
      }
    },
    computed: {
      //计算总价
      totalPrice() {
        let total = 0
        this.selectFoods.forEach((food) => {
          total += food.price * food.count
        })
        return total
      },
      totalCount() {
        let count = 0
        this.selectFoods.forEach(food => {
          count += food.count
        })
        return count
      },
      //右下角结算部分
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice
          return `还差￥${diff}元起送`
        } else {
          return `去结算`
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough'
        } else {
          return `enough`
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        //为什么在这里做BScroll的初始化，因为只有当列表内有内容才会触发BScroll
        if (show) {
          this.$nextTick(() => {
            //因为show是不断在变化的，难道每一次变化show就重新new一个BScroll吗？ 不是的 我们要判断一下是否有BScroll，有的话就利用BScroll提供的refresh这个借口重新渲染一下
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh()
            }
          })
        }
  
        return show
      }
    },
    methods: {
      addFood(target) {
        this.drop(target);
      },
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeDrop(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.transform = `translate3d(0,${y}px,0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.transform = `translate3d(${x}px,0,0)`
          }
        }
      },
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      toggleList() {
        //判断如果购物车没有东西，点击是不会生效的
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      empty() {
        // this.selectFoods.forEach(food=>{
        //   food.count = 0 
        // })
        this.selectFoods.map(food => {
          food.count = 0
        })
      },
      hideList() {
        this.fold = true
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return
        }
        alert(`需要支付${this.totalPrice + this.deliveryPrice}元`)
      }
    },
    components: {
      cartcontrol,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' rel='stylesheet/stylus'>
@import '../../common/stylus/mixin.styl'
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            vertical-align: top
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background-color: rgb(0, 160, 220)
            .icon-shopping_cart
              font-size: 24px
              color: #80858a
              line-height: 44px
              &.highlight
                color: #FFFFFF
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            background-color: rgb(240, 20, 20)
            color: #FFFFFF
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price, .desc
          display: inline-block
          vertical-align: top
          font-size: 16px
          color: rgba(255, 255, 255, .4)
          font-weight: 700
          line-height: 24px
          margin-top: 12px
          box-sizing: border-box
          padding-right: 12px
          border-right: 1px solid rgba(255, 255, 255, .1)
        .price.highlight
          color: #FFFFFF
        .desc
          margin-left: 12px
          border: none
          font-weight: 400
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          color: rgba(255, 255, 255, .4)
          font-weight: 700
          background-color: #2b333b
          &.not-enough
            background-color: #2b333b
          &.enough
            background-color: #00b43c
            color: #FFFFFF
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width 16px
          height 16px
          border-radius 50%
          background rgb(0,160,220)
          transition all 0.4s linear
    .shopcart-list
      position absolute
      top 0
      left 0
      z-index -1
      width 100%
      /*y轴偏移100% 就是针对不定高的元素但是要全部隐藏所以用100%来代替*/
      transform translate3d(0,-100%,0)
      &.fold-enter-active,&.fold-leave-active
        transition all 0.5s
      &.fold-enter,&.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background-color #f3f5f7
        border-bottom 1px solid rgba(7,17,27,0.1)
        .title
          float left
          font-size 14px
          font-weight 200
          color rgb(7,17,27)
          line-height 40px
        .empty
          float right
          font-style 12px
          color rgb(0,160,220)  
      .list-content
        padding 0 18px
        max-height 217px
        background-color #fff
        overflow hidden
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height 24px
            font-size 14px
            color rgb(7,17,27)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-style 14px
            color rgb(240,20,20)
            font-weight 700
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  .list-mask
    position fixed
    top 0
    left 0
    width 100vw
    height 100vh
    background rgba(7,17,27,0.6)
    backdrop-filter: blur(10px)
    opacity 1
    &.fade-enter-active,&.fade-leave-active
      transition all 0.5s 
    &.fade-enter,&.fade-leave-active
      opacity 0
      background rgba(7,17,27,0)
    






</style>
