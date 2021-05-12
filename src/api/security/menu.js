import request from '@/utils/request'

// 获取用户具有的菜单
export function getMenus(){
    return request({
        url: '/system/menus/getMenusByUserId',
        method: 'get'
    });
}

// 获取所有的权限
export function  getAllAuthority(){
    return request({
        url: '/system/menus/getAllAuthority',
        method: 'get'
    });
}
// 添加菜单
export function  addOneMenu(menu){
    return request({
        url: '/system/menus/addOneMenu',
        method: 'post',
        data: menu
    });
}

export function  removeMenu(mId){
    return request({
        url: '/system/menus/removeMenu/'+mId,
        method: 'get'
    });
}

// 删除菜单

// 修改菜单
export function  updateOneMenu(menu){
    return request({
        url: '/system/menus/updateOneMenu',
        method: 'post',
        data: menu
    });
}

// 格式化菜单
export function formatRoutes(routers){
    let fmtRouters = [];
    routers.forEach(router=>{
        let{
            path,
            component,
            name,
            icon,
            hidden,
            children
        } = router;
        if(children && children instanceof Array){
            children = formatRoutes(children);// 递归
        }
        let fmtRouter = {
            path:path,
            name:name,
            icon:icon,
            hidden:hidden,
            children:children,
            component(resolve){
                    require(['@/views' + component + '.vue'], resolve);
            }
        };

        fmtRouters.push(fmtRouter);
    });
    return fmtRouters;
}
