<template>
  <div class="star" :class='starType'>
    <span v-for='(itemClass,index) in itemClasses' :class='itemClass' key="index" class='star-item'></span>
  </div>
</template>

<script>
  const LENGTH = 5;         //总共有多少个星星
  const CLS_ON = 'on';      //满星星
  const CLS_HALF = 'half';  //半星星
  const CLS_OFF = 'off';    //空星星
  export default {
    name: 'star',
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType(){
        return 'star-' + this.size;
      },
      itemClasses(){
        let result = [];
        /*向下取0.5倍的的方法 */
        //算出有多少个星星，包括半星
        let score = Math.floor(this.score * 2) / 2;
        //通过判断score模1来判断是不是有小数,为true表示有小数
        let hasDecimal = score % 1 !== 0
        //在通过地板函数来取得有多个是满星星的
        let integer = Math.floor(score)
        //往class数组里添加满星星的class
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON)
        }
        //在来判断是否有半颗星星的，有的话就添加进class数组
        if (hasDecimal) {
          result.push(CLS_HALF)
        }
        //最后如果数组长度不足我们规定的长度的话，就往里面放空星星的class
        while (result.length < LENGTH) {
          result.push(CLS_OFF)
        }
        return result
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='stylus' rel='stylesheet/stylus'>
  @import "../../common/stylus/mixin.styl"
  .star
    font-size: 0
    .star-item
      display: inline-block
      background-repeat: no-repeat
    &.star-48
      .star-item
        width: 20px
        height: 20px
        margin-right: 22px
        background-size: cover
        &:last-child
          margin-right: 0
        &.on
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width: 15px
        height: 15px
        margin-right: 6px
        background-size: cover
        &:last-child
          margin-right: 0
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width: 10px
        height: 10px
        margin-right: 3px
        background-size: cover
        &:last-child
          margin-right: 0
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')

</style>
