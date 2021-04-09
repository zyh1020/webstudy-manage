<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程添加</el-breadcrumb-item>
            <el-breadcrumb-item>课程信息添加</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <div class="navSteps">
                <h3 style="text-align: center">课程添加流程</h3>
                <el-steps :active="1">
                    <el-step title="课程信息添加" icon="el-icon-edit"></el-step>
                    <el-step title="课程章节添加" icon="el-icon-tickets"></el-step>
                    <el-step title="课程最终发布" icon="el-icon-s-promotion"></el-step>
                </el-steps>
            </div>
            <div class="infoContent">
                <el-form label-width="120px">
                    <el-form-item label="课程标题:">
                        <el-input v-model="courseVo.title" style="width: 500px" placeholder="示例：基于springBoot的web学习交流平台"></el-input>
                    </el-form-item>

                    <el-form-item label="总课时:">
                        <el-input-number v-model="courseVo.courseTime"></el-input-number>
                    </el-form-item>
                    <el-form-item label="难度:">
                        <el-rate v-model="courseVo.difficulty"></el-rate>
                    </el-form-item>
                    <el-form-item label="课程分类:">
                        <el-select v-model="courseVo.sortParentId" placeholder="一级分类" @change="loadTwoLevelSort">
                            <el-option v-for="oneSort in oneLevelSort" :label="oneSort.name" :value="oneSort.id" :key="oneSort.id"></el-option>
                        </el-select>
                        <el-select v-model="courseVo.sortId" placeholder="二级分类">
                            <el-option v-for="towSort in twoLevelSort" :label="towSort.name" :value="towSort.id" :key="towSort.id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="课程封面">
                        <el-upload
                                class="avatar-uploader"
                                action="/api/ali/oss/uploadImage"
                                :show-file-list="false"
                                :headers="headers"
                                :on-success="handleCourseSuccess"
                                :before-upload="beforeCourseCoverUpload">
                            <img v-if="courseVo.courseCover" :src="courseVo.courseCover" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item>
                        <div style="width: 600px">
                            <tinymce-editor
                                    id="editor"
                                    v-model="courseVo.description"
                                    :height="300"
                                    @handleImgUpload="imgUpload"
                            />
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="next">保存并下一步</el-button>
                    </el-form-item>
                </el-form>

            </div>

        </el-card>
    </div>
</template>

<script>
    import TinymceEditor from '@/components/tinymce';
    import {getAllCategoryList} from '@/api/sort/category'
    import {addOneCourseInfo,findOneCourseInfo} from '@/api/course/courseInfo'
    export default {
        name: "CourseInfo",
        components: { //注册TinymceEditor组件
            TinymceEditor
        },
        data(){
            return{
                headers:{
                    token: window.sessionStorage.getItem('token')
                },
                AllSort:[],
                oneLevelSort:[],
                twoLevelSort:[],
                courseVo:{
                    id:'',
                    title:'',
                    sortParentId:'',
                    sortId:'',
                    difficulty: 0,
                    courseCover: null,
                    description: '',
                    courseTime: 0
                }
            }
        },
        methods:{
            getAllSortList(){ // 获取所有分类
                getAllCategoryList().then(response => {
                    if(response){
                       this.AllSort = response.data;
                       this.loadOneLeveSort();
                    }
                });
            },
            addOneCourse(){ // 添加课程
                addOneCourseInfo(this.courseVo).then(reponse =>{
                    if(reponse){
                        this.courseVo.id = reponse.data;
                    }
                });
            },
            findOneCourse(courseId){
                findOneCourseInfo(courseId).then(response =>{
                    if(response){
                        this.courseVo = response.data;
                        // 为了回显二级分类数据
                        this.loadTwoLevelSort( this.courseVo.sortParentId);
                    }
                });
            },
            updateOrAddCourse() { // 修改或添加课程
                if( this.courseVo.id != ''){ // 修改
                    console.log("修改课程id："+this.courseVo.id);
                }else { // 添加
                    this.addOneCourse();
                }
            },
            imgUpload(){

            },
            loadOneLeveSort(){ // 加载一级分类
                this.oneLevelSort = []; //置空
                for(let sort of this.AllSort){
                    if(sort.level == 1){
                        this.oneLevelSort.push(sort);
                    }
                }
            },
            loadTwoLevelSort(oneLevelSortId){ // 加载二级分类
                this.twoLevelSort = []; //置空
                for(let sort of this.AllSort){
                    if(sort.level == 2 && sort.parentId == oneLevelSortId){
                        this.twoLevelSort.push(sort);
                    }
                }

            },
            beforeCourseCoverUpload(file){ // 上传课程封面
                const isJPG = (file.type == 'image/jpeg');
                const isLtM = ((file.size / 1024 / 1024) < 2);
                if(!isJPG){
                    this.$message({
                        type: 'warning',
                        message: '上传图片只能时JPG格式'
                    });
                }
                if(!isLtM){
                    this.$message({
                        type: 'warning',
                        message: '上传图片大小要小于2M'
                    });
                }
                return isJPG && isLtM
            },
            handleCourseSuccess(res,file){  // 上传课程封面成功
                if(res){
                    this.courseVo.courseCover = res.data;
                }
            },
            async next(){
                // ①，添加或信息后
                await this.updateOrAddCourse();
                // ②，跳转
                this.$router.push({
                    path:'/cou/chapter',
                    query:{ courseId: this.courseVo.id}
                })

            }
        },
        created(){
            // ①，获取所有的分类列表
            this.getAllSortList();
            // ②，判断是否需要查询数据
            if(this.$route.query != null && this.$route.query.courseId != null){
                this.findOneCourse(this.$route.query.courseId);
            }
        }
    }
</script>

<style scoped>
    .navSteps{
        width: 50%;
        margin: 10px auto;
    }
    .infoContent{
        width: 90%;
        margin: 40px auto;
    }

    .avatar-uploader {
        border: 1px dashed #409EFF;
        border-radius: 6px;
        width: 400px;
        height: 178px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

    }
    .avatar-uploader:hover{
        border-color: red;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 400px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 400px;
        height: 178px;
        display: block;
    }

</style>
