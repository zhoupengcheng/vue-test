<template>
    <!-- loading组件 -->
    <div class="loading-weixin flex" v-if="env == 'weixin'">
        <div class="weixin-box flex">
            <dyd-load-ani :bgType="env == 'weixin' ? 1 : 2"></dyd-load-ani>
            <p>加载中...</p>
        </div>
    </div>
    <div class="loading-other flex" v-else>
        <div class="other-box flex">
            <dyd-load-ani :bgType="env == 'weixin' ? 1 : 2"></dyd-load-ani>
            <p>正在加载...</p>
        </div>
    </div>
</template>

<script>
import Global from "../api/global.js";
import LoadAni from "./LoadAni.vue";
export default {
    name: "loading",
    data() {
        return {};
    },
    props: {
        env: {
            type: String,
            default: ""
        }
    },
    components: {
        'dyd-load-ani': LoadAni
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {}
};
</script>
<style lang='less' scoped>
.loading-weixin {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    justify-content: center;
    align-items: center;
}
.weixin-box {
    width: 2rem;
    height: 2rem;
    background: rgba(0, 0, 0, 0.6);
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    border-radius: 0.08rem;
    p {
        font-size: 0.24rem;
        color: #ffffff;
        line-height: 0.8rem;
        padding-top: 0.16rem;
    }
}
.loading-other {
    justify-content: center;
    align-items: center;
}
.other-box {
    height: 1rem;
    justify-content: center;
    align-items: center;
    font-size: 0.28rem;
    color: #666;
    p {
        padding-left: 0.36rem;
    }
}
</style>