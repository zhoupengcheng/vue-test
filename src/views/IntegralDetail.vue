<template>
    <!-- 
        2019-11-9
    -->
    <div class="integral-detail flex">
        <div class="integral-detail-top" v-if="browserEnv == 'android'">
            <dyd-header class="integral-header" title="积分明细">
                <span class="iconfont icon-left-arrows" slot="left" @click="goBack"></span>
            </dyd-header>
        </div>
        <div class="main">
            <div class="main-content flex">
                <div class="main-content-top">
                    <div class="flex">
                        <p>当前粉丝数量:</p>
                        <span>{{integralObj.fans_num}}人</span>
                    </div>
                    <div class="flex">
                        <p>累计获得积分:</p>
                        <span>{{integralObj.accumulated_points}}</span>
                    </div>
                </div>

                <div class="main-content-bottom" v-show="list.length > 0">
                    <div class="item" v-for="(item, idx) in integralObj.order_list" :key="idx">
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
                <!-- list没有数据 -->
                <dyd-no-data class="list-no-data" oneTitle="暂无数据" twoTitle="可以先去看看其它的了~" v-show="list.length == 0"></dyd-no-data>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderTop from "@/components/HeaderTop";
import Http from "../net/http";
import Global from "../api/global";
import Bridge from "../api/bridgeManager";
import { BridgeCmd } from "../api/globalConst";
export default {
    name: "integral-detail",
    data() {
        return {
            browserEnv: Global.browserEnv,
            pageNum: 0,
            pageSize: 6,
            integralObj: {},
            list: [],

            startY: 0, // 滑动前开始距离
            direction: "", // 滑动方向
            sPoints: [], // scroll滚动点集合
            isNoData: false, // 是否没有更多数据了
            isSlideBottom: false // 是否滑到底部
        };
    },
    components: {
        "dyd-header": HeaderTop
    },
    created() {
        let titleName = document.getElementsByTagName("title")[0];
        titleName.innerHTML = "积分明细";
        this.getData();
    },
    mounted() {
        Bridge.RegisterBridge(BridgeCmd.RECEIVEBACK, (data, responseCallback) => {
            this.$toast({
                msg: "调用原生返回键成功",
                timeout: 1500
            })
            this.$router.go(-1);
        })
    },
    computed: {},
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        regRollingEvent(len) {
            window.addEventListener("scroll", this.handleScrollEvent, true); // 监听滚动事件
            window.addEventListener("touchstart", this.startEvent, false);
            window.addEventListener("touchend", this.endEvent, false);
        },
        startEvent($event) {
            this.startY = $event.touches[0].pageY;
            // console.log("start:",this.startY);
        },
        endEvent($event) {
            let endY = $event.changedTouches[0].pageY;
            this.direction = endY - this.startY > 0 ? "down" : "up";
            
            if (
                this.direction == "up" &&
                this.isSlideBottom &&
                this.startY - endY > 50
            ) {
                this.$toast({
                    msg: "没有更多了",
                    timeout: 1500
                })
            }
        },
        handleScrollEvent($event) {
            let sTop = $event.target.scrollTop; // 滑动的距离
            let cHei = $event.target.clientHeight; // 窗口可视高度
            let sHei = $event.target.scrollHeight;
            this.sPoints.push(sTop);
            // console.log(sTop,cHei,sHei);
            let cha =
                this.sPoints[this.sPoints.length - 1] -
                this.sPoints[this.sPoints.length - 2];
            // console.log("sPoints",this.sPoints,"cha",cha);
            this.direction = cha > 0 ? "up" : "down";
            // console.log(this.direction);
            if (
                this.direction == "up" &&
                sTop + cHei == sHei 
            ) {
                this.isLoading = true;
                setTimeout(() => {
                    this.getData();
                }, 300);
            }
            this.isSlideBottom = sTop + cHei == sHei ? true : false;
        },
        getData() {
            // TODO 滑到底部下一页
            Http.send(
                {
                    api_name: "kyk.richLandlord.pointsList",
                    // uid: Global.userId,
                    first_row: this.pageNum,
                    fetch_num: this.pageSize
                },
                res => {
                    if (res.code == 0) {
                        let data = res.data.list;
                        console.log("integral-detail:", data);
                        // data = {
                        //     accumulated_points: "0.00",
                        //     fans_num: 3,
                        //     total_num: "0",
                        //     order_list: [
                        //         {
                        //             commisson_money: 10, //分销所得金额
                        //             order_price: 100, //订单金额
                        //             add_time: 1573315200, //下单时间
                        //             card_name: "6元卡", //卡的标题
                        //             card_img: "https://iph.href.lu/140x140" //卡的图片
                        //         }
                        //     ]
                        // };
                        this.integralObj = data;
                        this.list = !data.order_list || data.order_list.length == 0 ? [] : data.order_list;
                        console.log("list",this.list);
                    } else {
                        this.$toast({
                            msg: res.error_msg,
                            timeout: 1500
                        })
                    }
                }
            );
        }
    }
};
</script>
<style lang='less' scoped>
.integral-detail {
    width: 100%;
    height: 100%;
    background: #efeff3;
    flex-direction: column;
    justify-content: space-between;
    .popout-tip {
        background: rgba(0, 0, 0, 0.55);
        position: absolute;
        bottom: .6rem;
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 9999;
        justify-content: center;
        align-items: center;
        font-size: .24rem;
        color: #ffffff;
        border-radius: .08rem;
        padding: .16rem 0;
        p {
        }
    }
    .integral-detail-top {
        .integral-header {
            background: #ffffff;
            .icon-left-arrows {
                display: inline-block;
                width: .18rem;
                height: .32rem;
                background: url("../assets/image/icon-fans-left-arrows.png")
                    no-repeat center center;
                background-size: cover;
                margin-left: .2rem;
            }
        }
    }
    .main {
        flex: 1;
        padding-top: .2rem;
        background: #efeff3;
        padding-bottom: .2rem;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        .main-content {
            flex-direction: column;
            .main-content-top {
                background: #ffffff;
                padding: .32rem .2rem;
                margin-bottom: .2rem;
                div {
                    justify-content: space-between;
                    align-items: center;
                    line-height: .4rem;
                    p {
                        font-size: .28rem;
                        color: #333333;
                    }
                    span {
                        font-size: .24rem;
                        color: #999999;
                    }
                }
                div:first-child {
                    margin-bottom: .16rem;
                }
            }
            .main-content-bottom {
                .item {
                    margin-bottom: .2rem;
                    padding-left: .24rem;
                    background: #ffffff;
                    .item-time {
                        font-size: .24rem;
                        color: #999999;
                        border-bottom: .01rem solid #e0e0e0;
                        line-height: .74rem;
                        p {
                            span:first-child {
                                padding-right: .36rem;
                            }
                        }
                    }
                    .item-content {
                        padding: .16rem 0 .28rem 0;
                        .item-content-left {
                            margin-right: .2rem;
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
                                font-size: .24rem;
                                color: #999999;
                                line-height: .34rem;
                                .item-integral {
                                    color: #fd2a32;
                                }
                                span:first-child {
                                    margin-right: .1rem;
                                }
                            }
                            .item-name {
                                font-size: .28rem;
                                color: #312c30;
                                line-height: .4rem;
                            }
                        }
                    }
                }
            }
            .list-no-data {
                padding-top: 1.0rem;
            }
        }
    }
}
</style>