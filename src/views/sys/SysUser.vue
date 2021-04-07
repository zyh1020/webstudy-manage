<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索-->
            <div class="searchCondition">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-input
                                prefix-icon="el-icon-search"
                                placeholder="请输入用户名进行搜索"
                                size="medium"
                                :disabled="seniorSearchShow"/>
                    </el-col>
                    <el-col :span="4">
                        <el-button type="primary" size="medium" icon="el-icon-search" :disabled="seniorSearchShow">搜索
                        </el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="primary" size="medium"
                                   :icon="seniorSearchShow ? 'el-icon-arrow-up':'el-icon-arrow-down'"
                                   @click="clickSeniorSearch"> 高级搜索
                        </el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="success" size="medium" icon="el-icon-plus"> 添加用户</el-button>
                    </el-col>
                </el-row>
            </div>
            <!-- 高级搜索 -->
            <transition name="slide-fade"> <!-- transition是v-show的过度动画-->
                <div class="seniorSearch" v-show="seniorSearchShow">
                    <el-button type="primary" icon="el-icon-search" size="medium">搜索</el-button>
                    <el-button type="primary" size="medium">置空</el-button>
                </div>
            </transition>
            <!-- 数据表格 -->
            <div class="tableData">
                <el-table
                        :data="userList"
                        stripe
                        style="width: 80%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="编号">
                    </el-table-column>
                    <el-table-column
                            prop="username"
                            label="用户名">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="昵称">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                    <el-table-column
                            label="是否启用">
                        <template #default="scope">
                            <el-switch
                                    v-model="scope.row.enabled"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="danger" icon="el-icon-delete" size="mini"/>
                            <el-button type="primary" icon="el-icon-edit" size="mini"/>
                            <el-button @click="distributionRoles(scope.row)" type="info" icon="el-icon-s-custom" size="mini"/>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>

        <!-- 分配角色弹出框 -->
        <el-dialog
                title="分配角色"
                :visible.sync="rolesDialogShow"
                @close="closeRoleDialog">
            <!-- 穿梭框 -->
            <el-transfer v-model="defaultRoles"
                         :data="roles"
                         :props="transferProps"
                         :titles="['未拥有','已拥有']"/>
            <!--<span>这是一段信息</span>-->
            <template #footer>
                <span class="dialog-footer">
                  <el-button @click="rolesDialogShow = false">取 消</el-button>
                  <el-button type="primary" @click="setRoles">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import {getAllUsers,distributionRoles} from '@/api/security/user'
    import {findAllRoles} from '@/api/security/role'
    export default {
        name: "SysCfg",
        data() {
            return {
                roles: [], // 所有角色
                defaultRoles: [], // 默认拥有的角色
                userId:'', // 展示分配角色弹框时的角色信息
                transferProps:{
                    key: 'id',
                    label: 'nameZh'
                },
                seniorSearchShow: false,
                rolesDialogShow: false,
                userList: []
            }
        },
        methods: {
            // 切换高级搜索
            clickSeniorSearch() {
                this.seniorSearchShow = !this.seniorSearchShow;
            },
            // 分配角色弹框
            async distributionRoles(user) {
                // 记录角色id
                this.userId = user.id;
                // ①，判断是否获取所有的角色
                if(!this.roles.length > 0){
                   await this.findAllRoles();
                }
                // ②，获取默认选中
                for(let role of user.sysRoles){
                    this.defaultRoles.push(role.id)
                }
                // ①，弹框
               this.rolesDialogShow = true;
            },
            // 关闭角色弹框
            closeRoleDialog(){
                // ①，默认拥有的角色置为空
                this.defaultRoles = [];
                // ②，分配角色弹框的默认用户id为空
                this.userId = '';
            },
            // 获取用户列表
            getUserList() {
                getAllUsers().then(response => {
                    if (response) {
                        this.userList = response.data;
                    }
                });
            },
            // 获取不包含菜单信息的所有角色
            async findAllRoles(){
                await findAllRoles().then(response =>{
                    if (response) {
                        this.roles = response.data;
                    }
                });
            },
            // 分配角色权限
            setRoles(){
                console.log("已拥有的角色:"+this.defaultRoles);
                distributionRoles(this.userId,this.defaultRoles).then(response => {
                    // 重新获取用户信息
                    this.getUserList();
                });
                // 关闭窗口
                this.rolesDialogShow = false;



            }
        },
        created() {
            this.getUserList();
        }
    }
</script>

<style scoped>
    .searchCondition {
        width: 50%;
    }

    .tableData {
        margin-top: 15px;
    }

    .seniorSearch {
        border: 1px solid #409eff;
        border-radius: 5px;
        box-sizing: border-box;
        padding: 5px;
        margin: 15px 0;
    }

    /* 可以设置不同的进入和离开动画 */
    /* 设置持续时间和动画函数 */
    .slide-fade-enter-active {
        transition: all .8s ease;
    }

    .slide-fade-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }

    .slide-fade-enter, .slide-fade-leave-to
        /* .slide-fade-leave-active for below version 2.1.8 */
    {
        transform: translateX(10px);
        opacity: 0;
    }
</style>
