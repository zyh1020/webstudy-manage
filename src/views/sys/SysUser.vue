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
                        <el-button type="primary" size="medium" icon="el-icon-search" :disabled="seniorSearchShow">搜索</el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-button type="primary" size="medium" :icon="seniorSearchShow ? 'el-icon-arrow-up':'el-icon-arrow-down'" @click="clickSeniorSearch"> 高级搜索</el-button>
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
                    <el-button type="primary"  size="medium">置空</el-button>
                </div>
            </transition>

            <!-- 数据表格 -->
            <div class="tableData">
                <el-table
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="100"
                            fixed="left">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="操作"
                            width="180"
                            fixed="right">
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
    export default {
        name: "SysCfg",
        data() {
            return {
                seniorSearchShow: false,
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }]
            }
        },
        methods:{
            clickSeniorSearch(){
                this.seniorSearchShow = !this.seniorSearchShow;
            }
        }
    }
</script>

<style scoped>
    .searchCondition{
        width: 50%;
    }
    .tableData{
        margin-top: 15px;
    }
    .seniorSearch{
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
        /* .slide-fade-leave-active for below version 2.1.8 */ {
        transform: translateX(10px);
        opacity: 0;
    }
</style>
