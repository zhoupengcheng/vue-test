<template>
    <div class="item-box">
        <div class="item" v-for="(item, idx) in list" :key="idx">
            <div class="item-time">
                <p>
                    <span>{{item.add_time*1000 | time(2)}}</span>
                    <span>{{item.add_time*1000 | time(3)}}下单</span>
                </p>
            </div>
            <div class="item-content flex">
                <div class="item-content-left">
                    <img :src="item.card_img" alt />
                </div>
                <div class="item-content-right flex">
                    <p class="item-name">{{item.card_name}}</p>
                    <p>
                        <span>支付金额:</span>
                        <span class="item-price">{{item.order_price}}</span>
                    </p>
                    <p>
                        <span>获得积分:</span>
                        <span class="item-integral">{{item.commisson_money}}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $com from "../api/event_bus";
export default {
    name: "list-com",
    data() {
        return {};
    },
    components: {},
    created() {
        $com.$on("loaded", data => {
            console.log(data);
        });
        $com.$on("finished", data => {
            console.log(data);
        });
    },
    props: {
        list: {
            type: Array,
            default: []
        }
    },
    mounted() {
        this.scroll();
    },
    computed: {},
    methods: {
        scroll() {
            window.document.addEventListener(
                "scroll",
                this.handlerScroll,
                true
            ); // 监听滚动事件
        },
        handlerScroll($event) {
            console.log($event);
            let sTop = $event.target.scrollTop; // 滑动的距离
            let cHei = $event.target.clientHeight; // 窗口可视高度
            let sHei = $event.target.scrollHeight; // 总的list高度
            console.log(sTop, cHei, sHei);
            // this.sPoints.push(sTop);
            // // console.log(sTop,cHei,sHei);
            // let cha =
            //     this.sPoints[this.sPoints.length - 1] -
            //     this.sPoints[this.sPoints.length - 2];
            // // console.log("sPoints",this.sPoints,"cha",cha);
            // this.direction = cha > 0 ? "up" : "down";
            // // console.log(this.direction);
            // if (
            //     this.direction == "up" &&
            //     sTop + cHei == sHei
            // ) {
            //     this.isLoading = true;
            //     setTimeout(() => {
            //         this.getData();
            //     }, 300);
            // }
            // this.isSlideBottom = sTop + cHei == sHei ? true : false;
        }
    }
};
</script>
<style lang='less' scoped>
.item-box {
    .item {
        margin-bottom: 0.2rem;
        padding-left: 0.24rem;
        background: #ffffff;
        .item-time {
            font-size: 0.24rem;
            color: #999999;
            border-bottom: 0.01rem solid #e0e0e0;
            line-height: 0.74rem;
            p {
                span:first-child {
                    padding-right: 0.36rem;
                }
            }
        }
        .item-content {
            padding: 0.16rem 0 0.28rem 0;
            .item-content-left {
                margin-right: 0.2rem;
                img {
                    display: block;
                    width: 1.4rem;
                    height: 1.4rem;
                }
            }
            .item-content-right {
                height: 1.4rem;
                flex-direction: column;
                justify-content: space-between;
                p {
                    font-size: 0.24rem;
                    color: #999999;
                    line-height: 0.34rem;
                    .item-integral {
                        color: #fd2a32;
                    }
                    span:first-child {
                        margin-right: 0.1rem;
                    }
                }
                .item-name {
                    font-size: 0.28rem;
                    color: #312c30;
                    line-height: 0.4rem;
                }
            }
        }
    }
}
</style>