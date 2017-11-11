<template>
  <div class='goods'>
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for='(item,index) in goods' class='menu-item' :key="index" :class="{'current':currentIndex==index}" @click='selectMenu(index,$event)'>
          <span class='text border-1px'>
            <span v-show='item.type > 0 ' class='icon' :class='classMap[item.type]'></span> {{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref='foodsWrapper'>
      <ul>
        <li v-for='item in goods' class='food-list' ref='foodList' :key="item.name">
          <h1 class='title'>{{ item.name }}</h1>
          <ul>
            <li v-for='(food,i) in item.foods' class='food-item border-1px' :key="i" @click='selectFood(food,$event)'>
              <div class='icon'>
                <img width='57' height='57' :src="food.icon" alt="">
              </div>
              <div class='content'>
                <h2 class='name'>{{food.name}}</h2>
                <p class='desc'>{{food.description}}</p>
                <div class="extra">
                  <span class='count'>月售{{food.sellCount}}</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class='now'>￥{{food.price}}</span>
                  <span v-show='food.oldPrice' class='old'>￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol @add='addFood' :food='food'></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :min-price='seller.minPrice' :delivery-price='seller.deliveryPrice' :select-foods='selectFoods'></shopcart>
    <food :food='selectedFood' ref="food" @add='addFood'></food>
  </div>
</template>

<script lang='ts'>
import BScroll from 'better-scroll'
import shopcart from 'components/shopcart/shopcart'
import cartcontrol from 'components/cartcontrol/cartcontrol'
import food from 'components/food/food'
import Vue from 'vue'
export default Vue.extend({
  name: 'goods',
  props: {
    seller: {
      type: Object,
    },
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {},
    }
  },
  methods: {
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        //为什么要传click:true是因为BScroll在监听一些时间的时候会阻止默认的事件，这里传参数是为了这个默认的click的点击事件生效
        click: true,
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        //参数:1 滚动的时候会派发scroll事件，会截流。2滚动的时候实时派发scroll事件，不会截流。 3除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
        probeType: 3,
      })
      //可以监听一个事件scroll，有一个回调 回调有一个pos 里面pos.y就是实时的滚动y的值
      this.foodsScroll.on('scroll', pos => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight() {
      let foodList = this.$refs.foodList
      let height = 0
      //为什么要push第一个height，因为初始位置的高就是0，也就是第一个各自显示的时候就是0，到第二个高度的时候才是下一个格子高亮
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        //clientHeight 可以通过 CSS height + CSS padding - 水平滚动条高度 (如果存在)来计算.
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    //为什么要传event 是因为BScroll在移动端是阻止了默认的事件，但是在pc端并没有阻止默认的事件，在配置的时候传的click:true，相当于是BScroll在派发了一个点击事件，所以如果是pc端浏览的话会触发两次回调事件，为了消除这个影响，我们把$event传进来 判断  $event是让vue可以访问原声的dom事件
    selectMenu(index, event) {
      if (!event._constructed) {
        return
      }
      let foodList = this.$refs.foodList
      let el = foodList[index]
      this.foodsScroll.scrollToElement(el, 300)
    },
    addFood(target) {
      this._dtop(target)
    },
    _dtop(target) {
      //体验优化，异步执行下落动画
      this.$nextTick(() => {
        //访问子组件，并调用子组件的方法drop并把target传入
        this.$refs.shopcart.drop(target)
      })
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      //通过this.$refs访问子组件并在点下去调用子组件的方法
      this.$refs.food.show()
    },
  },
  computed: {
    //表示当前左侧的索引
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        //获得当前的高度，和下一个高度，然后在判断实时滚动的y值是否在当前的区间
        //当然这也有个缺点，就是当i遍历到最length—1的时候 this.listHeight[i+1]就是undefined
        //所有当他为undefined的时候取反 然后直接返回 i的值就行了
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      //什么时候返回0？ 就是当高度数据为空的时候
      return 0
    },
    selectFoods() {
      //判断是否已经有数据
      if (this.goods[0]) {
        let foods = []
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if (food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },
  },
  components: {
    shopcart,
    cartcontrol,
    food,
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    //因为在dev-server.js中定义了获取数据的接口，所以这里可以省略路径的写法
    this.$http.get('/api/goods').then(response => {
      //判断错误码
      //response的数据存在 response.body.data里面
      if (response.body.errno == 0) {
        //Object.assign() 方法用于将所有可枚举的属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
        //复制的不是指针，是值，所以源对象更改之后不会影响复制之后的
        //赋值的时候必须要想清楚需要的是什么值，就取什么值给对应的变量
        this.goods = response.body.data
        //即使数据更新了，但是vue更新dom是异步的，所以要通过钩子函数来确保BScroll获取的dom高度是vue更新dom之后的高度，需要通过一个钩子函数来确定，
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
})
</script>


<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      display: table;
      height: 54px;
      width: 56px;
      padding: 0 12px;
      line-height: 14px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        vertical-align: top;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('decrease_3');
        }

        &.discount {
          bg-image('discount_3');
        }

        &.guarantee {
          bg-image('guarantee_3');
        }

        &.invoice {
          bg-image('invoice_3');
        }

        &.special {
          bg-image('special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      padding-bottom: 18px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          line-height: 12px;
          margin-bottom: 8px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>
