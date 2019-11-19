<template>
    <!-- 
        2019-11-9
    -->
    <div class="personal-info">
        <dyd-header class="personal-info-header" title="个人信息">
            <span class="iconfont icon-left-arrows" slot="left" @click="goBack"></span>
            <p class="save" slot="right" @click="saveClick">保存</p>
        </dyd-header>
        <div class="continer">
            <div class="user-icon-box flex">
                <img @click="changeUserIcon" :src="userIcon" alt />
                <p>点击修改头像</p>
            </div>
            <ul class="user-info-box">
                <li class="flex">
                    <p>昵称</p>
                    <input
                        class="input-box"
                        type="text"
                        v-model="userName"
                        @blur.prevent="nameBlurEvent"
                        @focus="nameFocusEvent"
                    />
                </li>
                <li class="flex">
                    <p>性别</p>
                    <div class="sex-box flex">
                        <div class="boy flex">
                            <span class="iconfont" :class="boyIconClass" @click="selBoyEvent"></span>
                            <span>男</span>
                        </div>
                        <div class="girl flex">
                            <span class="iconfont" :class="girlIconClass" @click="selGirlEvent"></span>
                            <span>女</span>
                        </div>
                    </div>
                </li>
                <li class="flex">
                    <p>出生日期</p>
                    <p @click="updateBirthDate">{{birthDate | time(2)}}</p>
                </li>
                <li class="flex">
                    <p>手机号码</p>
                    <input
                        class="input-box"
                        type="tel"
                        name="mobile"
                        v-model="mobile"
                        @blur.prevent="telBlurEvent"
                        @focus="telFocusEvent"
                        maxlength="11"
                    />
                </li>
                <li class="flex">
                    <p>用户ID</p>
                    <p>{{userId}}</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import HeaderTop from "@/components/HeaderTop";
import Bridge from "../api/bridgeManager";
import { BridgeCmd } from "../api/globalConst";
export default {
    name: "personal-info",
    data() {
        return {
            userIcon: "",
            userName: "",
            mobile: 0,
            birthDate: "",
            userId: "",
            sex_name: "",
            isSexType: 0 // 性别选则的状态 0都没选;1男;2女
        };
    },
    components: {
        "dyd-header": HeaderTop
    },
    created() {},
    mounted() {
        console.log(this.$route.params);
        // console.log(this.$route.query);
        this.getData();
        Bridge.RegisterBridge(BridgeCmd.RECEIVEBACK, (data,responseCallback) => {
            console.log("personal-info",data,responseCallback);
            this.$toast({
                msg: "调用成功",
                timeout: 1500
            })
            this.$router.go(-1);
        })
    },
    computed: {
        boyIconClass() {
            let iconclass = "";
            iconclass =
                this.isSexType == 1
                    ? "icon-sex-select"
                    : "iconfont icon-sex-no-select";
            return iconclass;
        },
        girlIconClass() {
            let iconclass = "";
            iconclass =
                this.isSexType == 2
                    ? "icon-sex-select"
                    : "iconfont icon-sex-no-select";
            return iconclass;
        }
    },
    methods: {
        nameBlurEvent() {
            console.log("昵称失去焦点:", this.userName);
            setTimeout(function() {
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                console.log("scroll-height:",scrollHeight);
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        },
        nameFocusEvent() {
            console.log("昵称获得焦点:", this.userName);
        },
        // 输入框失去焦点;
        telBlurEvent() {
            console.log("手机号失去焦点:", this.userName);
            let { result, errMsg } = this.validate("mobile", this.mobile);
            if (result == false) {
                this.$toast({
                    msg: errMsg,
                    timeout: 1500
                })
            }
            setTimeout(function() {
                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
            }, 100);
        },
        telFocusEvent() {
            console.log("手机号获得焦点:", this.userName);
        },
        updateBirthDate() {
            console.log("更新出生日期");
            // TODO 缺少一个日期选择的插件
        },
        goBack() {
            this.$router.go(-1);
        },
        saveClick() {
            let { result, errMsg } = this.validate("mobile", this.mobile);
            if (result == false) {
                this.$toast({
                    msg: errMsg,
                    timeout: 1500
                })
                return;
            }
            console.log(111111);
            let userInfoObj = {
                userIcon: this.userIcon,
                name: this.userName,
                sexName: this.sex_name,
                birthDate: this.birthDate,
                mobile: this.mobile,
                userId: this.userId
            };
            console.log("userinfoObj:", userInfoObj);
            this.$toast({
                msg: "保存成功",
                timeout: 1500
            })
            this.$router.go(-1);
        },
        changeUserIcon() {
            this.$toast({
                msg: "正在调用相册功能",
                timeout: 1500
            })
        },
        selBoyEvent() {
            if (this.isSexType == 1) return;
            this.isSexType = 1;
            this.sex_name = "boy";
        },
        selGirlEvent() {
            if (this.isSexType == 2) return;
            this.isSexType = 2;
            this.sex_name = "girl";
        },
        getData() {
            // console.log(new Date("2019-8-31").getTime());
            let data = {
                user_icon: "https://iph.href.lu/160x160",
                name: "小爱同学",
                sex: "girl",
                birth_date: 1567180800,
                mobile: 18888888888,
                user_id: "123456"
            };
            this.userIcon = data.user_icon;
            this.userName = data.name;
            this.mobile = data.mobile;
            this.birthDate = data.birth_date;
            this.userId = data.user_id;
            this.sex_name = data.sex;
            if (data.sex == "boy") {
                this.isSexType = 1;
            } else if (data.sex == "girl") {
                this.isSexType = 2;
            } else {
                this.isSexType = 0;
            }
        }
    }
};
</script>
<style lang='less' scoped>
.personal-info {
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    .personal-info-header {
        background: #fff;
        .icon-left-arrows {
            display: inline-block;
            width: 0.18rem;
            height: 0.32rem;
            background: url("../assets/image/icon-fans-left-arrows.png")
                no-repeat center center;
            background-size: cover;
            margin-left: 0.2rem;
        }
        .save {
            font-size: 0.24rem;
            color: #333;
            margin-right: 0.2rem;
        }
    }
    .continer {
        .user-icon-box {
            background: #fff;
            flex-direction: column;
            align-items: center;
            padding-top: 0.68rem;
            border-top: 0.01rem solid #f5f6f6;
            margin-bottom: 0.16rem;
            img {
                width: 1.6rem;
                height: 1.6rem;
                border-radius: 50%;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
            }
            p {
                font-size: 0.28rem;
                color: #999;
                line-height: 0.4rem;
                padding: 0.2rem 0 0.52rem 0;
            }
        }
        .user-info-box {
            padding-left: 0.2rem;
            background: #fff;
            li {
                align-items: center;
                border-bottom: 0.01rem solid #d8d8d8;
                font-size: 0.28rem;
                color: #333;
                line-height: 0.96rem;
                .input-box {
                    font-size: 0.28rem;
                    color: #999;
                    border: none;
                }
                p:first-child {
                    width: 1.8rem;
                }
                p:nth-child(2) {
                    color: #999;
                }
                .sex-box {
                    align-items: center;
                    div {
                        align-items: center;
                        .iconfont {
                            width: 0.32rem;
                            height: 0.32rem;
                            border-radius: 50%;
                            -webkit-border-radius: 50%;
                            -moz-border-radius: 50%;
                        }
                        .icon-sex-no-select {
                            background: url("../assets/image/image-sex-no-select.png")
                                no-repeat center center;
                            background-size: cover;
                        }
                        .icon-sex-select {
                            background: url("../assets/image/image-sex-select.png")
                                no-repeat center center;
                            background-size: cover;
                        }
                        span:nth-child(2) {
                            color: #999;
                            font-size: 0.28rem;
                            margin-left: 0.16rem;
                        }
                    }
                    .boy {
                        margin-right: 0.9rem;
                    }
                }
            }
        }
    }
}
</style>