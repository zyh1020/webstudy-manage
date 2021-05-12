<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>课程列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索 -->
            <div class="addOrSearch">
                <el-form label-width="120px" inline>
                    <el-form-item label="课程标题:">
                        <el-input v-model="course.title"  size="small" style="width: 300px" placeholder="示例：基于springBoot的web学习交流平台"></el-input>
                    </el-form-item>
                    <el-form-item label="课程分类:">
                        <el-select v-model="course.sortParentId" style="width: 150px"  placeholder="一级分类" size="small" @change="loadTwoLevelSort">
                            <el-option v-for="oneSort in oneLevelSort" :label="oneSort.name" :value="oneSort.id" :key="oneSort.id"></el-option>
                        </el-select>
                        <el-select v-model="course.sortId" style="width: 150px" placeholder="二级分类" size="small">
                            <el-option v-for="towSort in twoLevelSort" :label="towSort.name" :value="towSort.id" :key="towSort.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程难度:">
                        <el-select v-model="course.difficulty" style="width: 150px"  placeholder="请选择" size="small">
                            <el-option v-for="diff in diffList" :label="diff.name" :value="diff.id" :key="diff.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="searchCourse">搜索</el-button>
                        <el-button type="info" size="small" @click="setEmpty">置空</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="success" icon="el-icon-plus" size="small" @click="addCourse">添加课程</el-button>
                    </el-form-item>
                </el-form>

            </div>
            <!-- 数据表格 -->
            <div class="tableData">
                <el-table
                        :data="courseList"
                        stripe
                        style="width: 80%">
                    <el-table-column
                            prop="id"
                            label="编号"
                            width="70px">
                    </el-table-column>
                    <el-table-column
                            prop="title"
                            label="课程标题"
                            width="200px">
                    </el-table-column>
                    <el-table-column
                            prop="sortParentName"
                            label="一级分类">
                    </el-table-column>
                    <el-table-column
                            prop="sortName"
                            label="二级分类">
                    </el-table-column>
                    <el-table-column
                            prop="difficulty"
                            label="课程难度">
                        <template slot-scope="scope">
                            {{scope.row.difficulty}}颗星
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="lookPersonNum"
                            label="观看人数">
                    </el-table-column>
                    <el-table-column
                            prop="studyPersonNum"
                            label="学习人数">
                    </el-table-column>
                    <el-table-column
                            prop="courseCover"
                            label="封面地址">
                        <template slot-scope="scope">
                            <el-link @click="lookCourseCover(scope.row.courseCover)" type="info"> 点击查看封面</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作">
                        <template slot-scope="scope">
                            <el-button type="danger" @click="deleteCourse(scope.row)" icon="el-icon-delete" size="mini"/>
                            <el-button type="primary" @click="updateCourse(scope.row)" icon="el-icon-edit" size="mini"/>
                        </template>
                    </el-table-column>
                </el-table>

            </div>
            <div  style="width: 50%;margin: 30px auto">
                <!-- 分页 -->
                <el-pagination
                        background
                        layout="prev, pager, next"
                        :current-page="page"
                        :page-size="limit"
                        :total="total"
                        @current-change="pageChange">
                </el-pagination>
            </div>
        </el-card>
        <!-- 对话框 -->
        <el-dialog
                title="课程封面"
                :visible.sync="showCourseCover">
          <img :src="courseImg">
        </el-dialog>
    </div>
</template>

<script>
    import {getAllCategoryList} from '@/api/sort/category'
    import {findCourseList,deleteOneCourse} from '@/api/course/courseInfo'
    export default {
        name: "CourseChapter",
        data() {
            return {
                AllSort:[], // 所有分类
                oneLevelSort:[], // 一级分类
                twoLevelSort:[], // 二级分类
                courseList:[], // 课程列表
                showCourseCover: false, //是否展示课程封面
                courseImg:'',// 封面地址
                course:{
                    title:null,
                    sortParentId:null,
                    sortId: null,
                    difficulty: null
                },
                diffList:[
                    { name: '全部', id: 0 },
                    { name: '入门', id: 1 },
                    { name: '初级', id: 2 },
                    { name: '中级', id: 3 },
                    { name: '高级', id: 4 }
                ],
                page:1, // 当前页
                limit:8, // 多少页
                total:0 // 总记录
            }
        },
        methods:{
            // 查询所有分类
            getAllSortList(){ // 获取所有分类
                getAllCategoryList().then(response => {
                    if(response){
                        this.AllSort = response.data;
                        this.loadOneLeveSort();
                    }
                });
            },
            loadOneLeveSort(){ // 加载一级分类
                this.oneLevelSort = []; //置空
                this.oneLevelSort.push({name:'全部',id:0});
                for(let sort of this.AllSort){
                    if(sort.level == 1){
                        this.oneLevelSort.push(sort);
                    }
                }
            },
            loadTwoLevelSort(oneLevelSortId){ // 加载二级分类
                this.twoLevelSort = []; //置空
                this.course.sortId = 0;
                this.twoLevelSort.push({name:'全部',id:0});
                for(let sort of this.AllSort){
                    if(sort.level == 2 && sort.parentId == oneLevelSortId){
                        this.twoLevelSort.push(sort);
                    }
                }
            },
            // 查询所有课程
            getCourseList(){
                findCourseList(this.page,this.limit,this.course).then(response =>{
                    if(response){
                        this.courseList = response.data.courses;
                        this.total = response.data.total;
                    }
                })
            },
            // 分页事件
            pageChange(pageNum){
                this.page = pageNum;
                // 查询所有课程
                this.getCourseList();
            },
            // 删除课程
            deleteCourse(course){
                this.$confirm('此操作将永久删除<'+course.title+'> 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOneCourse(course.id).then(response =>{
                        if(response){
                            // 搜索课程
                            this.searchCourse();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 搜索课程
            searchCourse(){
                this.page = 1;
                if(this.course.title != null && this.course.title.trim() == ''){
                    this.course.title = null;
                }
                if(this.course.sortParentId != null && this.course.sortParentId == 0 ){
                    this.course.sortParentId = null;
                }
                if(this.course.sortId != null && this.course.sortId == 0 ){
                    this.course.sortId = null;
                }
                if(this.course.difficulty != null && this.course.difficulty == 0 ){
                    this.course.difficulty = null;
                }
                // 查询所有课程
                this.getCourseList();
            },
            //置空
            setEmpty(){
                this.course= {
                        title:null,
                        sortParentId:null,
                        sortId: null,
                        difficulty: null
                }
            },
            // 添加课程
            addCourse(){
                this.$router.push("/cou/info");
            },
            // 更新课程
            updateCourse(course){
                this.$router.push({
                    path:'/cou/info',
                    query:{
                        courseId:course.id
                    }
                })
            },
            // 查看课程封面
            lookCourseCover(imgUrl){
                this.courseImg = imgUrl;
                this.showCourseCover = true;
            }
        },
        created() {
            // ①，获取所有的分类列表
            this.getAllSortList();
            // ②，查询课程列表
            this.getCourseList();
        }

    }
</script>

<style scoped>


</style>
