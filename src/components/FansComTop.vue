<template>
    <div class="fans-top flex">
        <dyd-header class="my-fans-header" bgColor="#fdc553" positionTop :title="midObj.header_title" v-if="browserEnv == 'android'">
            <span class="iconfont icon-left-arrows" slot="left" @click="goBack"></span>
        </dyd-header>
        <div class="line" v-if="browserEnv == 'android'"></div>
        <div class="top-bg" :class="typeName == 'myfans' ? 'my-fans-topbg' : 'new-fans-topbg'">
            <div class="top-bg-box flex">
                <p class="fans-title-text">{{midObj.min_title}}</p>
                <p class="fans-num">{{midObj.fans_num}}</p>
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderTop1 from "./HeaderTop1";
import Bridge from "../api/bridgeManager";
import { BridgeCmd } from "../api/globalConst";
import Global from "../api/global";
export default {
    name: "fans",
    data() {
        return {
            browserEnv: Global.browserEnv,
        };
    },
    components: {
        "dyd-header": HeaderTop1
    },
    props: {
        dataObj: {
            type: Object,
            default: {}
        },
        typeName: String
    },
    created() {
        console.log("browserEnv:",this.browserEnv);
    },
    mounted() {
        // console.log("粉丝页公共top组件");
        Bridge.RegisterBridge(BridgeCmd.RECEIVEBACK, (data, responseCallback) => {
            this.$toast({
                msg: "调用原生返回键成功",
                timeout: 1500
            })
            this.$router.go(-1);
        })
    },
    computed: {
        midObj () {
            // console.log(this.dataObj);
            return this.dataObj;
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
    }
};
</script>
<style lang='less' scoped>
.fans-top {
    flex-direction: column;
    .my-fans-header {
        .icon-left-arrows {
            display: inline-block;
            width: 0.18rem;
            height: 0.32rem;
            background: url("../assets/image/icon-fans-left-arrows.png")
                no-repeat center center;
            background-size: cover;
            margin-left: 0.2rem;
        }
    }
    .line {
        width: 100%;
        height: 1.28rem;
    }
    .my-fans-topbg {
        height: 3.72rem;
        background: url("../assets/image/image-my-fans-bg2.png") no-repeat center
            center;
        background-size: cover;
    }
    .new-fans-topbg {
        height: 2.72rem;
        background: url("../assets/image/image-new-fans-bg2.png") no-repeat center
            center;
        background-size: cover;
    }
    .top-bg {
        width: 100%;
        padding-top: .2rem;
        .top-bg-box {
            flex-direction: column;
            align-items: center;
            color: #000;
            .fans-title-text {
                font-size: 0.32rem;
                line-height: 0.4rem;
                margin-bottom: 0.2rem;
            }
            .fans-num {
                font-size: 1rem;
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
        }
    }
    .main {
        // flex: 1;
        height: 20rem;
        background: #ccc;
    }
}
</style>