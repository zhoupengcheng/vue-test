<template>
    <!-- 消息提示框 -->
    <div class="toast flex" :style="{ width: widthNum }" v-if="show">
        <p>{{ msg }}</p>
    </div>
</template>

<script>
import { getLen } from "../../tools";
export default {
    name: "toast",
    data() {
        return {
            show: false,
            msg: "",
            timeout: 1500
        };
    },
    computed: {
        widthNum() {
            return 0.14 * getLen(this.msg) + 0.3 + "rem";
        }
    },
    components: {},
    created() {},
    mounted() {
        // console.log("创建了一个toast组件");
    },
    methods: {

    }
};
</script>
<style lang='less' scoped>
.toast {
    background: rgba(0, 0, 0, 0.55);
    position: fixed;
    bottom: 0.6rem;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 9999;
    justify-content: center;
    align-items: center;
    font-size: 0.24rem;
    color: #ffffff;
    border-radius: 0.08rem;
    padding: 0.16rem 0;
    p {
    }
}
</style>