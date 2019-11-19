import ScrollView from "./ScrollView.vue";

const scrollView = {
    install (Vue) {
        Vue.component("dyd-scroll-view", ScrollView);
    }
}

export default scrollView;