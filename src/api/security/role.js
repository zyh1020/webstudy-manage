import request from '@/utils/request'

// 获取所有角色包含菜单
export function getAllRoles(){
    return request({
        url: '/system/roles/getAllRoles',
        method: 'get'
    });
}


// 获取所有角色不包含菜单
export function findAllRoles(){
    return request({
        url: '/system/roles/findAllRoles',
        method: 'get'
    });
}
