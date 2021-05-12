import request from '@/utils/request'

import qs from 'qs' // 格式化数组类型

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


// 为角色分配菜单
export function doAssion(roleId,menusId){
     return request.post('/system/roles/doAssion',
        qs.stringify({roleId,menusId}, { indices: false })
    );
}


// 删除角色权限
export function deleteAssion(roleId,menuId) {
    return request.get('/system/roles/deleteAssion',{
        params:{
            roleId:roleId,
            menuId:menuId
        }
    })
}


// 添加角色信息
export function addOneRole(role) {
    return request({
        url: '/system/roles/addOneRole',
        method: 'post',
        data:role
    });
}


// 修改角色信息
export function updateOneRole(role) {
    return request({
        url: '/system/roles/updateOneRole',
        method: 'post',
        data:role
    });
}
// 删除角色信息
export function deleteOneRole(roleId) {
    return request({
        url: '/system/roles/deleteOneRole/'+roleId,
        method: 'get'
    });
}
