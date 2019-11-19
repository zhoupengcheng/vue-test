<template>
    <div class="home">
        <div class="wrap">
            <div class="top-bg"></div>
            <div class="home-top">
                <!-- TODO 缺少一个背景图，暂时用orange来代替 -->
                <dyd-header title="庄主联盟" v-if="browserEnv == 'android'">
                    <span class="iconfont icon-left-arrows" slot="left" @click="goBack"></span>
                    <!-- <span class="iconfont icon-setup" slot="right" @click="openPersonalDetail"></span> -->
                </dyd-header>
            </div>
            <div class="line" v-if="browserEnv == 'android'"></div>
            <div class="continer">
                <div class="userinfo-box flex">
                    <img :src="userinfoObj.imgUrl" alt />
                    <div class="userinfo-box-right">
                        <p class="user-name">{{userinfoObj.name}}</p>
                        <p>
                            等级:
                            <span>{{userinfoObj.userLevel}}</span>
                        </p>
                        <p>
                            我的ID:
                            <span>{{userinfoObj.userId}}</span>
                        </p>
                    </div>
                </div>
                <ul class="integral-box flex">
                    <li v-for="(item,idx) in integralTypeList" :key="idx">
                        <p class="integral-name flex" @click="openMyIntegral(item.isClick)">
                            {{item.name}}
                            <span
                                class="iconfont"
                                :class="item.isClick ? 'icon-integral-right-arrows' : '' "
                            ></span>
                        </p>
                        <p class="integral-num">{{item.num}}</p>
                    </li>
                </ul>
                <div class="myfans-box">
                    <div class="myfans-box-top flex" @click="goMyFans">
                        <p>我的粉丝</p>
                        <span class="iconfont icon-fans-right-arrows"></span>
                    </div>
                    <ul class="myfans-box-bottom flex">
                        <li v-for="(item, idx) in fansTypeList" :key="idx">
                            <p class="fans-type-name">{{item.name}}</p>
                            <p class="fans-num">{{item.num}}</p>
                        </li>
                    </ul>
                </div>
                <div class="btn-box flex">
                    <div class="integral-exchange flex" @click="exchangeEvent">
                        <span class="iconfont icon-integral"></span>
                        <p>积分兑换</p>
                    </div>
                    <div class="redpacket-share flex" @click="shareEvent">
                        <span class="iconfont icon-redpacket"></span>
                        <p>分享红包</p>
                    </div>
                </div>
                <div class="chart-box">
                    <div class="new-fans flex">
                        <span>7日新增粉丝数</span>
                    </div>
                    <dyd-chart :chartData="chartData"></dyd-chart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderTop from "@/components/HeaderTop";
import ChartCom from "@/components/ChartCom";
import Http from "../net/http";
import Global from "../api/global";
import Bridge from "../api/bridgeManager";
import { BridgeCmd } from "../api/globalConst";
import Native from "../api/native";
export default {
    name: "home",
    data() {
        return {
            userinfoObj: {},
            userGradeName: "",
            integralTypeList: [
                { name: "累计积分", num: 0, isClick: true },
                { name: "今日积分", num: 0, isClick: false },
                { name: "本月积分", num: 0, isClick: false }
            ],
            fansTypeList: [
                { name: "累计粉丝", num: 0 },
                { name: "累计10级粉丝", num: 0 },
                { name: "今日新增", num: 0 }
            ],
            chartData: {
                columns: ["date", "日新增粉丝"],
                rows: []
            },
            isCanShare: 1,
            browserEnv: ""
        };
    },
    components: {
        "dyd-header": HeaderTop,
        "dyd-chart": ChartCom
    },
    created() {
        Global.browserEnv = Native.is_android_not_wechat()
            ? "android"
            : "not_android";
        this.browserEnv = Global.browserEnv;
        console.log(this.browserEnv);
        let titleName = document.getElementsByTagName("title")[0];
        titleName.innerHTML = "庄主联盟";
        this.getData();
    },
    mounted() {
    },
    methods: {
        goBack() {
            console.log("返回上一页");
            Bridge.CallBridge(
                BridgeCmd.DYD_ALLIANCE_ACTIVITY,
                {},
                "",
                "",
                1,
                () => {
                    this.$toast({
                        msg: "调用成功,即将返回到app中",
                        timeout: 1500
                    });
                }
            );
        },
        openPersonalDetail() {
            this.$router.push({ name: "personal-info" });
        },
        openMyIntegral(bool) {
            // console.log("即将前往我的积分页面", bool);
            if (!bool) return;
            if (!Native.is_ios()) {
                this.$router.push("/myintegral");
                return;
            }
            Bridge.CallBridge(
                "dydZhuangIntegral",
                {},
                "myintegral&title=我的积分",
                "",
                2,
                () => {}
            );
        },
        exchangeEvent() {
            // 在小程序环境中 ==> 请前往应用商店下载点一点购物app完成提现
            if (Native.is_wechat()) {
                this.$toast({
                    msg: "请前往应用商店下载点一点购物app完成提现",
                    timeout: 2000
                });
                return;
            }
            Bridge.CallBridge(BridgeCmd.DYD_WITHDRAW, {}, "", "", 1, () => {});
        },
        shareEvent() {
            if (this.isCanShare == 0) {
                this.$toast({
                    msg: "红包已用完，需补发",
                    timeout: 1500
                });
                return;
            }
            Bridge.CallBridge(
                BridgeCmd.DYD_REDPACKET_SHARE,
                {},
                "",
                "",
                1,
                () => {}
            );
        },
        goMyFans() {
            if (Native.is_ios()) {
                Bridge.CallBridge(
                    "dydZhuangFans",
                    {},
                    "myfans&title=我的粉丝",
                    "",
                    2,
                    () => {}
                );
            } else {
                this.$router.push({ name: "my-fans" });
            }
        },
        //
        setChartDateTime(data) {
            let str = data.split("-");
            // console.log(`${str[1]}-${str[2]}`);
            return `${str[1]}-${str[2]}`;
        },
        // 设置表格数据
        setChartData(list) {
            if (!list || list.length == 0) return [];
            let midArr = [];
            list.map((val, idx) => {
                let mid = {};
                mid = {
                    date: this.setChartDateTime(val.date),
                    日新增粉丝: val.user_num
                };
                midArr.push(mid);
                // console.log(mid);
            });
            return midArr;
        },
        getData() {
            Http.send(
                {
                    api_name: "kyk.richLandlord.richLandlordData"
                    // uid: Global.userId
                },
                res => {
                    if (res.code == 0) {
                        console.log("res", res.data.list);
                        let data = res.data.list;
                        // data = {
                        //     headimgurl: "https://iph.href.lu/120x120",
                        //     nickname: "吃葡萄不吐葡萄皮",
                        //     distribution_level: "星级庄主",
                        //     user_id: "10066",
                        //     accumulated_points: 10999,
                        //     month_commission: 600,
                        //     today_commission: 36,
                        //     cumulative_user_num: 99,
                        //     ten_user_num: 60,
                        //     today_user_num: 10,
                        //     can_share: 0,
                        //     trend_map: [
                        //         { date: "2019-11-05", user_num: 10 },
                        //         { date: "2019-11-06", user_num: 66 },
                        //         { date: "2019-11-07", user_num: 360 },
                        //         { date: "2019-11-08", user_num: 100 },
                        //         { date: "2019-11-09", user_num: 500 },
                        //         { date: "2019-11-10", user_num: 560 },
                        //         { date: "2019-11-11", user_num: 66 }

                        //     ]
                        // };
                        // this.isCanShare = 1; // 是否可以分享红包
                        this.isCanShare = data.can_share; // 是否可以分享红包, 1==>可以分享，2==>不可以
                        // data.headimgurl = "https://iph.href.lu/120x120";
                        // data.headimgurl = null;
                        // data.distribution_level = 3;
                        if (data.distribution_level == "2") {
                            this.userGradeName = "庄主";
                        } else if (data.distribution_level == "3") {
                            this.userGradeName = "星级庄主";
                        } else {

                        }
                        this.userinfoObj = {
                            name: data.nickname,
                            userLevel: this.userGradeName,
                            imgUrl: data.headimgurl
                                ? data.headimgurl
                                : require("../assets/image/icon-default-head.png"),
                            userId: data.user_id
                        };
                        console.log("user-info:", this.userinfoObj);
                        this.integralTypeList[0].num = data.accumulated_points
                            ? data.accumulated_points
                            : 0; // 可能为null
                        this.integralTypeList[1].num = data.month_commission
                            ? data.month_commission
                            : 0;
                        this.integralTypeList[2].num = data.today_commission
                            ? data.today_commission
                            : 0;

                        this.fansTypeList[0].num = data.cumulative_user_num
                            ? data.cumulative_user_num
                            : 0;
                        this.fansTypeList[1].num = data.ten_user_num
                            ? data.ten_user_num
                            : 0;
                        this.fansTypeList[2].num = data.today_user_num
                            ? data.today_user_num
                            : 0;

                        this.chartData.rows = this.setChartData(data.trend_map);
                        console.log("chart-data:", this.chartData);
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
<style lang="less" scoped>
.home {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    .wrap {
        background: #f2f2f2;
        position: relative;
        .top-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 4rem;
            background: url("../assets/image/image-new-fans-bg.png") no-repeat
                center center;
            background-size: cover;
        }
        .home-top {
            position: fixed;
            top: 0;
            z-index: 100;
            width: 100%;
            background: #fec248;
            .icon-left-arrows {
                display: inline-block;
                width: 0.18rem;
                height: 0.32rem;
                background: url("../assets/image/icon-fans-left-arrows.png")
                    no-repeat center center;
                background-size: cover;
                margin-left: 0.2rem;
            }
            .icon-setup {
                display: inline-block;
                width: 0.4rem;
                height: 0.42rem;
                background: url("../assets/image/icon-setup.png") no-repeat
                    center center;
                background-size: cover;
                margin-right: 0.32rem;
            }
        }
        .line {
            width: 100%;
            height: 1.28rem;
        }
        .continer {
            padding: .08rem 0.2rem 0.2rem;
            position: relative;
            z-index: 99;
            .userinfo-box {
                margin-bottom: 0.4rem;
                img {
                    width: 1.2rem;
                    height: 1.2rem;
                    border-radius: 50%;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    margin: 0 0.32rem 0 0.12rem;
                }
                .userinfo-box-right {
                    p {
                        color: #000;
                        font-size: 0.24rem;
                        line-height: 0.34rem;
                        margin-bottom: 0.06rem;
                        font-weight: 400;
                        span {
                            padding-left: 0.08rem;
                        }
                    }
                    .user-name {
                        font-size: 0.28rem;
                        line-height: 0.4rem;
                        font-weight: 600;
                    }
                }
            }
            .integral-box {
                justify-content: space-between;
                border-radius: 0.12rem;
                -webkit-border-radius: 0.12rem;
                -moz-border-radius: 0.12rem;
                background: linear-gradient(
                    135deg,
                    rgba(76, 76, 76, 1) 0%,
                    rgba(26, 26, 26, 1) 100%
                );
                padding: 0.4rem 0;
                margin-bottom: 0.2rem;
                li {
                    flex: 1;
                    p {
                        font-size: 0.24rem;
                        color: #fff;
                        line-height: 0.34rem;
                        text-align: center;
                        justify-content: center;
                        align-items: center;
                        span {
                            display: inline-block;
                            width: 0.18rem;
                            height: 0.26rem;
                        }
                        .icon-integral-right-arrows {
                            background: url("../assets/image/icon-home-integral-right-arrows.png")
                                no-repeat center center;
                            background-size: cover;
                        }
                    }
                    .integral-num {
                        font-size: 0.36rem;
                        line-height: 0.44rem;
                        padding-top: 0.24rem;
                    }
                }
            }
            .myfans-box {
                background: #fff;
                padding: 0 0.2rem;
                margin-bottom: 0.2rem;
                border-radius: 0.12rem;
                -webkit-border-radius: 0.12rem;
                -moz-border-radius: 0.12rem;
                .myfans-box-top {
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 0.01rem solid #efeff3;
                    line-height: 0.84rem;
                    font-size: 0.28rem;
                    color: #333;
                    font-weight: 600;
                    .icon-fans-right-arrows {
                        width: 0.18rem;
                        height: 0.26rem;
                        background: url("../assets/image/icon-home-fans-right-arrows.png")
                            no-repeat center center;
                        background-size: cover;
                    }
                }
                .myfans-box-bottom {
                    justify-content: space-between;
                    padding: 0.2rem 0;
                    li {
                        flex: 1;
                        p {
                            font-size: 0.24rem;
                            color: #666;
                            line-height: 0.34rem;
                            text-align: center;
                        }
                        .fans-num {
                            font-size: 0.32rem;
                            color: #333;
                            line-height: 0.38rem;
                            font-weight: 600;
                            padding-top: 0.12rem;
                        }
                    }
                }
            }
            .btn-box {
                justify-content: space-between;
                div {
                    width: 50%;
                    background: #fff;
                    justify-content: center;
                    align-items: center;
                    border-radius: 0.12rem;
                    -webkit-border-radius: 0.12rem;
                    -moz-border-radius: 0.12rem;
                    padding: 0.26rem 0;
                    font-size: 0.28rem;
                    color: #333;
                    line-height: 0.4rem;
                    span {
                        width: 1.08rem;
                        height: 1.1rem;
                        margin-right: 0.14rem;
                    }
                    .icon-integral {
                        background: url("../assets/image/icon-integral.png")
                            no-repeat center center;
                        background-size: cover;
                    }
                    .icon-redpacket {
                        background: url("../assets/image/icon-redpacket.png")
                            no-repeat center center;
                        background-size: cover;
                    }
                }
                .integral-exchange {
                    margin-right: 0.2rem;
                }
            }
            .chart-box {
                padding-top: 0.2rem;
                .new-fans {
                    justify-content: flex-start;
                    margin-bottom: 0.2rem;
                    font-size: 0.24rem;
                    color: #000;
                    line-height: 0.42rem;
                    text-align: center;
                    span {
                        background: #fdc553;
                        border-radius: 0.12rem;
                        -webkit-border-radius: 0.12rem;
                        -moz-border-radius: 0.12rem;
                        padding: 0 0.16rem;
                    }
                }
            }
        }
    }
}
</style>
