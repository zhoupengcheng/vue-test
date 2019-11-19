<template>
    <!-- 选择器 -->
    <div class="dyd-picker">
        <div class="dyd-picker__columns">
            <div class="dyd-picker-column"></div>
            <div class="dyd-picker__mask"></div>
            <div class="van-hairline-unset--top-bottom van-picker__frame"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "picker",
    data() {
        return {};
    },
    components: {},
    created() {},
    mounted() {},
    computed: {},
    methods: {}
};
</script>
<style lang='less' scoped>
.van-picker-column {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    overflow: hidden;
    font-size: 16px;
    text-align: center;
}
.van-picker__frame {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 3;
    width: 100%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
    pointer-events: none;
}
.van-picker__mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-image: -webkit-linear-gradient(top, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4)), -webkit-linear-gradient(bottom, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4));
    // background-image: linear-gradient(180deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4)), linear-gradient(0deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4));
    background-repeat: no-repeat;
    background-position: top, bottom;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    pointer-events: none;
}
</style>