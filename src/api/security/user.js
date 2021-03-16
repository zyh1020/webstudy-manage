import request from '@/utils/request'

// 获取用户
export function getAllUsers(){
    return request({
        url: '/system/users/getAllUser',
        method: 'get'
    });
}
