<template>
    <div class="login">
        <div class="login_box"
             v-loading="loading"
             element-loading-text="正在登录"
             element-loading-spinner="el-icon-loading"
             element-loading-background="rgba(0, 0, 0, 0.8)">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" >
            </div>
            <!-- 登录表单区域 -->
            <el-form label-width="0px"
                     ref="loginFrormRef"
                     :model="loginForm"
                     :rules="loginFormRules"
                     class="login_from">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user-line" v-model="loginForm.username"/>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-suo" v-model="loginForm.password" type="password"/>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="userLogin">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {login} from '@/api/login'

    export default {
        name: "Login",
        data(){
            return{
                loading: false,
                loginForm:{
                    username:'admin',
                    password:'123456'
                },
                loginFormRules:{
                    username:[
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password:[
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 6, message: '长度在 3 到 6  个字符', trigger: 'blur' }
                    ]

                }

            }
        },
        methods: {
            userLogin(){
                this.$refs.loginFrormRef.validate((valid)=>{
                    if (valid) {
                        this.loading = true;
                        // 登录
                        login(this.loginForm).then( response => {
                              if(response){
                                let token =  response.data;
                                window.sessionStorage.setItem("token",token);
                                let path = this.$route.query.redirect;
                                if(path == undefined || path == "/"){
                                    this.$router.replace('/home');
                                }else{
                                    this.$router.replace(path);
                                }

                              }
                            this.loading = false;
                        });

                    } else {
                        this.$message({
                            message: '警告哦，请填写正确的表单内容',
                            type: 'warning'
                        });
                        return false;
                    }
                });

            },
            resetLoginForm(){
                // 重置表单验证
                this.$refs.loginFrormRef.resetFields();
                // 重置表单数据
                this.loginForm.username="admin";
                this.loginForm.password="123456";
            }
        }
    }
</script>

<style scoped>
    .login{
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50% );

    }
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;


    }
    .avatar_box img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
    }
    .login_from{
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;

    }
    .btns{
        display: flex;
        justify-content: flex-end;
    }
</style>
