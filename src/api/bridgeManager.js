import Native from "./native";
import {
  BridgeCmd
} from "./globalConst";
import Global from "../api/global";
// console.log(BridgeCmd);
// 跟app的交互用 jsbridge，app可以调用js注册给app的方法，js可以调用app提供的方法
// 安卓
// function androidSetWebViewJavascriptBridge(callback) {
//     if (window.WebViewJavascriptBridge) {
//         callback(WebViewJavascriptBridge)
//     } else {
//         console.log("没有WebViewJavascriptBridge对象，等回调");
//         document.addEventListener(
//             'WebViewJavascriptBridgeReady',
//             function () {
//                 callback(WebViewJavascriptBridge)
//             },
//             false
//         );
//     }
// }
// // ios
// function iosSetWebViewJavascriptBridge(callback) {
//     if (window.WebViewJavascriptBridge) {
//         console.log("ios有WebViewJavascriptBridge对象")
//         return callback(WebViewJavascriptBridge);
//     }
//     if (window.WVJBCallbacks) {
//         console.log("ios没有WebViewJavascriptBridge对象,WVJBCallbacks事件回调")
//         return window.WVJBCallbacks.push(callback);
//     }
//     window.WVJBCallbacks = [callback];
//     var WVJBIframe = document.createElement('iframe');
//     WVJBIframe.style.display = 'none';
//     WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
//     document.documentElement.appendChild(WVJBIframe);
//     setTimeout(function () {
//         document.documentElement.removeChild(WVJBIframe)
//     }, 0)
// }

function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    return callback(window.WebViewJavascriptBridge);
  } else {
    console.log("没有WebViewJavascriptBridge对象，等回调");
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      () => {
        callback(window.WebViewJavascriptBridge);
      },
      false
    );
  }
}
/**
 * @param 调用原生方法
 * @param {String} name 原生注册的方法名/ios跳转的前缀
 * @param {Object} androidParam android注册的方法参数
 * @param {String} iosParam ios/小程序字符串参数， 例如: ?id=123&name=xiaoai
 * @param {String} link 外部链接 例如: https://www.baidu.com/
 * @param
 * @param {Function} callback 回调函数
 */
function CallBridge(name, androidParam, iosParam, link, type, callback) {
  console.log("name:", name, "androidParam:", androidParam, "iosParam:", iosParam, "link:", link);
  if (!Native.is_wechat()) {
    if (Native.is_android()) {
      console.log("Android:", name, "androidParam:", androidParam);
      setupWebViewJavascriptBridge(bridge => {
        console.log("WebViewJavascriptBridge对象", bridge);
        bridge.callHandler(name, androidParam, callback);
      });
    } else if (Native.is_ios()) {
      if (type == 1) {
        window.location.href = `jsmp://page=${name}${iosParam}`;
        console.log("iosUrl:", `jsmp://page=${name}${iosParam}`);
      } else {
        // console.log(`jsmp://page=${name}?dyd_url=${Global.root}inline_frame/alliance-activity/#/${iosParam}`); // myfans&title=wode
        let str = `${Global.root}/inline_frame/alliance-activity/#/`;
        let midStr = iosParam.split("&");
        console.log(Global.access_token);
          // str = encodeURIComponent(`${str}${midStr[0]}`);
          str = encodeURIComponent(`${str}${midStr[0]}?access_token=${Global.access_token}`);
        console.log("aaa",`jsmp://page=${name}?dyd_url=${str}&${midStr[1]}`)
        window.location.href = `jsmp://page=${name}?dyd_url=${str}&${midStr[1]}`;
      }
    }
  }

  wx.miniProgram.getEnv(res => {
    if (res.miniprogram) {
      console.log("wixinUrlName:", name);
      if (name == BridgeCmd.DYD_WITHDRAW) {
        // 提现
        wx.miniProgram.navigateTo({
          url: `/pages/User/pages/withdraw/withdraw`
        });
      } else if (name == BridgeCmd.DYD_CUSTOMER_SERVICE) {
        // 客服
        wx.miniProgram.navigateTo({
          url: "/pages/User/pages/giveHelp/giveHelp"
        });
      } 
      else if (name == BridgeCmd.DYD_REDPACKET_SHARE) {
        // 红包分享
        wx.miniProgram.navigateTo({
          url: `/pages/Body/pages/poster/poster?type=share_red_bag` 
        });
      } 
      else if (name == BridgeCmd.DYD_SHARE) {
        // 二维码分享
        wx.miniProgram.navigateTo({
          url: `/pages/User/pages/myCode/myCode` 
        });
      } 
      else {
        console.log("link:",link);
        window.location.href = link;
      }
    }
  });
}

// 接受方法(提供给原生调用)
function RegisterBridge(name, callback) {
  if (Native.is_android()) {
    setupWebViewJavascriptBridge(bridge => {
      bridge.registerHandler(name, (data, responseCallback) => {
        callback(data, responseCallback);
      });
    });
  } else if (Native.is_ios()) {
    console.log("ios");
  } else if (Native.is_wechat()) {
    console.log("weixin");
  }
}
/**
 * 注册方法供原生调用 ==> Bridge.RegisterBridge
 * 调用原生的方法 ==> Bridge.CallBridge
 * */

// Bridge.RegisterBridge("receiveback", (data, responseCallback) => {
//   console.log("原生成功调用js方法");
//   if (responseCallback) {
//     var responseData = "Javascript Says Right back aka!";
//     responseCallback(responseData);
//   }
// })

// Bridge.RegisterBridge("receiveback", (data, responseCallback) => {
//   console.log("原生成功调用js方法");
//   Bridge.CallBridge("dadback", {
//     id: 136
//   }, "id=136", "", () => {
//     console.log("js成功调用原生的返回键方法");
//   })
//   if (responseCallback) {
//     var responseData = "Javascript Says Right back aka!";
//     responseCallback(responseData);
//   }
// })

// Bridge.CallBridge("daydetail", {
//   id: 136
// }, "id=136", "", () => {
//   console.log("js成功调用原生的方法");
// })

/**
 * @param jsBridge对象
 * */
export default {
  /**
   * h5注册方法提供原生调用
   * @param {String} name js方法名
   * @param {Function} callBack 回调函数
   * */
  RegisterBridge: function (name, callback) {
    return RegisterBridge(name, callback);
  },
  /**
   * @param 调用原生方法
   * @param {String} name 原生注册的方法名/ios跳转的前缀
   * @param {Object} androidParam android注册的方法参数
   * @param {String} iosParam ios/小程序字符串参数， 例如: ?id=123&name=xiaoai
   * @param {String} link 外部链接 例如: https://www.baidu.com/
   * @param {Function} callback 回调函数
   */
  CallBridge: function (name, androidParam, iosParam, link, callback) {
    return CallBridge(name, androidParam, iosParam, link, callback);
  }
};