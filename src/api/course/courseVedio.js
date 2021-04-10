import request from '@/utils/request'

export function addOneVedio(params) { // 添加小节
    return request({
        url: '/cou/vedio/addVedio',
        method: 'post',
        data: params
    });
}


export function deleteAliyunVedio(vedioId) { // 删除视频
    return request({
        url: '/ali/vedio/deleteVedio/'+vedioId,
        method: 'get',
    });
}
