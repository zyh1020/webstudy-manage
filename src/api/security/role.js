import request from '@/utils/request'

// 获取菜单
export function getAllRoles(){
    return request({
        url: '/system/roles/getAllRoles',
        method: 'get'
    });
}
