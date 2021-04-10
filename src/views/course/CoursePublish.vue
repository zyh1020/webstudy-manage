<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程添加</el-breadcrumb-item>
            <el-breadcrumb-item>课程最终发布</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <div class="navSteps">
                <h3 style="text-align: center">课程添加流程</h3>
                <el-steps :active="3">
                    <el-step title="课程信息添加" icon="el-icon-edit"></el-step>
                    <el-step title="课程章节添加" icon="el-icon-tickets"></el-step>
                    <el-step title="课程最终发布" icon="el-icon-s-promotion"></el-step>
                </el-steps>
            </div>
            <div class="infoContent">
                <el-card>
                    <el-divider content-position="center"> 课程信息</el-divider>
                    <el-row :gutter="20">
                        <el-col :span="5">
                            <el-tag type="info">标题：{{courseVo.title}}</el-tag>
                        </el-col>
                        <el-col :span="3">
                            <el-tag type="warning">课时：{{courseVo.courseTime}}</el-tag>
                        </el-col>
                        <el-col :span="3">
                            <el-tag type="danger">分类：{{twoLevelSortName}}</el-tag>
                        </el-col>
                        <el-col :span="3">
                            <el-tag type="danger">方向：{{twoLevelSortName}}</el-tag>
                        </el-col>
                        <el-col :span="10">
                            <el-tag type="danger">难度：</el-tag>
                            <el-rate style="display: inline-block" v-model="courseVo.difficulty" disabled></el-rate>
                        </el-col>
                    </el-row>
                    <br>
                    <el-row :gutter="20">
                            <el-col :span="12">
                                <div>
                                        <el-tag>封面：</el-tag>
                                        <img class="courseCoverImg" :src="courseVo.courseCover"/>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                    <el-tag type="success">简介：</el-tag>
                                    <div v-html="courseVo.description" class="courseCoverImg">
                                    </div>
                            </el-col>
                    </el-row>
                    <el-divider content-position="center"> 章节信息</el-divider>
                    <el-row>
                        <div v-for="(chapter,index) in chapters" :key="index" class="chapter-item">
                            <div class="chapterTitle">
                                {{ chapter.title }}
                            </div>
                            <ul>
                                <li v-for="(vedio, index) in chapter.vedios" :key="index" class="term-item">
                                    <p>
                                        <i class="el-icon-video-play"></i>
                                        <span>{{ vedio.title }}</span>
                                        <span class="right">
                                    </span>
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </el-row>
                    <el-row>
                        <div style="float:right; margin-right: 0;">
                            <el-button type="primary" @click="pervious">上一步</el-button>
                            <el-button type="primary" @click="next">确认发布</el-button>
                        </div>
                    </el-row>
                </el-card>

            </div>
        </el-card>
    </div>

</template>

<script>
    import {findOneCourseAllCapter} from '@/api/course/courseChapter'
    import {findOneCourseInfo} from '@/api/course/courseInfo'
    import {getAllCategoryList} from '@/api/sort/category'
    export default {
        name: "CoursePublish",
        data(){
            return {
                currentCourseId: '', // 当前课程id
                chapters: [], // 课程的章节列表
                oneLevelSortName:'', // 一级分类的名称
                twoLevelSortName:'', // 二级分类的名称
                AllSort: [], // 查询所有的课程分类
                courseVo: {} // 课程信息
            }
        },
        methods:{
            getAllSortList(){ // 获取所有分类
                getAllCategoryList().then(response => {
                    if(response){
                        this.AllSort = response.data;
                    }
                });
            },
            findOneCourse(courseId){ // 查询一个课程
                findOneCourseInfo(courseId).then(response =>{
                    if(response){
                        this.courseVo = response.data;
                        // 将一级和二级分类的id转换为名称
                        this.sortIdToName(this.courseVo.sortParentId,this.courseVo.sortId)
                    }
                });
            },
            findCourseAllCapter(){ //  查询某个课程的所有章节
                findOneCourseAllCapter(this.currentCourseId).then(response =>{
                    this.chapters = response.data;
                });
            },

            async initData(){
                // 查询所有课程分类
                await this.getAllSortList();
                // 查询课程信息
                await this.findOneCourse(this.currentCourseId);
                // 查询章节信息
                await this.findCourseAllCapter();
            },
            sortIdToName(oneLevelId,towLevelId){ //将一级和二级分类的id转换为名称
                for(let sort of this.AllSort){
                    if(sort.id == oneLevelId){
                        this.oneLevelSortName = sort.name;
                    }
                    if(sort.id == towLevelId){
                        this.twoLevelSortName = sort.name;
                    }
                }
            },
            pervious(){ // 上一步
                this.$router.push({
                    path:'/cou/chapter',
                    query:{ courseId:this.currentCourseId }
                })
            },
            next(){ // 确认发布

            }

        },
        created() {
            // ①，获取参数 查询信息课程信息
            if(this.$route.query != null && this.$route.query.courseId != null){
                this.currentCourseId = this.$route.query.courseId; // 当前传递的阐述
                this.initData();
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .navSteps{
        width: 50%;
        margin: 25px auto;
    }
    .infoContent{
        width: 80%;
        margin: 10px auto;
    }
    .courseCoverImg{
        width: 510px;
        height: 280px;
        margin-top: 10px;
    }

    .chapter {
        width: 90%;
        padding: 24px 32px 32px;
        background-color: #fff;
        border-radius: 12px;
        margin 20px auto;
    }

    .chapterTitle{
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
    }
    .chapter {
        width: 90%;
        padding: 24px 32px 32px;
        background-color: #fff;
        border-radius: 12px;
        margin 20px auto;
    }
    .createBut{
        margin-bottom: 20px;
    }
    .titleBut{
        float: right;
        margin-right: 10px;
    }
    .chapterTitle{
        font-size: 16px;
        line-height: 24px;
        font-weight: 700;
    }

    .chapter-item
        .term-item
            width: 100%;
            padding-left: 12px;
            line-height: 48px;
            cursor: pointer;
            & > p
                display: flex;
                align-items: center;
                & > span
                    &:nth-child(2)
                        flex: 1;
            &:hover
                background-color: rgba(242, 13, 13, .05);
                border-radius: 4px;
                color: #f20d0d;

                .play
                    color: #f20d0d;

                .right
                    & > i
                        color: #f20d0d !important;

            .play
                margin-right: 8px;
                font-size: 24px;
                color: #9199a1;
            .right
                margin-right: 15px;
                font-size: 20px;
                color: #d9dde1;
                .complete, .doning
                    color: #00b43c;
                    font-size: 12px;
                .doning
                    i
                        margin-left: 10px;
                        font-size: 12px;



</style>
