import request from '@/utils/request'
import qs from "qs";

// 获取用户
export function getAllUsers(userName){
    return request({
        url: '/system/users/getAllUser/'+userName,
        method: 'get',
    });
}

// 为用户分配角色
export function distributionRoles(userId,rolesId){
    return request.post('/system/users/distributionRoles',
        qs.stringify({userId,rolesId}, { indices: false })
    );
}

// 禁用或启用用户
export function setUserState(userId,state){
    return request({
        url:`/system/users/setUserState/${userId}/${state}`,
        method: 'get',
    });
}


// 删除用户
export function deleteOneUser(userId){
    return request({
        url:`/system/users/deleteOneUser/${userId}`,
        method: 'get',
    });
}
