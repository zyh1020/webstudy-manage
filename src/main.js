import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
/* 导入全局样式表 */
import './assets/css/global.css'
/* 引入阿里巴巴 矢量图标*/
import './assets/font/iconfont.css'
import '@/permission' // 权限
Vue.config.productionTip = false

// 引入elementUI
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
