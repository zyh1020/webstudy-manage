import axios from 'axios'
import {Message} from 'element-ui'
import router from '../router'

// 创建axios实例
const service = axios.create({
    baseURL: '/api', // base_url
    timeout: 20000 // 请求超时时间
});

// 请求拦截
service.interceptors.request.use(config =>{
    let token = window.sessionStorage.getItem('token');
    if(token){
        config.headers['token'] = token; // 添加请求头信息
    }
    return config;
},error => {
    Message.error({message:'请求发送失败！'});
});


// 响应拦截
service.interceptors.response.use( success =>{
    if(success.status && success.status == 200){ // 请求成功
        if(!success.data.success){// 业务逻辑错误
            Message.error({message:success.data.message});
            return;
        }else {// 业务逻辑正确
            if(success.data.message){
                Message.success({message:success.data.message});
            }
        }
    }
    return success.data;
},error => {
    if(error.response.code == 504 || error.response.code == 404){
        Message.error({message:'服务器被吃了！'});
    }else if(error.response.code == 403){
        Message.error({message:'权限不足！'});
    }else if(error.response.code == 401){
        Message.error({message:'尚未登录，请登录！'});
        router.replace("/");
    }else{
        if(error.response.data.message){
            Message.error({message:error.response.data.message});
        }else {
            Message.error({message:'未知错误！'});
        }
    }

});
export default service
