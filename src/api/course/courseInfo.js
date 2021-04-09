import request from '@/utils/request'

export function addOneCourseInfo(params) { // 添加课程
    return request({
        url: '/cou/info/addCourse',
        method: 'post',
        data: params
    });
}


export function findOneCourseInfo(courseId) { // 查询课程
    return request({
        url: '/cou/info/findCourse/'+courseId,
        method: 'get'
    });
}
