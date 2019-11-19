import Vue from "vue";
import Toast from "./Toast.vue";

const ToastBox = Vue.extend(Toast); // 创建一个组件

// 
Toast.install = function (data) {
    let instance = new ToastBox({
        data
    }).$mount(); 

    document.body.appendChild(instance.$el);
    
    Vue.nextTick(() => {
        instance.show = true;
        setTimeout(() => {
            instance.show = false;
        },instance.timeout)
        // show 和弹窗组件里的show对应，用于控制显隐
    })
}

export default Toast;