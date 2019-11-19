<template>
    <header class="header">
        <div class="wrap" :class="positionTop ? 'fixed' : ''" :style="{'background': bgColor}">
            <div class="page-header"></div>
            <div class="header-box flex">
                <div class="header-box-left flex">
                    <slot name="left"></slot>
                </div>
                <span class="header-box-title flex">
                    <span class="header-box-title__text">{{title}}</span>
                </span>
                <div class="header-box-right flex">
                    <slot name="right"></slot>
                </div>
            </div>
        </div>
        <!-- <div class="line" v-if="positionTop"></div> -->
    </header>
</template>

<script>
export default {
    name: "headertop",
    data() {
        return {};
    },
    props: {
        title: {
            type: String,
            default: ""
        },
        // 是否定位在顶部
        positionTop: Boolean,
        bgColor: {
            type: String,
            default: "#FFF"
        }
    },
    components: {},
    created() {},
    mounted() {},
    computed: {
        leftIcon() {}
    },
    methods: {}
};
</script>
<style lang='less' scoped>
.header {
    .page-header {
        width: 100%;
        height: 0.4rem;
    }
    .header-box {
        width: 100%;
        height: 0.88rem;
        justify-content: space-between;
        align-items: center;
        line-height: 0.88rem;
        .header-box-title {
            position: absolute;
            top: 0.4rem;
            left: 0;
            right: 0;
            z-index: 998;
            justify-content: center;
            align-items: center;
            .header-box-title__text {
                font-size: 0.32rem;
                color: #000000;
                text-align: center;
            }
        }
        .header-box-left {
            height: 0.88rem;
            z-index: 999;
            align-items: center;
        }
        .header-box-right {
            height: 0.88rem;
            z-index: 999;
            align-items: center;
        }
    }
    .fixed {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 900;
        width: 100%;
    }
    // .line {
    //     width: 100%;
    //     height: 1.28rem;
    // }
}
</style>