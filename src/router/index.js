import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/Welcome'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/welcome',
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/home',
        name: '首页',
        component: Home,
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            name: '欢迎',
            component: Welcome
        }]
    }
];

const router = new VueRouter({
    routes,
    mode: 'history'
});

export default router
