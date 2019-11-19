<template>
    <header class="header">
        <div class="line"></div>
        <div class="header-box flex">
            <div class="header-box-left flex">
                <slot name="left"></slot>
            </div>
            <div class="header-box-title flex">
                <span class="header-box-title__text">{{title}}</span>
            </div>
            <div class="header-box-right flex">
                <slot name="right"></slot>
            </div>
        </div>
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
    .line {
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
            top: .4rem;
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
}
</style>