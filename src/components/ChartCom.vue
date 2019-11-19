<template>
    <div class="chart">
        <ve-line :data="chartData"></ve-line>
    </div>
</template>

<script>
import VeLine from "v-charts/lib/line.common";
export default {
    name: "chart",
    data() {
        return {};
    },
    components: {
        VeLine
    },
    props: {
        chartData: {
            type: Object,
            default: {}
        }
    },
    created() {},
    mounted() {},
    computed: {},
    methods: {}
};
</script>
<style lang='less' scoped>
.chart {
    background: #fff;
    border-radius: 0.12rem;
    -webkit-border-radius: 0.12rem;
    -moz-border-radius: 0.12rem;
}
</style>