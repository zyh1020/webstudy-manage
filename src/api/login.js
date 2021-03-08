import request from '@/utils/request'

// 登录请求
export function login(params){
    return request({
        url: '/user/login',
        method: 'post',
        data: params
    });
}

// 获取用户信息
export function getUserInfo(params){
    return request({
        url: '/user/login',
        method: 'get',
    });
}
