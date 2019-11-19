<template>
    <div class="new-fans">
        <div class="wrap">
            <dyd-fans-com :dataObj="newFansObj" typeName="newfans"></dyd-fans-com>
            <div class="continer">
                <div class="chart-title flex">
                    <span class="chart-title__text">日新增粉丝趋势图</span>
                    <span>近7天</span>
                </div>
                <dyd-chart :chartData="chartData"></dyd-chart>
            </div>
        </div>
    </div>
</template>

<script>
import FansComTop from "@/components/FansComTop";
import ChartCom from "@/components/ChartCom";
import Http from "../net/http";
import Global from "../api/global";
export default {
    name: "new-fans",
    data() {
        return {
            newFansObj: {},
            chartData: {
                columns: ["date", "日新增粉丝"],
                rows: []
            }
        };
    },
    components: {
        "dyd-fans-com": FansComTop,
        "dyd-chart": ChartCom
    },
    created() {
        let titleName = document.getElementsByTagName("title")[0];
        titleName.innerHTML = "今日新增";
        this.getData();
    },
    mounted() {
    },
    computed: {},
    methods: {
        setChartDateTime(data) {
            let str = data.split("-");
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
                    api_name: "kyk.richLandlord.todayFans",
                    // uid: Global.userId
                },
                res => {
                    if (res.code == 0) {
                        let data = res.data.list;
                        console.log(data);
                        // data = {
                        //     today_user_num: 16,
                        //     trend_map: [
                        //         { date: "2019-11-05", user_num: 10 },
                        //         { date: "2019-11-06", user_num: 66 },
                        //         { date: "2019-11-07", user_num: 360 },
                        //         { date: "2019-11-08", user_num: 100 },
                        //         { date: "2019-11-09", user_num: 500 },
                        //         { date: "2019-11-10", user_num: 160 },
                        //         { date: "2019-11-11", user_num: 66 }
                        //     ]
                        // };
                        this.newFansObj = {
                            header_title: "今日新增",
                            min_title: "今日新增粉丝数",
                            fans_num: data.today_user_num
                        };
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
<style lang='less' scoped>
.new-fans {
    width: 100;
    height: 100%;
    background: #f2f2f2;
    .wrap {
        background: #f2f2f2;
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
                height: 1.28rem
            }
            .new-fans-topbg {
                height: 2.72rem;
                background: url("../assets/image/image-new-fans-bg.png")
                    no-repeat center center;
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
        .continer {
            padding: 0.2rem 0.2rem;
            .chart-title {
                justify-content: space-between;
                margin-bottom: 0.2rem;
                font-size: 0.24rem;
                color: #999;
                line-height: 0.42rem;
                text-align: center;
                .chart-title__text {
                    color: #000;
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
</style>