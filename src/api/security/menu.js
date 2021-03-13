import request from '@/utils/request'

// 获取菜单
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

// 格式化菜单
export function formatRoutes(routers){
    let fmtRouters = [];
    routers.forEach(router=>{
        let{
            path,
            component,
            name,
            icon,
            children
        } = router;
        if(children && children instanceof Array){
            children = formatRoutes(children);// 递归
        }
        let fmtRouter = {
            path:path,
            name:name,
            icon:icon,
            children:children,
            component(resolve){
                require(['@/views' + component + '.vue'], resolve);
            }
        };
        fmtRouters.push(fmtRouter);
    });
    return fmtRouters;
}
