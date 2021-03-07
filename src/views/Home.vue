<template>
    <div class="home">
        <el-container>
            <!-- 头部 -->
            <el-header>头部</el-header>
            <!-- 内容 -->
            <el-container>
                <!-- 1，内容侧边 -->
                <el-aside width="200px">
                    <el-menu router unique-opened>
                        <el-submenu :index="pIndex+''"
                                    v-for="(pMenus,pIndex) in routers"
                                    :key="pIndex">
                            <template slot="title">
                                <i class="el-icon-message"></i>
                                <span>{{pMenus.name}}</span>
                            </template>

                            <el-menu-item :index="cMenus.path"
                                          v-for="(cMenus,cIndex) in pMenus.children"
                                          :key="cIndex"
                                          >
                                          {{cMenus.name}}
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!-- 1，内容主体 -->
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Home",
        computed:{
            routers(){
                return this.$store.state.routers;
            }
        }
    }
</script>

<style>

</style>
