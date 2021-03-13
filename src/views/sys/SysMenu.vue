<template>
    <div class="sysMenu">
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 树型表格 -->
            <el-table
                    default-expand-all
                    :data="treeMenusDatas"
                    row-key="id"
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column
                        prop="name"
                        label="菜单名称">
                </el-table-column>
                <el-table-column
                        label="菜单级别"
                        width="80px">
                    <template #default="scope">
                        <el-tag v-if = "scope.row.level ==1 ">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level ==2 ">二级</el-tag>
                        <el-tag type="warning" v-else="scope.row.level ==2 ">三级</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="url"
                        label="拦截路径">
                </el-table-column>
                <el-table-column
                        prop="path"
                        label="组件路径">
                </el-table-column>
                <el-table-column
                        prop="component"
                        label="对应组件">
                </el-table-column>
                <el-table-column
                        label="是否隐藏">
                    <template #default="scope">
                        {{scope.row.hidden ? '隐藏':'显示'}}
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template #default="scope">
                        <el-button type="danger"  icon="el-icon-delete" size="mini"/>
                        <el-button type="primary" icon="el-icon-edit" size="mini"/>
                        <el-button type="primary" v-if = "scope.row.level != 3"icon="el-icon-plus" size="mini"/>
                    </template>

                </el-table-column>
            </el-table>
        </el-card>
    </div>

</template>

<script>
    import {getAllAuthority} from '@/api/security/menu'

    export default {
        name: "SysMenu",
        data(){
            return{
                treeMenusDatas:[]
            }
        },
        methods:{
            // 获取所有的菜单
            getAuthorityList(){
                // 调用后台接口
                getAllAuthority().then(response =>{
                    if(response){
                        this.treeMenusDatas =response.data;
                    }
                });
            }
        },
        created(){
            // ①，获取所有的菜单
            this.getAuthorityList();
        }
    }
</script>

<style scoped>

</style>
