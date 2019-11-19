<template>
    <!-- 日历选择 -->
    <div class="calendar-com">
        <Calendar
            @:chose_day="clickday"
            @:is_today="clicktoday"
            @:change_month="change_date"
            :mark_array="[1,2]"
            :is_hide_otherday="false"
        ></Calendar>
    </div>
</template>

<script>
export default {
    name: "calendar-com",
    data() {
        return {};
    },
    components: {
        Calendar
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {
        clickday(data) {
            console.log(data); //选中某天
        },
        change_date(data) {
            console.log(data); //左右点击切换月份
        },
        clicktoday(data) {
            console.log(data); //切换月份的时候，如果切到当前月份,调用这个方法
        }
    }
};
</script>
<style lang='less' scoped>
</style>