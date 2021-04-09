<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程添加</el-breadcrumb-item>
            <el-breadcrumb-item>课程章节添加</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <div class="navSteps">
                <h3 style="text-align: center">课程添加流程</h3>
                <el-steps :active="2">
                    <el-step title="课程信息添加" icon="el-icon-edit"></el-step>
                    <el-step title="课程章节添加" icon="el-icon-tickets"></el-step>
                    <el-step title="课程最终发布" icon="el-icon-s-promotion"></el-step>
                </el-steps>
            </div>
            <div class="infoContent">
                <el-card class="chapter">
                    <div class = "createBut">
                        <el-row>
                            <el-col :span="18">
                                <el-button type="primary" icon="el-icon-plus" size="medium"> 创建章节 </el-button>
                            </el-col>
                            <el-col :span="6">
                                <div style="float:right; margin-right: 0">
                                    <el-button type="primary" @click="pervious">上一步</el-button>
                                    <el-button type="primary" @click="next">下一步</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div v-for="(item,index) in catalog.chapter" :key="index" class="chapter-item">
                        <div class="chapterTitle">
                            {{ item.title }}
                            <div class="titleBut">
                                <el-button type="danger"  icon="el-icon-delete" size="mini"/>
                                <el-button type="primary" icon="el-icon-edit" size="mini"/>
                                <el-button type="primary" icon="el-icon-plus" size="mini"/>
                            </div>
                        </div>
                        <ul>
                            <li v-for="(term, index) in item.term" :key="index" class="term-item">
                                <p>
                                    <i class="el-icon-video-play"></i>
                                    <span>{{ term.title }}</span>
                                    <span class="right">
                                        <el-button type="danger"  icon="el-icon-delete" size="mini"/>
                                        <el-button type="primary" icon="el-icon-edit" size="mini"/>
                                    </span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </el-card>

            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "CourseChapter",
        data() {
            return {
                currentCourseId:'',
                catalog: {
                    chapter: [{
                        title: '第2章 Vue基础语法',
                        introduction: '介绍',
                        term: [{
                            title: '2-1 创建第一个Vue实例(09:18)'
                        }]
                    }],
                    isComplete: true
                }
            }
        },
        methods: {
            pervious() { // 上一步
                this.$router.push({
                        path: "/cou/info",
                        query: {courseId: 1}}
                    )
            },
            next() { // 下一步
                this.$router.push({
                    path: '/cou/publish',
                    query: {courseId: 1}
                })
            }
        },
        created(){
            // ①，获取参数
            if(this.$route.query != null && this.$route.query.courseId != null){
                this.currentCourseId = this.$route.query.courseId; // 当前传递的阐述
            }
            // ②，查询章节列表列表


        }
    }
</script>

<style lang="stylus" scoped>
    .navSteps {
        width: 50%;
        margin: 10px auto;
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
