import Vue from 'vue'
import Vuex from 'vuex'

import {getMenus,formatRoutes} from '@/api/security/menu'
// ①，使用插件
Vue.use(Vuex);

// ②，创建对象
const store = new Vuex.Store({
    state:{
        routers: [], // 路由数组
    },
    mutations:{
        // 初始化路由数组
        changeRouters(state,data){
            state.routers = data;
        }
    },
    actions:{
        async generateRoutes({ commit }){
            // 获取后台路由
            const asyncRouter = await getMenus();
            return new Promise(resolve => {
                const tmp = asyncRouter.data;
                const accessedRoutes = formatRoutes(tmp);
                commit('changeRouters', accessedRoutes);
                resolve(accessedRoutes);
            })

        }
    }


});

//③，导出插件
export default store;
