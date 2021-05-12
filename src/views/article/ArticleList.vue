<template>
    <div class="articleList">
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文章管理</el-breadcrumb-item>
            <el-breadcrumb-item>文章列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <!-- 搜索 -->
            <div class="addOrSearch">
                <el-form label-width="120px" inline>
                    <el-form-item label="问题标题:">
                        <el-input v-model="article.articleTitle"  size="small" style="width: 300px" placeholder="示例：基于springBoot的web学习交流平台"></el-input>
                    </el-form-item>
                    <el-form-item label="文章分类:">
                        <el-select v-model="article.sortId" style="width: 150px" placeholder="分类" size="small">
                            <el-option v-for="towSort in oneLevelSorts" :label="towSort.name" :value="towSort.id" :key="towSort.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="small" @click="searchArticle">搜索</el-button>
                        <el-button type="info" size="small" @click="setEmpty">置空</el-button>
                    </el-form-item>
                </el-form>

            </div>
            <!--  数据 -->
            <div>
                <el-table
                        :data="articles"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            label="标题">
                        <template slot-scope="scope">
                            <el-link type="primary">{{scope.row.articleTitle}}</el-link>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="sortName"
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
                            <!--<el-button size="mini" @click="updateArticle(scope.row)">编辑</el-button>-->
                            <el-button size="mini" type="danger" @click="deletArticle(scope.row)">删除</el-button>
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
                        @current-change="pageArticleChange">
                </el-pagination>
            </div>

        </el-card>
    </div>

</template>

<script>
    import {getAllCategoryList} from '@/api/sort/category'
    import {pageFindArticles,deleteArticleById} from '@/api/article/article'
    export default {
        name: "Score",
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
                oneLevelSorts:[],
                twoLevelSorts:[],
                articles:[],
                article:{
                    articleTitle: null,
                    sortId: null
                },
                page:1,
                pageSize:8,
                total:0
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
            setEmpty(){ // 置空
                this.article.articleTitle = null;
                this.article.sortId = null;
            },
            searchArticle(){ // 查询文章
                pageFindArticles(this.page,this.pageSize,this.article).then(response =>{
                    if(response){
                        this.articles = response.data.articles;
                        this.total = response.data.total;
                    }
                })
            },
            deletArticle(article){
                this.$confirm('此操作将永久删除<'+article.articleTitle+'> 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteArticleById(article.id).then(response => {
                        if(response){
                            // 查询文章
                            this.searchArticle();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            pageArticleChange(pageNum){
                this.page = pageNum;
                this.searchArticle() // 查询文章
            }
        },
        created() {
            // 获取分类列表
            this.getSortList();
            // 查询文章
            this.searchArticle();
        }

    }
</script>

<style scoped>

</style>
