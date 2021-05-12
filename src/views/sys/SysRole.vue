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
            <!-- 添加角色 -->
            <div class="addRole">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-input placeholder="请输入角色英文名称" size="medium" v-model="name">
                            <template slot="prepend">ROLE_</template>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                            <el-input placeholder="请输入角色英文名称" size="medium" v-model="nameZh"></el-input>
                    </el-col>
                    <el-col :span="8">
                            <el-button v-show="!updateRole" type="primary" size="medium" icon="el-icon-plus" @click="addRole">添加 </el-button>
                            <el-button v-show="updateRole" type="success" size="medium" icon="el-icon-edit" @click="updateOneRole">修改 </el-button>
                    </el-col>
                </el-row>
            </div>
            <!-- 内容 -->
            <div class="contentRoles">
                <el-table
                        :data="contentRoles"
                        stripe
                        style="width: 100%">
                    <!-- 展开行 -->
                    <el-table-column type="expand">
                        <!-- 展开行内容 -->
                        <template slot-scope="scope">
                            <el-row :class="['dbbottom',index1 === 0 ? 'dbtop':'','vcenter']" v-for="(item1,index1) in scope.row.sysMenus" :key="item1.id">
                                <!-- 一级权限 -->
                                <el-col :span="5">
                                    <el-tag closable @close="deleteRoleOfMenus(scope.row,item1)">{{item1.name}} </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <!-- 二级和三级权限 -->
                                <el-col :span="19">
                                    <el-row :class="[index2 === 0 ? '':'dbtop','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
                                        <!-- 二级 -->
                                        <el-col :span="6">
                                            <el-tag type="success" closable @close="deleteRoleOfMenus(scope.row,item2)">{{item2.name}} </el-tag>
                                            <i class="el-icon-caret-right"></i>
                                        </el-col>
                                        <!-- 三级 -->
                                        <el-col :span="18">
                                            <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" closable @close="deleteRoleOfMenus(scope.row,item3)">
                                                {{item3.name}}
                                            </el-tag>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
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
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row)"/>
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showUpdateValue(scope.row)"/>
                            <el-button type="info" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)"/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog
                title="分配权限"
                :visible.sync="showSetRightDialogVisible"
                width="50%"
                @close="closeSetRightDialog">
            <!-- 树型控件 -->
            <el-tree ref ='rightsTree'
                    node-key="id"
                    :data="allMenus"
                    :props="treeProps"
                    :default-expanded-keys="defaultMenus"
                    show-checkbox
                    default-expand-all>
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setAuthority">确 定</el-button>
            </span>
        </el-dialog>
    </div>


</template>

<script>
    import {getAllRoles,doAssion,deleteAssion,addOneRole,updateOneRole,deleteOneRole} from '@/api/security/role'
    import {getAllAuthority} from '@/api/security/menu'
    export default {
        name: "SysRole",
        data(){
            return{
                showSetRightDialogVisible: false, // 是否展示分配权限对话框
                allMenus:[], // 所有权限
                defaultMenus:[], // 默认权限
                roleId:'', // 存储展示分配权限对话框的角色id
                treeProps:{
                    children: 'children', // 树父子嵌套的方式
                    label: 'name' // 显示的名称
                },
                name:null,
                nameZh:null,
                updateRole:false,
                role:{
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
            },
            // 展示分配权限弹出框
            async showSetRightDialog(role){
                // 判断是否获取了全部权限
                if(!this.allMenus.length > 0){
                    await this.getAllMenus();
                }
                this.roleId = role.id; // 为了方便在分配权限的时候使用
                // 获取角色的默认权限
                this.getLeafKeys(role.sysMenus,this.defaultMenus);
                console.log("defaultMenus:"+this.defaultMenus);
                this.$nextTick(() => {
                    this.$refs.rightsTree.setCheckedKeys(this.defaultMenus);
                });
                this.showSetRightDialogVisible = true;
            },
            // 关闭分配权限弹出框
            closeSetRightDialog(){
                // 默认展开的数组重置为空数组
                this.defaultMenus = [];
                // 默认展开的角色
                this.roleId = '';
            },
            // 删除角色的权限
            deleteRoleOfMenus(role,menu){
                this.$confirm('此操作将永久删除“'+role.nameZh+'”的“'+menu.name+'”权限', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 调用删除方法，返回的是该角色的最新权限
                    deleteAssion(role.id,menu.id).then(response =>{
                        if(response){
                            role.sysMenus = response.data; // 将最新的角色权限
                        }
                    });
                    //role.sysMenus = 该角色的最新权限
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 为角色分配权限
            setAuthority(){
                // 角色id，在展示分配权限的时候获取的 this.roleId
                let checkedKeys = this.$refs.rightsTree.getCheckedKeys(); // 全选
                let halfCheckedKeys = this.$refs.rightsTree.getHalfCheckedKeys(); // 半选
                doAssion(this.roleId,[...checkedKeys,...halfCheckedKeys]).then(response => {
                    if(response){
                        // 重新获取角色列表
                        this.getRolesList();
                    }
                });
                // 关闭对话框
                this.showSetRightDialogVisible = false;
            },
            // 获取全部权限
            async getAllMenus(){
                const {data: response} = await getAllAuthority();
                if(response){
                    this.allMenus = response;
                }
            },
            // 通过递归的方式获取角色下所有的三级节点的id，并保存到defaultMenus数组中
            getLeafKeys(menus,arr){
                for(let menu of menus){
                    console.log(menu.id+"长度:"+menu.children.length);
                    if(menu.children.length == 0){ // 是叶子节点
                        arr.push(menu.id);
                    }else{
                        // 不是叶子节点
                        this.getLeafKeys(menu.children,arr); // 递归
                    }

                }
            },
            addRole(){ // 添加角色
                this.role.name = "ROLE_"+this.name;
                this.role.nameZh = this.nameZh;
                addOneRole(this.role).then(response =>{
                    if(response){
                        // 重新获取角色列表
                        this.getRolesList();
                    }
                });
            },
            deleteRole(role){ // 删除角色
                this.$confirm('此操作将永久删除<'+role.nameZh+'> 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOneRole(role.id).then(response =>{
                        if(response){
                            // 重新获取角色列表
                            this.getRolesList();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 修改角色
            showUpdateValue(role){
                this.updateRole = true;
                this.name = role.name.replace("ROLE_","");
                this.nameZh = role.nameZh;
                this.role.id = role.id;
            },
            updateOneRole(){
                this.updateRole = false;
                this.role.name = "ROLE_"+this.name;
                this.role.nameZh = this.nameZh;
                updateOneRole(this.role).then(response => {
                    if(response){
                        // 重新获取角色列表
                        this.getRolesList();
                    }
                })
            }
        },
        created() {
            // ①，获取角色列表
            this.getRolesList();
        }
    }
</script>

<style scoped>
    .addRole{
        width: 50%;
    }
    .contentRoles{
        width: 70%;
        margin-top: 15px;
    }
    .el-tag{
        margin: 7px;
    }
    .dbtop{
        border-top: 1px solid #eee ;
    }
    .dbbottom {
        border-bottom: 1px solid #eee;
    }
    /* 纵向居中 */
    .vcenter{
        display: flex;
        align-items: center;
    }
</style>
