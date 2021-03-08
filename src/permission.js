import router from './router'
import store from './store'
import { Message } from 'element-ui'


const whiteList = ['/login']; // 免登录白名单;

// 导航守卫
router.beforeEach(async(to, from, next) => {
    console.log("访问的路径："+to.path);
  // ①，判断用户是否登录
  if(window.sessionStorage.getItem("token")){ // 登录
      // ②，判断路由是否已经存在了，目的是减少访问后端次数
     if(store.state.routers.length > 0){ //存在放行
         next();
     }else { // 不存在,获取用户菜单
         const accessRoutes =  await store.dispatch("generateRoutes");
         console.log("accessRoutes:"+JSON.stringify(accessRoutes));
         router.addRoutes(accessRoutes);// 动态添加可访问的路由
         next({ ...to, replace: true })
     }

     // ③，获用户的登录信息


  }else{ // 未登录
    if(whiteList.indexOf(to.path) !== -1){ // 访问免登录白名单
      next();
    }else{  // 未登录且访问不是免登录白名单
      Message.error({message:'尚未登录,请登录！'});
      next(`/login?redirect=${to.path}`);// 没重定向到登录页面，并传递参数，想要访问的页面。
    }
  }

});
