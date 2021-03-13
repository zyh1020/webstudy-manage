<template>
    <div class="sysRole">
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 搜索 -->
            <div class="searchCondition">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-input placeholder="请输入角色英文名称" size="medium" v-model="role.name">
                            <template #prepend>ROLE_</template>
                        </el-input>
                    </el-col>
                    <el-col :span="10">
                            <el-input placeholder="请输入角色英文名称" size="medium" v-model="role.nameZh">
                        </el-input>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" size="medium" icon="el-icon-plus"> 添加 </el-button>
                    </el-col>
                </el-row>
            </div>

            <!-- 内容 -->
            <div class="contentRoles">
                <el-table
                        :data="contentRoles"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="id"
                            label="编号">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="英文名称">
                    </el-table-column>
                    <el-table-column
                            prop="nameZh"
                            label="中文名称">
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="180">
                        <el-button type="danger" icon="el-icon-delete" size="mini"/>
                        <el-button type="primary" icon="el-icon-edit" size="mini"/>
                        <el-button type="info" icon="el-icon-s-custom" size="mini"/>
                    </el-table-column>
                </el-table>
            </div>

        </el-card>
    </div>


</template>

<script>
    import {getAllRoles} from '@/api/security/role'

    export default {
        name: "SysRole",
        data(){
            return{
                role:{
                    name:"",
                    nameZh:"",
                },
                contentRoles:[]
            }
        },
        methods:{
            // 获取角色列表
            getRolesList(){
                getAllRoles().then( response =>{
                    if(response){
                        this.contentRoles = response.data;
                    }
                });
            }
        },
        created() {
            // ①，获取角色列表
            this.getRolesList();
        }
    }
</script>

<style scoped>
    .searchCondition{
        width: 50%;
    }
    .contentRoles{
        width: 50%;
        margin-top: 15px;
    }
</style>
