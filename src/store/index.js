import Vue from 'vue'
import Vuex from 'vuex'

// ①，使用插件
Vue.use(Vuex);

// ②，创建对象
const store = new Vuex.Store({
    state:{
        routers: [], // 路由数组
    },
    mutations:{
        // 初始化路由数组
        initRouters(state,data){
            state.routers = data;
        }
    }

});

//③，导出插件
export default store;
