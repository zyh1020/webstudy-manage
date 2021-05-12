import request from '@/utils/request'

export function addOneCourseInfo(params) { // 添加课程
    return request({
        url: '/cou/info/addCourse',
        method: 'post',
        data: params
    });
}
export function findCourseList(current,limit,course){ // 查询课程列表
    return request({
        url: `/cou/info/findPageCourse/${current}/${limit}/0`,
        method: 'post',
        data:course
    });
}

export function updateCourseStatus(courseId,status){ // 修改课程状态
    return request({
        url: `/cou/info/updateCourseStatus/${courseId}/${status}`,
        method: 'get'
    });
}

export function findOneCourseInfo(courseId) { // 查询课程
    return request({
        url: '/cou/info/findCourse/'+courseId,
        method: 'get'
    });
}


export function deleteOneCourse(courseId) { // 删除课程信息
    return request({
        url: '/cou/info/deleteCourse/'+courseId,
        method: 'get'
    });
}


export function updateOneCourseInfo(updateCourse) { // 修改课程信息
    return request({
        url: '/cou/info/updateCourse',
        method: 'post',
        data: updateCourse
    });
}

