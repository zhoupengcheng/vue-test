import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {name: "home"}
    // redirect: {name: "scroll-demo"}
    // redirect: {name: "my-fans"}
    // redirect: {name: "my-integral"}
    // redirect: {name: "integral-detail"}
    // redirect: {name: "personal-info"}
    // redirect: {name: "demo"}
  },
  // {
  //   path: "/scrolldemo",
  //   name: "scroll-demo",
  //   component: () =>
  //     import(/* webpackChunkName: "scrolldemo" */ "../views/ScrollDemo.vue")
  // },
  {
    path: "/home",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/Home.vue")
  },
  {
    path: "/myfans",
    name: "my-fans",
    component: () =>
      import(/* webpackChunkName: "myfans" */ "../views/MyFans.vue")
  },
  {
    path: "/myintegral",
    name: "my-integral",
    component: () =>
      import(/* webpackChunkName: "myintegral" */ "../views/MyIntegral.vue")
  },
  {
    path: "/personalinfo",
    name: "personal-info",
    component: () =>
      import(/* webpackChunkName: "personalinfo" */ "../views/PersonalInfo.vue")
  },
  {
    path: "/integraldetail",
    name: "integral-detail",
    component: () =>
      import(/* webpackChunkName: "integraldetail" */ "../views/IntegralDetail.vue")
  },
  {
    path: "/todaynewfans",
    name: "new-fans",
    component: () =>
      import(/* webpackChunkName: "todaynewfans" */ "../views/TodayNewFans.vue")
  }
];

const router = new VueRouter({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes
});

export default router;
