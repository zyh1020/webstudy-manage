<template>
    <div class="welcom">
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>欢迎</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 日历-->
        <el-card>
            <div style="width: 600px">
                <tinymce-editor
                        id="editor"
                        v-model="content"
                        :height="300"
                        @handleImgUpload="imgUpload"
                />
            </div>


            <!--<el-calendar v-model="value">
            </el-calendar>-->
        </el-card>
    </div>
</template>

<script>

    export default {
        name: "Welcome",

        data() {
            return {
                content: '', //富文本的内容
                value: new Date()
            }
        },
        methods: {
            async imgUpload(blobInfo, success, failure) {
                const formData = new FormData();
                formData.append('file', blobInfo.blob());
                try {
                    const res = await uploadFile(formData);
                    success(this.server + res);
                    console.log(this.server + res);
                } catch (e) {
                    console.log(e);
                    failure('上传失败:' + e);
                }
            }
        }
    }
</script>

<style scoped>

</style>
