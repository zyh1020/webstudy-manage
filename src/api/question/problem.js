import request from '@/utils/request'

export function findPageProbelms(currentPage,size,params) { // 分页查询问题列表
    return request({
        url: `/com/pro/findPageProblem/${currentPage}/${size}`,
        method: 'post',
        data: params
    });
}
export function deleteOneProblem(problemId){ // 删除问题
    return request({
        url: '/com/pro/deleteOneProblem/'+problemId,
        method: 'get'
    });
}

export function updateOneProblem(problem){ // 修改问题
    return request({
        url: '/com/pro/updateOneProblem',
        method: 'post',
        data:problem
    });
}
export function addOneProblem(problem){ // 添加问题
    return request({
        url: '/com/pro/addOneProblem',
        method: 'post',
        data:problem
    });
}
