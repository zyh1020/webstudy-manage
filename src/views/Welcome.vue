<template>
    <div class="welcom">
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>欢迎</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 日历-->
        <el-card>
            <el-calendar v-model="value">
            </el-calendar>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Welcome",
        data() {
            return {
                value: new Date()
            }
        }
    }
</script>

<style scoped>

</style>
