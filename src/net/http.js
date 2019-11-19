let qs = require("querystring"); // qs序列化，解决data传参，后台无法接受的问题
import axios from "axios";
import Md5 from "./md5";
import {
  getUrl,
  getParam
} from "../tools/index";
import Global from "../api/global";
// "http://test.51k1k.com/inline_frame/alliance-activity/#/home"
// "http://test.51k1k.com/inline_frame/alliance-activity/#/myfans"
const link = {
  public: "http://app.51k1k.com/inline_frame/alliance-activity/#/home",
  beta: "http://beta.test.51k1k.com/inline_frame/alliance-activity/#/home",
  test: "http://test.51k1k.com/inline_frame/alliance-activity/#/home?access_token=shopping:login_user_439734888ceeee78dcb8681156ef5a80"
};
// let root = "";
let param = null;
if (Global.DebugType == "develop") {
  // root = getUrl(link.public);
  // param = getParam(link.public);
  // root = getUrl(link.beta);
  // param = getParam(link.beta);
  Global.root = getUrl(link.test);
  param = getParam(link.test);
} else {
  Global.root = getUrl(window.location.href);
  param = getParam(window.location.href);
}
console.log("root:",Global.root);
let {
  access_token,
} = param;
Global.access_token = access_token;
console.log(param, Global.access_token);
// Global.page_id = page_id;
// access_token = "shopping:login_user_439734888ceeee78dcb8681156ef5a80";

function apiAxios(params, success, method) {
  var time = new Date().getTime() / 1000;
  params.appid = "1";
  params.token = "eb86fa064482989312e2a1557ddb4032";
  params.access_token = access_token;
  params.os = "wx";
  params.app_version = "1.0";
  params.channel_id = "0";
  params.time = time;
  params.sign = Md5.hex_md5(
    access_token + time + "ijJeFyo0U2fOBEd0olKBUx8zWcgIo68d"
  );
  // http请求拦截
  // axios.interceptors.request.use(config => {
  //   // TODO loading开始
  //   Global.loadVis = true;
  //   // console.log("vis",Global.loadVis);
  //   return config;
  // },err => {
  //   return Promise.reject(err);
  // })
  // http响应拦截
  // axios.interceptors.response.use(res => {
  //   // TODO loading结束
  //   Global.loadVis = false;
  //   // console.log("vis",Global.loadVis);
  //   return res;
  // },err => {
  //   return Promise.reject(err);
  // })
  console.log("root:",Global.root);
  axios({
      method: method,
      data: qs.stringify(params),
      url: `${Global.root}api/api`
    })
    .then(res => {
      // console.log("res", res.data);
      success(res.data);
    })
    .catch(err => {
      let res = err.response;
      console.log("err", err);
      if (err) {
        //failure(err)
      }
    });
}
//上传图片
function updata(e, success) {
  let file = e.target.files[0];
  let param = new FormData(); //创建form对象
  param.append("upfile", file, file.name); //通过append向form对象添加数据
  let config = {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  }; //添加请求头
  //    axios.post('http://192.168.9.231:8090/api/uploadImage/appid/1/submit/submit', param, config)
  axios
    .post(
      "http://test.51k1k.com/api/uploadImage/appid/1/submit/submit/os/wx",
      param,
      config
    )
    .then(response => {
      success(response.data);
    });
}

export default {
  send: function (params, success, method = "POST") {
    return apiAxios(params, success, method);
  },
  update: function (e, success) {
    return updata(e, success);
  }
};