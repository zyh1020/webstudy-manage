<template>
    <div class="sysMenu">
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            菜单管理
        </el-card>
    </div>

</template>

<script>
    export default {
        name: "SysMenu"
    }
</script>

<style scoped>

</style>
