<template>
    <!-- 
      2019-11-11
    -->
    <div class="my-fans">
        <div class="wrap flex">
            <dyd-fans-com :dataObj="fansInfoObj" typeName="myfans">
                <div class="other-fans-box flex">
                    <div class="other-fans-box-item left">
                        <p>10级粉丝数</p>
                        <p>{{fansInfoObj.ten_grade_above_num}}</p>
                    </div>
                    <div class="center"></div>
                    <div class="other-fans-box-item right">
                        <p class="flex" @click="openNewFansPage">
                            <span>今日新增</span>
                            <span class="iconfont icon-right-arrows"></span>
                        </p>
                        <p>{{fansInfoObj.day_new_fans_num}}</p>
                    </div>
                </div>
            </dyd-fans-com>
            <div class="continer">
                <div class="sort-box flex">
                    <div class="grade-sort-box">
                        <div class="sort-item grade-sort flex" @click="popupGradeBox">
                            <p>{{gradeSortText}}</p>
                            <span class="iconfont icon-down-arrows"></span>
                        </div>
                        <!-- <div class="sel-grade-item" v-show="isShowGradeSort">
                            <p
                                v-for="(item, idx) in gradeSortList"
                                :key="idx"
                                @click="selGradeSortClick(idx,item)"
                            >{{item}}</p>
                        </div>-->
                    </div>
                    <div class="sort-item time-sort flex" @click="popupTimeBox">
                        <p class="time-text">{{startTime | time(4) }}—{{endTime | time(4) }}</p>
                        <span class="iconfont"></span>
                    </div>
                </div>
                <div class="table-wrap">
                    <table class="table-box" cellspacing="0" cellpadding="0"  v-show="chartList.length > 0">
                        <tr>
                            <th v-for="(item, idx) in tabTitleList" :key="idx">{{item}}</th>
                        </tr>
                        <tr v-for="(items, idx) in chartList" :key="idx">
                            <td v-for="(item, index) in items" :key="index">{{item}}</td>
                        </tr>
                    </table>
                    <!-- list没有数据 -->
                    <dyd-no-data class="table-no-data" oneTitle="没有更多粉丝了" twoTitle="快去添加一些粉丝吧~" v-show="chartList.length == 0"></dyd-no-data>
                </div>
            </div>
        </div>
        <div class="mask" v-show="isShowMask" @click="closeCalendarMask">
            <!-- 等级选择框 -->
            <div class="mask-grade-box" v-show="isShowGradeSort" @click.stop="stopBubbling">
                <div class="mask-title">请选择</div>
                <div class="mask-content-columns">
                    <div class="mask-content-column">
                        <ul class="mask-content-column__wrap">
                            <li
                                class="mask-content-column__item"
                                v-for="(item, idx) in gradeSortList"
                                :key="idx"
                                @click="selGradeSortClick(idx,item)"
                            >{{item}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <!-- 日期弹出框 -->
            <div class="mask-calendar-box" v-show="isShowTimeSort" @click.stop="stopBubbling">
                <dyd-calendar v-on:choseDay="selTimeSortClick" :is_hide_otherday="false"></dyd-calendar>
            </div>
        </div>
    </div>
</template>

<script>
import Calendar from "vue-calendar-component";
import FansComTop from "@/components/FansComTop";
import HeaderTop1 from "@/components/HeaderTop1";
import Http from "../net/http";
import Global from "../api/global";
import Native from "../api/native";
import Bridge from "../api/bridgeManager";
export default {
    name: "my-fans",
    data() {
        return {
            pageNum: 0,
            pageSize: 10,
            fansInfoObj: {},
            gradeSortList: ["全部", "星级庄主", "庄主", "粉丝"],
            disLevel: 0,
            gradeSortText: "全部",
            startTime: "",
            endTime: "",
            selStartTime: "",
            selEndTime: "",
            count: 0, //
            isShowMask: false,
            isShowGradeSort: false,
            isShowTimeSort: false,
            tabTitleList: ["昵称", "等级", "10级粉丝", "普通粉丝"],
            chartList: []
        };
    },
    components: {
        "dyd-header": HeaderTop1,
        "dyd-fans-com": FansComTop,
        "dyd-calendar": Calendar
    },
    created() {
        let titleName = document.getElementsByTagName("title")[0];
        titleName.innerHTML = "我的粉丝";
        this.startTime = new Date().getTime();
        this.endTime = this.startTime;
        this.getData();
    },
    mounted() {
        // this.startTime = 1573574400000;
        // this.endTime = 1573660800000;
    },
    computed: {},
    methods: {
        initSelTime() {
            this.count = 0;
            this.selStartTime = "";
            this.selEndTime = "";
        },
        openNewFansPage() {     
            if (Native.is_ios()) {
                // console.log("222-ios");
                Bridge.CallBridge(
                    "dydZhuangFansIncrease",
                    {},
                    "todaynewfans&title=今日新增",
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
                this.$router.push("/todaynewfans");
            }
        },
        popupGradeBox() {
            console.log("grade-box-show:", this.isShowGradeSort);
            this.isShowMask = true;
            this.isShowGradeSort = true;
        },
        popupTimeBox() {
            console.log("time-box-show:", this.isShowTimeSort);
            this.isShowMask = true;
            this.isShowTimeSort = true;
        },
        selGradeSortClick(idx, typeName) {
            console.log(idx, typeName);
            this.isShowMask = false;
            this.isShowGradeSort = false;
            this.gradeSortText = typeName;
            switch (this.gradeSortText) {
                case "全部":
                    this.disLevel = 0;
                    break;
                case "粉丝":
                    this.disLevel = 1;
                    break;
                case "庄主":
                    this.disLevel = 2;
                    break;
                case "星级庄主":
                    this.disLevel = 3;
                    break;
            }
            this.getData();
        },
        selTimeSortClick(data) {
            console.log(data); //选中某天
            if (this.count == 0) {
                this.selStartTime = data;
                this.count = 1;
            } else {
                this.selEndTime = data;
                this.count = 2;
            }
            if (
                this.selEndTime != "" &&
                new Date(this.selEndTime) < new Date(this.selStartTime)
            ) {
                this.$toast({
                    msg: "结束时间不能小于起始时间",
                    timeout: 1500
                });
            } else {
                if (this.count == 2) {
                    this.isShowMask = false;
                    this.isShowTimeSort = false;
                    this.startTime = this.selStartTime;
                    this.endTime = this.selEndTime;
                    this.initSelTime();
                    this.getData();
                }
            }
        },
        closeCalendarMask() {
            this.isShowMask = false;
            if (this.isShowGradeSort) {
                this.isShowGradeSort = false;
            }
            if (this.isShowTimeSort) {
                this.isShowTimeSort = false;
                this.initSelTime();
            }
        },
        stopBubbling(e) {
            // console.log(e);
            // e.stopPropagation();
        },
        setTableData(list) {
            let midArr = [];
            list.map(val => {
                let mid = {};
                mid = {
                    name: val.nickname,
                    gradeName: val.level_name == "玩家" ? "粉丝" : val.level_name,
                    tenFans: val.ten_user_num,
                    ordinaryFans: val.ordinary_user_num
                };
                midArr.push(mid);
            });
            return midArr;
        },
        getData() {
            console.log(
                "dis-level:",
                this.disLevel,
                "start-time:",
                this.startTime,
                "end-time:",
                this.endTime,
                "page-num:",
                this.pageNum,
                "page-size:",
                this.pageSize
            );
            Http.send(
                {
                    api_name: "kyk.richLandlord.myFans",
                    // uid: Global.userId,
                    distribution_level: this.disLevel,
                    start_time: this.startTime/1000,
                    end_time: this.endTime/1000,
                    first_row: this.pageNum,
                    fetch_num: this.pageSize
                },
                res => {
                    if (res.code == 0) {
                        let data = res.data.list;
                        console.log("my-fans:", data);
                        // data = {
                        //     cumulative_user_num: 302, // 累计粉丝
                        //     ten_user_num: 80, // 10级粉丝
                        //     today_user_num: 103, // 今日粉丝
                        //     son_list: [
                        //         {
                        //             distribution_level: "1",
                        //             level_name: "玩家",
                        //             nickname: "65152",
                        //             ordinary_user_num: 1,
                        //             ten_user_num: "0",
                        //             user_id: "65152"
                        //         }
                        //     ], // 粉丝列表
                        //     total_num: 1
                        // };
                        this.fansInfoObj = {
                            header_title: "我的粉丝",
                            min_title: "粉丝总数",
                            fans_num: data.cumulative_user_num ? data.cumulative_user_num : 0,
                            ten_grade_above_num: data.ten_user_num ? data.ten_user_num : 0,
                            day_new_fans_num: data.today_user_num ? data.today_user_num : 0
                        };
                        if (!data.son_list || data.son_list.length == 0) {
                            // TODO 缺少一个没有数据的icon显示;
                            this.chartList = [];
                        } else {
                            this.chartList = this.setTableData(data.son_list);
                        }
                        console.log("chart-list:", this.chartList);
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
<style lang='less'>
.my-fans {
    width: 100%;
    height: 100%;
    background: #fff;
    .mask {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        left: 0;
        top: 0;
        z-index: 1000;
        .mask-grade-box {
            width: 100%;
            background: #fff;
            font-size: 0.24rem;
            position: fixed;
            bottom: 0;
            z-index: 1001;
            .mask-title {
                line-height: 0.8rem;
                text-align: center;
                border-bottom: 0.02rem solid #ffd785;
            }
            .mask-content-columns {
                .mask-content-column {
                    text-align: center;
                    font-size: 0.24rem;
                    overflow: hidden;
                    .mask-content-column__wrap {
                        li {
                            color: #333;
                            height: 0.8rem;
                            line-height: 0.8rem;
                        }
                    }
                }
            }
        }
        .mask-calendar-box {
            width: 100%;
            position: fixed;
            bottom: 0;
            z-index: 1001;
            div:nth-child(1) {
                background-color: #fff;
                padding-bottom: 0;
            }
            .wh_container[data-v-2ebcbc83] {
                max-width: 100%;
            }
            .wh_content_item {
                color: #333;
            }
            .wh_jiantou1 {
                border-top: 0.02rem solid #333;
                border-left: 0.02rem solid #333;
            }
            .wh_content_li {
                color: #333;
            }
            .wh_jiantou2 {
                border-top: 0.02rem solid #333;
                border-right: 0.02rem solid #333;
            }
            /*今天*/
            .wh_content_item .wh_isToday[data-v-2ebcbc83] {
                background-color: rgb(139, 175, 241);
            }
            /*日历点击*/
            .wh_content_item .wh_chose_day[data-v-2ebcbc83] {
                background-color: transparent;
            }
            /*日历划过*/
            .wh_item_date[data-v-2ebcbc83]:hover {
                background-color: rgb(111, 223, 223);
                border-radius: 100%;
            }
        }
    }
    .wrap {
        flex-direction: column;
        .other-fans-box {
            width: 100%;
            justify-content: space-between;
            align-items: center;
            color: #333;
            .other-fans-box-item {
                flex: 1;
                font-size: 0.24rem;
                text-align: center;
                p:nth-child(2) {
                    font-size: 0.36rem;
                    line-height: 0.44rem;
                    padding-top: 0.16rem;
                }
            }
            .left {
            }
            .center {
                width: 0.02rem;
                height: 0.52rem;
                background: #000;
            }
            .right {
                p:first-child {
                    justify-content: center;
                    align-items: center;
                    .icon-right-arrows {
                        display: inline-block;
                        width: 0.18rem;
                        height: 0.26rem;
                        background: url("../assets/image/icon-fans-right-arrows.png")
                            no-repeat center center;
                        background-size: cover;
                    }
                }
            }
        }
        .continer {
            flex: 1;
            background: #fff;
            padding: 0.2rem 0.2rem;
            .sort-box {
                justify-content: space-between;
                margin-bottom: 0.2rem;
                .grade-sort-box {
                    position: relative;
                    .sel-grade-item {
                        position: absolute;
                        top: 0.42rem;
                        left: 0;
                        background: #fdc553;
                        border-radius: 0.12rem;
                        -webkit-border-radius: 0.12rem;
                        -moz-border-radius: 0.12rem;
                        p {
                            width: 1.86rem;
                            font-size: 0.24rem;
                            color: #000;
                            line-height: 0.42rem;
                            padding-left: 0.2rem;
                        }
                    }
                }
                .grade-sort {
                    width: 1.86rem;
                }
                .time-sort {
                    // width: 2rem;
                }
                .sort-item {
                    background: #fdc553;
                    border-radius: 0.12rem;
                    -webkit-border-radius: 0.12rem;
                    -moz-border-radius: 0.12rem;
                    justify-content: space-between;
                    padding-left: 0.2rem;
                    p {
                        font-size: 0.24rem;
                        color: #000;
                        line-height: 0.42rem;
                        // padding-left: .2rem;
                        // background: #FDC553;
                        // border-radius: .12rem;
                        // -webkit-border-radius: .12rem;
                        // -moz-border-radius: .12rem;
                        // padding: 0 .52rem 0 .28rem;
                    }
                    .time-text {
                        // padding: 0 .48rem 0 .16rem;
                    }
                    span {
                        width: 0.42rem;
                        height: 0.42rem;
                        background: url("../assets/image/icon-down-arrows.png")
                            no-repeat center center;
                        background-size: cover;
                    }
                }
            }
            .table-wrap {
                .table-no-data {
                    padding-top : .8rem;
                }
                .table-box {
                    width: 100%;
                    font-size: .24rem;
                    color: #333;
                    text-align: center;
                    line-height: .76rem;
                    margin: 0 auto;
                    border-collapse: separate;
                    border-spacing: 0;
                    tr:nth-child(2n + 1) {
                        background: #fff5e1;
                    }
                    tr:first-child {
                        th {
                            border-top: .02rem solid #fdc553;
                        }
                    }
                    tr:last-child {
                        td {
                            border-bottom: .02rem solid #fdc553;
                        }
                    }
                    tr {
                        th {
                            width: 25%;
                            background: #ffd785;
                            font-weight: 500;
                            border-right: .02rem solid #fdc553;
                        }
                        td {
                            width: 25%;
                            border-right: .02rem solid #fdc553;
                        }
                        th:first-child {
                            border-left: .02rem solid #fdc553;
                        }
                        th:last-child {
                            border-right: .02rem solid #fdc553;
                        }
                        td:first-child {
                            border-left: .02rem solid #fdc553;
                        }
                        td:last-child {
                            border-right: .02rem solid #fdc553;
                        }
                    }
                    tr:first-child th:first-child {
                        border-top-left-radius: .12rem;
                    }

                    tr:first-child th:last-child {
                        border-top-right-radius: .12rem;
                    }
                    tr:last-child td:first-child {
                        border-bottom-left-radius: .12rem;
                    }

                    tr:last-child td:last-child {
                        border-bottom-right-radius: .12rem;
                    }
                }
            }
        }
    }
}
</style>