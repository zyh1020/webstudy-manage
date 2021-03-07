import router from './router'
import store from './store'
import { Message } from 'element-ui'

import {getMenus,formatRoutes} from '@/api/security/menu'

const whiteList = ['/login']; // 免登录白名单;

// 导航守卫
router.beforeEach((to, from, next) => {

  // ①，判断用户是否登录
  if(window.sessionStorage.getItem("token")){ // 登录
      console.log("登录成功!");
      // ②，判断路由是否已经存在了，目的是减少访问后端次数
     if(store.state.routers.length > 0){ // 存在
       console.log("路由以存在成功!");
       next();
     }else{ // 不存在,根据用户获取菜单
      getMenus().then(response =>{
          if(response){
            let menus = response.data; // 得到菜单
            console.log("路由不存在成功，获取菜单成功!"+JSON.stringify(menus));
            let routers = formatRoutes(menus); // 转换为组件形式
            console.log("路由转换为组件形式成功!"+JSON.stringify(routers));
            router.addRoutes(routers);// 动态添加可访问的路由
            store.commit('initRouters',routers); // 存储在vuex中
          }
       });
       next();
     }
  }else{ // 未登录
    if(whiteList.indexOf(to.path) !== -1){ // 访问免登录白名单
      console.log("登录白名单!");
      next();
    }else{  // 未登录且访问不是免登录白名单
      Message.error({message:'尚未登录,请登录！'});
      next(`/login?redirect=${to.path}`);// 没重定向到登录页面，并传递参数，想要访问的页面。
    }
  }

});
