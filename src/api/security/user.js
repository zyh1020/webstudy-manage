import request from '@/utils/request'
import qs from "qs";

// 获取用户
export function getAllUsers(){
    return request({
        url: '/system/users/getAllUser',
        method: 'get'
    });
}

// 为用户分配角色
export function distributionRoles(userId,rolesId){
    return request.post('/system/users/distributionRoles',
        qs.stringify({userId,rolesId}, { indices: false })
    );
}
