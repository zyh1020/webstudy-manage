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
                        <el-button type="primary" @click="menuAdd(scope.row)" v-if = "scope.row.level != 3" icon="el-icon-plus" size="mini"/>
                    </template>

                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加菜单对话框 -->
        <el-dialog
                title="添加菜单"
                :visible.sync="menuDialogShow"
                width="50%">
            <!-- 表单 -->
            <el-form ref="form" :model="addMenu" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="父级菜单">
                            <el-input disabled v-model="parentName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单名称">
                            <el-input v-model="addMenu.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="菜单图标">
                            <el-input v-model="addMenu.icon"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="拦截路径">
                            <el-input v-model="addMenu.url"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="组件路径">
                            <el-input v-model="addMenu.path"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组件名称">
                            <el-input v-model="addMenu.component"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="隐藏路由">
                    <el-switch v-model="addMenu.hidden"></el-switch>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="menuDialogShow = false">取 消</el-button>
                  <el-button type="primary" @click="menuDialogShow = false">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>

<script>
    import {getAllAuthority} from '@/api/security/menu'

    export default {
        name: "SysMenu",
        data(){
            return{
                menuDialogShow: false,
                addMenu:{
                    name:'',
                    parentId:'',
                    url:'',
                    path:'',
                    component:'',
                    icon:'',
                    hidden:false,
                    enabled: false
                },
                parentName:'',
                treeMenusDatas:[]
            }
        },
        methods:{
            // 三级菜单弹出框
            menuAdd(row){
                this.addMenu.parentId = row.id;
                this.parentName = row.name;
                this.menuDialogShow = true;
            },
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
