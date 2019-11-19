export default {
  // 判断是否 ios
  is_ios: function is_ios() {
    let browserName = navigator.userAgent.toLowerCase();
    return /(iphone|ipod|ipad)/i.test(browserName);
  },
  // 判断是否 安卓
  is_android: function is_android() {
    let browserName = navigator.userAgent.toLowerCase();
    return /(android)/i.test(browserName);
  },
  // 判断是否 微信浏览器
  is_wechat: function is_wechat() {
    let browserName = navigator.userAgent.toLowerCase();
    return /(MicroMessenger)/i.test(browserName);
  },
  is_android_not_wechat() {
    let browserName = navigator.userAgent.toLowerCase();
    return /(android)/i.test(browserName) && !/(MicroMessenger)/i.test(browserName);
  }
};
