<template>
    <div class="problem">
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>社区管理</el-breadcrumb-item>
            <el-breadcrumb-item>问题列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索 -->
            <div class="addOrSearch">
                <el-form label-width="120px" inline>
                    <el-form-item label="问题标题:">
                        <el-input v-model="problem.title"  size="small" style="width: 300px" placeholder="示例：基于springBoot的web学习交流平台"></el-input>
                    </el-form-item>
                    <el-form-item label="问题分类:">
                        <el-select v-model="problem.sortId" style="width: 150px" placeholder="分类" size="small">
                            <el-option v-for="towSort in twoLevelSorts" :label="towSort.name" :value="towSort.id" :key="towSort.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="searchProblem">搜索</el-button>
                        <el-button type="info" size="small" @click="setEmpty">置空</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" icon="el-icon-plus" size="small" @click="showAddPrblemDialog">提出问题</el-button>
                    </el-form-item>
                </el-form>

            </div>
            <!--  数据 -->
            <div>
                <el-table
                        :data="problems"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            label="标题">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="clickProblem(scope.row)">{{scope.row.problemTitle}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="twoLevelSortName"
                            label="分类"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            prop="lookNum"
                            label="浏览量"
                            width="100">
                    </el-table-column>
                    <el-table-column
                            label="最新时间"
                            width="200">
                        <template slot-scope="scope">
                            {{scope.row.updateTime | formatDate}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="showUpdatePrblemDialog(scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="deleteProblem(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <el-pagination
                        style="margin: 30px auto"
                        background
                        layout="prev, pager, next"
                        :current-page="page"
                        :page-size="pageSize"
                        :total="total"
                        @current-change="pageProblemChange">
                </el-pagination>
            </div>

            <!-- 添加问题对话框 -->
            <el-dialog
                    :title="dialogTitle"
                    :visible.sync="addorUpdateVisible"
                    width="40%">
                <el-form ref="form" :model="addOrUpdateProblem" label-width="85px">
                    <el-form-item label="问题标题：">
                        <el-input v-model="addOrUpdateProblem.problemTitle"/>
                    </el-form-item>
                    <el-form-item label="问题分类：">
                        <el-select v-model="addOrUpdateProblem.sortId" placeholder="请选择分类">
                            <el-option :label="sort.name" :value="sort.id" v-for="(sort,index) in twoLevelSorts" :key="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="问题描述：">
                        <el-input type="textarea" v-model="addOrUpdateProblem.problemContent" :rows="8"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addProblemDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addorUpdateProblem">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import {getAllCategoryList} from '@/api/sort/category'
    import {findPageProbelms,deleteOneProblem,updateOneProblem,addOneProblem} from '@/api/question/problem'
    export default {
        name: "Problem",
        filters:{
            formatDate(date){
                let dt = new Date(date);
                const y = dt.getFullYear();
                const m = (dt.getMonth() + 1 + '').padStart(2,'0');
                const d = (dt.getDate() +'').padStart(2,'0');
                const hh = (dt.getHours() + '').padStart(2,'0');
                const mm = (dt.getMinutes() + '').padStart(2,'0');
                const ss = (dt.getSeconds() + '').padStart(2,'0');
                return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;

            }
        },
        data(){
            return{
                dialogTitle:'添加问题',
                addorUpdateVisible:false,
                page:1,
                pageSize:8,
                total:0,
                allSorts:[],
                oneLevelSorts:[],
                twoLevelSorts:[],
                problem:{
                    title:null,
                    sortId:null
                },
                addOrUpdateProblem:{},
                problems:[] // 问题列表
            }
        },
        methods:{
            // 获取分类列表
            getSortList(){
                getAllCategoryList().then(response => {
                    if(response){
                        this.allSorts = response.data;
                        // 筛选分类列表
                        this.getScreenSortList()
                    }
                })
            },
            // 筛选分类列表
            getScreenSortList(){
                this.oneLevelSorts = [];
                this.twoLevelSorts = [];
                for(let sort of this.allSorts){
                    if(sort.level == 2){
                        this.twoLevelSorts.push(sort);
                    }else if(sort.level == 1){
                        this.oneLevelSorts.push(sort);
                    }
                }
            },
            // 置空
            setEmpty(){
                this.problem = {
                    title:null,
                    sortId:null
                };
            },
            // 分页改变
            pageProblemChange(pageNum){
                this.page = pageNum;
                // 查询问题列表
                this.getProblem();
            },
            // 搜索问题
            searchProblem(){
                this.page = 1;
                if(this.problem.title != null && this.problem.title.trim() == ''){
                    this.problem.title = null;
                }
                this.getProblem();
            },
            // 查询问题列表
            getProblem(){
                findPageProbelms(this.page,this.pageSize,this.problem).then(response =>{
                    if(response){
                        this.problems = response.data.problems;
                        this.total = response.data.total;
                    }
                })
            },
            // 添加问题
            addProblem(){
                addOneProblem(this.addOrUpdateProblem).then(response =>{
                    if(response){
                        // 搜索问题
                        this.searchProblem();
                        this.addorUpdateVisible = false;
                    }
                })
            },
            updateProblem(){
                updateOneProblem(this.addOrUpdateProblem).then(response =>{
                    if(response){
                        // 搜索问题
                        this.searchProblem();
                        this.addorUpdateVisible = false;
                    }
                });
            },
            //添加问题弹框
            showAddPrblemDialog(){
                this.addOrUpdateProblem = {};
                this.dialogTitle = '添加问题';
                this.addorUpdateVisible = true;
            },
            //修改问题弹框
            showUpdatePrblemDialog(probelm){
                this.addOrUpdateProblem = probelm;
                this.dialogTitle = '修改问题';
                this.addorUpdateVisible = true;
            },
            // 删除问题
            deleteProblem(probelm){
                this.$confirm('此操作将永久删除<'+probelm.problemTitle+'> 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOneProblem(probelm.id).then(response =>{
                        if(response){
                            // 搜索问题
                            this.searchProblem();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 添加或修改问题
            addorUpdateProblem(){
                if(this.addOrUpdateProblem.id){
                    this.updateProblem();
                }else {
                    this.addProblem();
                }
            },
            // 查看问题
            clickProblem(){

            }
        },
        created() {
            // 获取分类列表
            this.getSortList();
            // 搜索问题
            this.searchProblem();
        }
    }
</script>

<style scoped>

</style>
