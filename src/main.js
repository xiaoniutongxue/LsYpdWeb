import Vue from 'vue'
import App from './App.vue'

import router from "./router"                  /*引入路由*/
import Element from 'element-ui'               /*引入Element ui组件*/
import 'element-ui/lib/theme-chalk/index.css'   /*引入Element ui样式*/
import axios from 'axios'                      /*引入axios*/


Vue.config.productionTip = false;
Vue.use(Element);                             /*使用Element ui*/

/*定义全局变量*/
Vue.prototype.IP ="http://192.168.2.55:5000";   /*访问的ip地址*/
Vue.prototype.$axios = axios;     /*异步请求*/

new Vue({
  Element,
  router,
  render: h => h(App),
}).$mount('#app')
