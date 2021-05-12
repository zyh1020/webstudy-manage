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
            <el-button type="primary" @click="addOneLeveMenu">添加菜单</el-button>
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
                        <el-button type="danger"  icon="el-icon-delete" size="mini" @click="deleteMenu(scope.row)"/>
                        <el-button type="primary" icon="el-icon-edit" @click="showUpDateMenu(scope.row)" size="mini"/>
                        <el-button type="primary" @click="showAddMenu(scope.row)" v-if = "scope.row.level != 3" icon="el-icon-plus" size="mini"/>
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
            <el-form ref="form" :model="addOrUpdateMenu" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="父级菜单">
                            <el-input disabled v-model="parentName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单名称">
                            <el-input v-model="addOrUpdateMenu.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="菜单图标">
                            <el-input v-model="addOrUpdateMenu.icon"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="拦截路径">
                            <el-input v-model="addOrUpdateMenu.url"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="组件路径">
                            <el-input v-model="addOrUpdateMenu.path"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组件名称">
                            <el-input v-model="addOrUpdateMenu.component"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="隐藏路由">
                    <el-switch v-model="addOrUpdateMenu.hidden"></el-switch>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="menuDialogShow = false">取 消</el-button>
                  <el-button type="primary" @click="addUpdateMenu">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>

</template>

<script>
    import {getAllAuthority,addOneMenu,updateOneMenu,removeMenu} from '@/api/security/menu'

    export default {
        name: "SysMenu",
        data(){
            return{
                menuDialogShow: false,
                addOrUpdateMenu:{
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
            // 添加一级菜单
            addOneLeveMenu(){
                this.addOrUpdateMenu.parentId = 0;
                this.addOrUpdateMenu.id = null;
                this.parentName = 'Web学习交流平台';
                this.menuDialogShow = true;
            },
            // 添加二级三级菜单弹出框
            showAddMenu(row){
                this.addOrUpdateMenu.parentId = row.id;
                this.addOrUpdateMenu.id = null;
                this.parentName = row.name;
                this.menuDialogShow = true;
            },
            // 修改弹框
            showUpDateMenu(menu){
                if(menu.parentId == 0){
                    this.parentName = 'Web学习交流平台';
                }
                this.addOrUpdateMenu = menu;
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
            },
            // 添加
            addMenu(){
                addOneMenu(this.addOrUpdateMenu).then(response =>{
                    if(response){
                        // ①，获取所有的菜单
                        this.getAuthorityList();
                        this.menuDialogShow = false;
                    }
                });
            },
            // 修改
            updateMenu(){
                updateOneMenu(this.addOrUpdateMenu).then(response => {
                    if(response){
                        // ①，获取所有的菜单
                        this.getAuthorityList();
                        this.menuDialogShow = false;
                    }
                })
            },
            // 删除菜单
            deleteMenu(menu){
                this.$confirm('此操作将永久删除<'+menu.name+'> 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeMenu(menu.id).then(response =>{
                        if(response){
                            // ①，获取所有的菜单
                            this.getAuthorityList();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 添加或修改
            addUpdateMenu(){
                if(this.addOrUpdateMenu.id != null){ // 修改
                    this.updateMenu();
                }else{ // 添加
                    this.addMenu();
                }
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
