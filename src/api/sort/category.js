import request from '@/utils/request'

export function getAllCategory(){ // 查询所有分类 树型
    return request({
        url: '/sort/category/findAll',
        method: 'get'
    });
}


export function getAllCategoryList(){ // 查询所有分类 列表
    return request({
        url: '/sort/category/findAllList',
        method: 'get'
    });
}

export function addCategory(params){ // 添加分类
    return request({
        url: '/sort/category/addOneCategory',
        method: 'post',
        data: params
    });
}


export function deleteCategory(params){ // 删除分类
    return request({
        url: '/sort/category/deleteOneCategory',
        method: 'post',
        data: params
    });
}

export function updateCategory(params){ // 修改分类
    return request({
        url: '/sort/category/updateCategory',
        method: 'post',
        data: params
    });
}

