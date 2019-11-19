<template>
  <div class='no-data flex'>
      <span class="icon-no-data"></span>
      <div class="title-box">
        <p>{{oneTitle}}</p>
        <p>{{twoTitle}}</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'nodata',
  data(){
    return {}
  },
  props: {
    oneTitle: String,
    twoTitle: String
  },
  mounted(){
  
  }
}
</script>
<style lang='less' scoped>
.no-data {
    width: 100%;
    justify-content: center;
    position: relative;
    .icon-no-data {
        width: 4.8rem;
        height: 4.8rem;
        background: url("../../assets/image/icon-no-data.png") no-repeat center center;
        background-size: cover;
    }
    .title-box {
      position: absolute;
      bottom: 0;
      font-size: .24rem;
      color: #666;
      p:first-child {
        text-align: center;
        color: #333;
        line-height: .32rem;
      }
    }
}
</style>