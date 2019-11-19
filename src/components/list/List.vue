<template>
  <div class='list'>
      <slot name="list"></slot>
  </div>
</template>

<script>
export default {
  name: 'list',
  data(){
    return {
      offset: 300, // 滚动条与底部的距离小于300，触发load事件
      loadingText: "加载中...",
      immediateCheck: true,	 //是否在初始化时立即执行滚动位置检查
      direction: "down" // 滚动触发加载的方向，可选值为up
    }
  },
  props: {
    // 是否加载完成
    finished: {
      type: Boolean,
      default: true
    },
    // 加载完成的文本显示
    finishedText: String
  },
  created(){
  
  },
  mounted(){
  
  },
  computed: {
  
  },
  methods: {
    getList () {
      this.$emit("load", "触发了load加载事件");
    }
  }
}
</script>
<style lang='less' scoped>
  
</style>