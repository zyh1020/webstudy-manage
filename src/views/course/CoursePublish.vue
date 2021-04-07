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
                <el-steps :active="2">
                    <el-step title="课程章节添加" icon="el-icon-edit"></el-step>
                    <el-step title="课程信息添加" icon="el-icon-tickets"></el-step>
                    <el-step title="课程最终发布" icon="el-icon-s-promotion"></el-step>
                </el-steps>
            </div>
        </el-card>
    </div>

</template>

<script>
    export default {
        name: "CoursePublish"
    }
</script>

<style scoped>
    .navSteps{
        width: 50%;
        margin: 10px auto;
    }
</style>
