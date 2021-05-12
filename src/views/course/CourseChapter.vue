<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>课程管理</el-breadcrumb-item>
            <el-breadcrumb-item>课程章节</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card>
            <div class="navSteps">
                <h3 style="text-align: center">课程操作流程</h3>
                <el-steps :active="2">
                    <el-step title="课程信息" icon="el-icon-edit"></el-step>
                    <el-step title="课程章节" icon="el-icon-tickets"></el-step>
                    <el-step title="课程发布" icon="el-icon-s-promotion"></el-step>
                </el-steps>
            </div>
            <div class="infoContent">
                <el-card class="chapter">
                    <div class = "createBut">
                        <el-row>
                            <el-col :span="18">
                                <el-button type="primary" icon="el-icon-plus" size="medium" @click="createChapter"> 创建章节 </el-button>
                            </el-col>
                            <el-col :span="6">
                                <div style="float:right; margin-right: 0">
                                    <el-button type="info" @click="toCourseList">首页</el-button>
                                    <el-button type="primary" @click="pervious">上一步</el-button>
                                    <el-button type="success" @click="next">下一步</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <el-divider></el-divider>
                    <div v-for="(chapter,index) in chapters" :key="index" class="chapter-item">
                        <div class="chapterTitle">
                            {{ chapter.title }}
                            <div class="titleBut">
                                <el-button type="danger"  icon="el-icon-delete" size="mini" @click="deleteChapter(chapter)"/>
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="createUpdateChapter(chapter)"/>
                                <el-button type="primary" icon="el-icon-plus" size="mini" @click="createVedio(chapter)"/>
                            </div>
                        </div>
                        <ul>
                            <li v-for="(vedio, index) in chapter.vedios" :key="index" class="term-item">
                                <p>
                                    <i class="el-icon-video-play"></i>
                                    <span>{{ vedio.title }}</span>
                                    <span class="right">
                                        <el-button type="danger"  icon="el-icon-delete" size="mini" @click="deleteVedio(vedio)"/>
                                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="createUpdateVedio(chapter,vedio)"/>
                                    </span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </el-card>

            </div>
        </el-card>

        <!-- 添加修改章节 弹框-->
        <el-dialog
                :title="chapterDialogTitle"
                :visible.sync="chapterDialogShow"
                width="20%">
            <!-- 表单 -->
            <el-form ref="form" :model="chapter" label-width="80px">
                <el-form-item label="章节名称">
                    <el-input placeholder="示例《第一章：hello word》" size="medium" v-model="chapter.title"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="chapterDialogShow = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateChapter">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 添加修改小节 弹框-->
        <el-dialog
                :title="vedioDialogTitle"
                :visible.sync="vedioDialogShow"
                width="20%">
            <!-- 表单 -->
            <el-form ref="form" :model="vedio" label-width="80px">
                <el-form-item label="章节标题:">
                    <el-input size="medium" :disabled="true" v-model="vedioCurrentChapterName"></el-input>
                </el-form-item>
                <el-form-item label="小节标题:">
                    <el-input size="medium"  placeholder="示例《第二节：hello word》" v-model="vedio.title"></el-input>
                </el-form-item>
                <el-form-item label="上传视频:">
                    <el-upload
                            :on-success="handleVedioSuccess"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :on-exceed="handleExceed"
                            :file-list="fileList"
                            action="/api/ali/vedio/uploadVedio"
                            :limit="1"
                            :headers="headers"
                            name="fileVedio"
                            >
                        <el-button size="small" type="primary">上传视频</el-button>
                        <el-tooltip placement="right-end">
                            <div slot="content">
                                最大支持1G
                            </div>
                        </el-tooltip>

                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="vedioDialogShow = false">取 消</el-button>
                <el-button type="primary" @click="addOrUpdateVedio">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {findOneCourseAllCapter,addOneCapter,deleteOneCapter,updateOneCapter,} from '@/api/course/courseChapter'
    import {addOneVedio,deleteAliyunVedio,updateOneVedio,deleteOneVedio} from '@/api/course/courseVedio'

    export default {
        name: "CourseChapter",
        data() {
            return {
                headers:{
                    token: window.sessionStorage.getItem('token')
                },
                chapterDialogTitle:'添加章节', // 章节对话框标题
                chapterDialogShow: false, // 章节对话框
                vedioDialogTitle: '添加小节', // 小节对话框标题
                vedioDialogShow: false, // 小节对话框
                chapter:{}, // 章节
                vedio:{
                    title:'',
                    vedioId:''
                }, // 小节
                vedioCurrentChapterName:'', // 小节的章节名称
                currentCourseId:'', // 目前课程id
                chapters:[],
                fileList:[] // 文件列表
            }
        },
        methods: {
            findCourseAllCapter(){ //  查询某个课程的所有章节
                findOneCourseAllCapter(this.currentCourseId).then(response =>{
                    this.chapters = response.data;
                });
            },
            beforeRemove(file, fileList){ // 删除视频弹框提示
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleRemove(){ // 删除视频请求
                deleteAliyunVedio(this.vedio.vedioId).then(response=>{
                    if(response){
                        // 清空文件列表 和 文件id
                        this.fileList = [];
                        this.vedio.vedioId = '';
                    }
                });
            },
            handleExceed(){ // 文件超出个数限制时的钩子
              this.$message.warning('上传视频之前,先删除已上传视频！');
            },
            handleVedioSuccess(response,file, fileList){ // 上传视频成功
                this.vedio.vedioId = response.data;
                console.log("上传视频成功:"+this.vedio.vedioId);
            },
            createChapter(){ // 创建章节弹出框
                this.chapter = {};
                this.chapter.courseId = this.currentCourseId;
                this.chapterDialogShow = true;
            },
            createUpdateChapter(chapter){ // 创建修改章节弹出框
                this.chapter = chapter;
                this.chapterDialogShow = true;
            },
            addChapter(){ // 添加章节
                addOneCapter(this.chapter).then(response =>{
                    if(response){
                        // 重新查询章节列表列表
                        this.findCourseAllCapter();
                        this.chapterDialogShow = false;
                    }
                });
            },
            deleteChapter(chapter){ // 删除章节
                this.$confirm('此操作将永久删除章节', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOneCapter(chapter.id).then(response =>{
                        if(response){
                            // 重新加载数据
                            this.findCourseAllCapter();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            updateChapter(){ //修改章节
                updateOneCapter(this.chapter).then(response =>{
                    if(response){
                        // 重新查询章节列表列表
                        this.findCourseAllCapter();
                        this.chapterDialogShow = false;
                    }
                });
            },
            addOrUpdateChapter(){ // 修改或添加章节
                if(this.chapter.id){
                    this.updateChapter();
                }else {
                    this.addChapter();
                }
            },
            createVedio(chapter){ // 创建小节对话框
                this.vedio.capterId = chapter.id;
                this.vedio.courseId = this.currentCourseId;
                this.vedioCurrentChapterName = chapter.title;
                this.vedio.title = ''; //置空
                // 清空文件列表 和 文件id
                this.fileList = [];
                this.vedio.vedioId = '';
                this.vedioDialogTitle = '添加小节';
                this.vedioDialogShow = true;
            },
            createUpdateVedio(chapter,vedio){
                this.vedioCurrentChapterName = chapter.title;
                this.vedio = vedio;
                this.vedioDialogTitle = '修改小节';
                this.vedioDialogShow = true;
            },
            addVedio(){ // 添加小节
                console.log(this.vedio.vedioId);
                addOneVedio(this.vedio).then(response => {
                    if(response){
                        // 重新查询章节列表列表
                        this.findCourseAllCapter();
                        this.vedioDialogShow = false;
                    }
                });
            },
            updateVedio(){ // 修改小节
                updateOneVedio(this.vedio).then(response =>{
                    if(response){
                        // 重新查询章节列表列表
                        this.findCourseAllCapter();
                        this.vedioDialogShow = false;
                    }
                });
            },
            deleteVedio(vedio){ // 删除小节
                this.$confirm('此操作将永久删除小节', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteOneVedio(vedio.id).then(response =>{
                        if(response){
                            // 重新加载数据
                            this.findCourseAllCapter();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            addOrUpdateVedio(){ // 修改或添加小节
                if(this.vedio.id){
                    this.updateVedio();
                }else {
                   this.addVedio();
                }
            },
            pervious() { // 上一步
                this.$router.push({
                        path: "/cou/info",
                        query: {courseId: this.currentCourseId}}
                    )
            },
            next() { // 下一步
                this.$router.push({
                    path: '/cou/publish',
                    query: {courseId: this.currentCourseId}
                })
            },
            // 回到课程列表界面
            toCourseList(){
                this.$router.replace('/cou/list');
            }
        },
        created(){
            // ①，获取参数
            if(this.$route.query != null && this.$route.query.courseId != null){
                this.currentCourseId = this.$route.query.courseId; // 当前传递的阐述
            }
            // ②，查询章节列表列表
            this.findCourseAllCapter();
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
