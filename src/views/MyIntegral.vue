<template>
    <!-- 
        2019-11-8 
    -->
    <div class="my-integral">
        <div class="wrap">
            <div class="integral-top-bg"></div>
            <div class="integral-top" v-if="browserEnv == 'android'">
                <dyd-header title="我的积分">
                    <span class="iconfont icon-code icon-left-arrows" slot="left" @click="goBack"></span>
                    <span
                        class="iconfont icon-code icon-right-code"
                        slot="right"
                        @click="openQrcode"
                    ></span>
                </dyd-header>
            </div>
            <div class="line" v-if="browserEnv == 'android'"></div>
            <div class="integral-content">
                <div class="content-item userinfo">
                    <div class="userinfo-top flex">
                        <img :src="userinfoObj.user_icon" alt />
                        <p>{{userinfoObj.name}}</p>
                    </div>
                    <div class="userinfo-bottom flex">
                        <div class="flex" @click="openIntegralDetail">
                            <p>累计积分</p>
                            <span>{{totalIntegralObj.total_integral}}</span>
                            <div class="integral-detail-btn">明细</div>
                        </div>
                        <div class="flex" @click="openExtract">
                            <p>可兑换</p>
                            <span>{{totalIntegralObj.surplus_integral}}</span>
                        </div>
                    </div>
                </div>
                <!-- 月度积分、每日积分 -->
                <div
                    class="content-item integral-box"
                    v-for="(item,idx) in integralList"
                    :key="idx"
                >
                    <div class="integral-box-top">
                        <p>{{item.title}}</p>
                    </div>
                    <div class="integral-box-bottom flex">
                        <div class="today-integral-box flex">
                            <p>{{item.integral_item.curr_integral_text}}</p>
                            <span>{{item.integral_item.curr_integral}}</span>
                        </div>
                        <div class="yesterday-integral-box flex">
                            <p>{{item.integral_item.formerly_integral_text}}</p>
                            <span>{{item.integral_item.formerly_integral}}</span>
                        </div>
                    </div>
                </div>
                <!-- 积分页底部关联跳转选项 -->
                <ul class="content-item integral-relevance-link">
                    <li
                        class="item flex"
                        v-for="(item, idx) in isWeixin ? relevanceList.weixin : relevanceList.no_weixin"
                        :key="idx"
                        @click="goOtherPage(item.typeName)"
                    >
                        <p>{{item.text}}</p>
                        <span class="iconfont icon-right-arrows"></span>
                    </li>
                </ul>
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
import Native from "../api/native";
export default {
    name: "my-integral",
    data() {
        return {
            browserEnv: Global.browserEnv,
            userinfoObj: {},
            totalIntegralObj: {},
            integralList: [
                { title: "月度积分", integral_item: {} },
                { title: "每日积分", integral_item: {} }
            ],
            isWeixin: false,
            relevanceList: {
                weixin: [
                    { text: "我的粉丝", typeName: "my-fans" },
                    { text: "联系客服", typeName: "contact-kefu" }
                ],
                no_weixin: [
                    { text: "我的粉丝", typeName: "my-fans" },
                    { text: "兑换记录", typeName: "exchange-record" },
                    { text: "兑换信息管理", typeName: "info-manage" },
                    { text: "联系客服", typeName: "contact-kefu" }
                ]
            },
            isJumpPage: true
        };
    },
    components: {
        "dyd-header": HeaderTop
    },
    created() {
        this.isWeixin = Native.is_wechat() ? true : false;
        // console.log(this.isWeixin);
        let titleName = document.getElementsByTagName("title")[0];
        titleName.innerHTML = "我的积分";
        this.getData();
    },
    mounted() {
        Bridge.RegisterBridge(
            BridgeCmd.RECEIVEBACK,
            (data, responseCallback) => {
                this.$router.go(-1);
            }
        );
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        openQrcode() {
            Bridge.CallBridge(BridgeCmd.DYD_SHARE, {}, "", "", 1, () => {});
        },
        openIntegralDetail() {
            console.log("打开积分明细页面");
            if (Native.is_ios()) {
                Bridge.CallBridge(
                    "dydZhuangIntegralRecord",
                    {},
                    "integraldetail&title=积分明细",
                    "",
                    2,
                    () => {
                        this.$toast({
                            msg: "ios调用成功",
                            timeout: 1500
                        });
                    }
                );
            } else {
                this.$router.push({ name: "integral-detail" });
            }
        },
        openExtract() {
            // this.isJumpPage ==> false 冻结 true 可跳转
            if (!this.isJumpPage) {
                this.$toast({
                    msg: "冻结状态，不可提现",
                    timeout: 1500
                });
                return;
            }

            if (Native.is_wechat()) {
                this.$toast({
                    msg: "请前往应用商店下载点一点购物app完成提现",
                    timeout: 2000
                });
                return;
            }

            Bridge.CallBridge(BridgeCmd.DYD_WITHDRAW, {}, "", "", 1, () => {
                this.$toast({
                    msg: "打开了提现界面--原生",
                    timeout: 1000
                });
            });
        },
        goOtherPage(type) {
            // console.log(type);
            let funcName = "",
                msg = "";
            switch (type) {
                case "my-fans":
                    if (Native.is_ios()) {
                        Bridge.CallBridge(
                            "dydZhuangFans",
                            {},
                            "myfans&title=我的粉丝",
                            "",
                            2,
                            () => {
                                this.$toast({
                                    msg: "ios调用成功",
                                    timeout: 1500
                                });
                            }
                        );
                    } else {
                        this.$router.push({ name: "my-fans" });
                    }
                    break;
                case "exchange-record":
                    funcName = BridgeCmd.DYD_WITHDRAW_RECORD;
                    msg = "打开了兑换记录页面--原生";
                    break;
                case "info-manage":
                    funcName = BridgeCmd.DYD_WITHDRAW_MANAGE;
                    msg = "打开了兑换信息管理页面--原生";
                    break;
                case "contact-kefu":
                    funcName = BridgeCmd.DYD_CUSTOMER_SERVICE;
                    msg = "打开了客服页面--原生";
                    break;
            }
            if (type != "my-fans") {
                console.log(111111, funcName, msg);
                Bridge.CallBridge(funcName, {}, "", "", 1, () => {
                    this.$toast({
                        msg: msg,
                        timeout: 1000
                    });
                });
            }
        },
        getData() {
            Http.send(
                {
                    api_name: "kyk.richLandlord.myPoints"
                },
                res => {
                    if (res.code == 0) {
                        let data = res.data.list;
                        console.log("my-integral:", data);
                        // data = {
                        //     headimgurl:
                        //         "https://img.51k1k.com/Uploads/image/default/2019-01/20190126172213_17119_180_180.png",
                        //     nickname: "65151",
                        //     user_id: "65151",
                        //     accumulated_points: "0.00",
                        //     cash_money: "0.00",
                        //     month_commission: 66,
                        //     before_month_commission: 990,
                        //     today_commission: 10,
                        //     before_commission: 30,
                        //     is_frozen: "0"
                        // };
                        // data.is_frozen ==> 0正常1冻结
                        this.isJumpPage = data.is_frozen == "0" ? true : false; // true正常，false冻结
                        // console.log(this.isJumpPage);
                        this.userinfoObj = {
                            name: data.nickname,
                            user_icon: data.headimgurl
                                ? data.headimgurl
                                : require("../assets/image/icon-default-head.png")
                        };
                        this.totalIntegralObj = {
                            total_integral: data.accumulated_points,
                            surplus_integral: data.cash_money
                        };
                        this.integralList[0].integral_item = {
                            curr_integral_text: "本月积分",
                            curr_integral: data.month_commission,
                            formerly_integral_text: "上月积分",
                            formerly_integral: data.before_month_commission
                        };
                        this.integralList[1].integral_item = {
                            curr_integral_text: "今日积分",
                            curr_integral: data.today_commission,
                            formerly_integral_text: "昨日积分",
                            formerly_integral: data.before_commission
                        };
                        console.log(
                            this.userinfoObj,
                            this.totalIntegralObj,
                            this.integralList
                        );
                    } else {
                        this.$toast({
                            msg: res.error_msg,
                            timeout: 1500
                        });
                    }
                }
            );
        }
    }
};
</script>
<style lang='less' scoped>
.my-integral {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    .wrap {
        position: relative;
        background: #f2f2f2;
        .integral-top-bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 4.4rem;
            background: url("../assets/image/image-integral-bg.png") no-repeat
                center center;
            background-size: cover;
        }
        .integral-top {
            position: fixed;
            top: 0;
            z-index: 100;
            width: 100%;
            background: #fec248;
            .icon-code {
                display: inline-block;
                width: 0.64rem;
                height: 0.64rem;
                // width: 0.56rem;
                // height: 0.56rem;
            }
            .icon-left-arrows {
                margin-left: 0.2rem;
                background: url("../assets/image/icon-integral-left-arrows.png")
                    no-repeat center center;
                background-size: cover;
            }
            .icon-right-code {
                background: url("../assets/image/icon-code.png") no-repeat
                    center center;
                background-size: cover;
                margin-right: 0.2rem;
            }
        }
        .line {
            width: 100%;
            height: 1.28rem;
        }
        .integral-content {
            // background: #f2f2f2;
            position: relative;
            z-index: 98;
            width: 100%;
            padding: 0.2rem 0.2rem;
            .content-item {
                background: #ffffff;
                border-radius: 0.12rem;
                -webkit-border-radius: 0.12rem;
                -moz-border-radius: 0.12rem;
            }
            .userinfo {
                padding: 0.2rem 0;
                margin-bottom: 0.2rem;
                .userinfo-top {
                    align-items: center;
                    padding-left: 0.18rem;
                    margin-bottom: 0.4rem;
                    img {
                        display: block;
                        width: 0.84rem;
                        height: 0.84rem;
                        border-radius: 0.42rem;
                    }
                    p {
                        font-size: 0.28rem;
                        color: #312c30;
                        margin-left: 0.2rem;
                    }
                }
                .userinfo-bottom {
                    justify-content: space-between;
                    div {
                        width: 50%;
                        flex-direction: column;
                        align-items: center;
                        p {
                            font-size: 0.24rem;
                            color: #999999;
                            line-height: 0.34rem;
                            padding-bottom: 0.16rem;
                        }
                        span {
                            font-size: 0.36rem;
                            color: #333333;
                            line-height: 0.44rem;
                            margin-bottom: 0.2rem;
                        }
                        .integral-detail-btn {
                            width: 0.86rem;
                            border-radius: 0.17rem;
                            -webkit-border-radius: 0.17rem;
                            -moz-border-radius: 0.17rem;
                            border: 0.02rem solid rgba(153, 153, 153, 1);
                            font-size: 0.24rem;
                            color: #999999;
                            line-height: 0.34rem;
                            text-align: center;
                        }
                    }
                }
            }
            .integral-box {
                margin-bottom: 0.2rem;
                .integral-box-top {
                    padding: 0 0.2rem;
                    p {
                        font-size: 0.28rem;
                        color: #666666;
                        line-height: 0.72rem;
                        border-bottom: 0.01rem solid #e9e9e9;
                    }
                }
                .integral-box-bottom {
                    div {
                        width: 50%;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        padding: 0.2rem 0;
                        p {
                            font-size: 0.24rem;
                            color: #999999;
                            line-height: 0.34rem;
                            margin-bottom: 0.16rem;
                        }
                        span {
                            font-size: 0.36rem;
                            color: #333333;
                            line-height: 0.44rem;
                        }
                    }
                }
            }
            .integral-relevance-link {
                padding: 0 0.2rem;
                .item {
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 0.02rem solid #efeff3;
                    p {
                        font-size: 0.24rem;
                        color: #333333;
                        line-height: 0.8rem;
                    }
                    .icon-right-arrows {
                        display: inline-block;
                        width: 0.32rem;
                        height: 0.46rem;
                        background: url("../assets/image/icon-integral-right-arrows.png")
                            no-repeat center center;
                        background-size: cover;
                    }
                }
            }
        }
    }
}
</style>