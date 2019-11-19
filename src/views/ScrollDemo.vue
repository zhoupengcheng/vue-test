<template>
    <div class="scroll">
        <!-- <dyd-list v-model="loading" :finished="finished" finishedText="没有更多了~" @load="onLoad">
            <dyd-cell v-for="(item, idx) in list" :item="item" :key="idx"></dyd-cell>
        </dyd-list> -->
        <div class="list-box">
            <dyd-list :list="list"></dyd-list>
        </div>
        <!-- <dyd-scroll-view @callback="loadList" ref="infiniteScrollDemo">
        </dyd-scroll-view> -->
    </div>
</template>

<script>
import Http from "../net/http";
import ListCom from "@/components/ListCom";
export default {
    name: "scroll-demo",
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            list: [],
            isLoading: false,
            isFinished: true 
        };
    },
    components: {
        "dyd-list": ListCom
    },
    created() {},
    mounted() {
        this.loadList();
    },
    computed: {},
    methods: {
        onLoad() {
            // 异步更新数据
            setTimeout(() => {
                for (let i = 0; i < 10; i++) {
                    this.list.push(this.list.length + 1);
                }
                // 加载状态结束
                this.loading = false;

                // 数据全部加载完成
                if (this.list.length >= 40) {
                    this.finished = true;
                }
            }, 500);
        },
        loadList() {
            Http.send(
                {
                    api_name: "kyk.richLandlord.pointsList",
                    first_row: this.page,
                    fetch_num: this.pageSize
                },
                res => {
                    if (res.code == 0) {
                        console.log("res:", res);
                        this.isLoading = true;
                        // this.page++;
                        // this.total = this.page*this.pageSize;
                        // console.log(this.page, this.total);
                        let data = [
                            {
                                name: "小爱同学",
                                gradeName: "星级庄主",
                                fansNum: "100",
                                commonFansNum: "20"
                            },
                            {
                                name: "小爱同学",
                                gradeName: "星级庄主",
                                fansNum: "100",
                                commonFansNum: "20"
                            }
                        ];
                        this.list = [...data,...data,...data];
                        this.list = [...this.list,...this.list];
                        // this.list = this.list.concat(data);
                        // if (this.list.length == this.total) {
                        //     // 全部数据加载完成
                        //     this.$refs.infiniteScrollDemo.$emit("loaded","全部数据加载完成");
                        //     return;
                        // }
                        // // 单次请求数据完毕
                        // this.$refs.infiniteScrollDemo.$emit("finished","单次数据请求完毕");
                        console.log(this.list);
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
.scroll {
    .list-box {
        overflow: auto;
    }
}
</style>