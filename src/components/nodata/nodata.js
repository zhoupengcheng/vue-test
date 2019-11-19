import NodataComponents from "./Nodata.vue";

const nodata = {
    install: function (Vue) {
        Vue.component("dyd-no-data", NodataComponents);
    }
}

export default nodata;