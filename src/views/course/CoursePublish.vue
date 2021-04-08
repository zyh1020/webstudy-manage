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
                <el-form label-width="120px">
                    <el-form-item>
                        <el-button type="primary" @click="pervious">上一步</el-button>
                        <el-button type="primary" @click="next">确认发布</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>

</template>

<script>
    export default {
        name: "CoursePublish",
        methods:{
            pervious(){ // 上一步
                this.$router.push({
                    path:'/cou/chapter',
                    params:{ courseId:1 }
                })
            },
            next(){ // 确认发布

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
        width: 100%;
        margin-top: 10px;
        background-color: rebeccapurple;
    }
</style>
