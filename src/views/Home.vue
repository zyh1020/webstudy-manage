<template>
    <div class="home">
        <el-container class="homeContainer">
            <!-- 头部 -->
            <el-header class="homeHeard">
                <div class="heardTitle">
                    web学习交流平台
                </div>
                <el-dropdown class="userInfo" @command="handleCommand">
                    <span class="el-dropdown-link userName">
                      {{user.username}}
                        <i><img :src="user.userAvatar"></i>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </el-header>
            <!-- 内容 -->
            <el-container>
                <!-- 1，内容侧边 -->
                <el-aside :width="iscollapse ? '64px':'200px'" class="homeAside">
                    <!-- 折叠和展开 -->
                    <div class="toggleButton" @click="toggleCollapse">|||</div>
                    <el-menu
                            router
                            unique-opened
                            background-color="#545c64"
                            text-color="#fff"
                            :collapse="iscollapse"
                            :collapse-transition="false">
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
                <el-main class="homeMain">
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
                user:{},
                iscollapse: false // 默认不折叠
            }
        },
        methods:{
            // 点击折叠
            toggleCollapse(){
                this.iscollapse = !this.iscollapse;
            },
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
            },
            // 点击不同下拉菜单
            handleCommand(command){
                if("logout" == command){ // 点击了退出
                    this.logout();
                }else if("personal" == command){ // 点击了个人中心

                }else{
                    this.$message({
                        message: '警告哦，这是一个错误的操作',
                        type: 'warning'
                    });
                }

            },
            // 退出的处理
            logout(){
                this.$confirm('确定离开吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除本地的sessionStoragev
                    window.sessionStorage.removeItem("token");
                    window.sessionStorage.removeItem("user");
                    // 删除vuex中的菜单内容
                    this.$store.commit("changeRouters",[]);
                    // 跳转到登录页面
                    this.$router.replace("/login");
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '还好没放弃！'
                    });
                });


            }
        },
        created() {
            // ①，获取用户信息
            this.getUserInfo();
        }
    }
</script>

<style>
    .home{
        height: 100%;
        width: 100%;
    }
    .homeContainer{
        height: 100%;
        width: 100%;
    }
    .homeHeard{
        background-color: #545c64;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 15px;
    }
    .homeAside{
        background-color: #545c64;
        font-family: 华文楷体;
    }
    .homeAside .el-menu{
      border-right: none;
    }
    .toggleButton{
        background-color: #4a5064;
        font-size: 18px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        cursor:pointer;
    }

    .homeMain{
        background-color: #eaedf1;
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
