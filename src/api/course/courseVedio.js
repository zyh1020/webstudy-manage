import request from '@/utils/request'

export function addOneVedio(params) { // 添加章节
    return request({
        url: '/cou/vedio/addVedio',
        method: 'post',
        data: params
    });
}
