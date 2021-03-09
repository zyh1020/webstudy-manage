<template>
    <div class="home">
        <el-container>
            <!-- 头部 -->
            <el-header class="homeHeard">
                <div class="heardTitle">
                    web学习交流平台
                </div>
                <el-dropdown class="userInfo">
                    <span class="el-dropdown-link userName">
                      {{user.username}}
                        <i><img :src="user.userAvatar"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item>个人中心</el-dropdown-item>
                            <el-dropdown-item>退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 内容 -->
            <el-container>
                <!-- 1，内容侧边 -->
                <el-aside width="200px">
                    <el-menu router unique-opened>
                        <el-submenu :index="pIndex+''"
                                    v-for="(pMenus,pIndex) in routers"
                                    :key="pIndex"
                                    v-if="!pMenus.hidden">
                            <template slot="title">
                                <i class="el-icon-message"></i>
                                <span>{{pMenus.name}}</span>
                            </template>

                            <el-menu-item :index="cMenus.path"
                                          v-for="(cMenus,cIndex) in pMenus.children"
                                          :key="cIndex"
                                          v-if="!pMenus.hidden">
                                          {{cMenus.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!-- 1，内容主体 -->
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import {getUserInfo} from "@/api/login"
    export default {
        name: "Home",
        computed:{
            routers(){
                return this.$store.state.routers;
            }
        },
        data(){
            return{
                user:{}
            }
        },
        methods:{
            //获取用户信息
            getUserInfo(){
                let userInfo = window.sessionStorage.getItem("user");
                if(userInfo){
                    this.user = JSON.parse(userInfo);
                }else{ // 请求
                    getUserInfo().then(response =>{
                        if(response){
                            this.user = response.data;
                            window.sessionStorage.setItem("user",JSON.stringify(response.data));
                        }
                    });

                }
            }
        },
        created() {
            // ①，获取用户信息
            this.getUserInfo();
        }
    }
</script>

<style>
    .homeHeard{
        background-color: #696969;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
    }
    .heardTitle{
        font-size: 23px;
        font-family: 华文楷体;
        color: #ffff;
    }
    .userInfo{
        cursor:pointer;
    }
    .userName{
        color: #ffff;
        font-size: 20px;
        font-family: 华文楷体;
    }
    .userName img{
        height: 48px;
        width:  48px;
        border-radius: 50%;
        margin-left: 8px;
        margin-right: 10px;
    }
</style>
