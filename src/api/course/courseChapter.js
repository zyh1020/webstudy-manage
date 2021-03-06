import request from '@/utils/request'

export function addOneCapter(params) { // 添加章节
    return request({
        url: '/cou/capter/addCapter',
        method: 'post',
        data: params
    });
}

export function findOneCourseAllCapter(courseId) { // 查询某个课程的所有章节
    return request({
        url: '/cou/capter/findCapters/'+courseId,
        method: 'get'
    });
}


export function updateOneCapter(params) { // 修改章节
    return request({
        url: '/cou/capter/updateOneCapter',
        method: 'post',
        data: params
    });
}

export function deleteOneCapter(capterId) { // 查询某个课程的所有章节
    return request({
        url: '/cou/capter/deleteOneCapter/'+capterId,
        method: 'get'
    });
}

