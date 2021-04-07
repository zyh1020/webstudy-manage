<template>
    <div>
        <!-- 导航 -->
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <!-- 搜索 -->
            <div class="addOrSearch">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-input
                            placeholder="输入关键字进行过滤"
                            v-model="filterText"
                            size="mini">
                        </el-input>
                    </el-col>
                    <el-col :span="12">
                        <el-button type="danger" icon="el-icon-plus" @click="addOneLevel" size="mini">一级分类</el-button>
                    </el-col>
                </el-row>
            </div>
            <!-- 树型 -->
            <div class="contentTree">
                <el-tree
                        :data="contentTreeData"
                        node-key="id"
                        default-expand-all
                        :filter-node-method="filterNode"
                        :expand-on-click-node="false"
                        ref="tree">
                      <span class="custom-tree-node" slot-scope="{node,data}">
                        <span>{{data.name}}</span>
                         <span>
                          <el-button
                                  type="text"
                                  size="mini"
                                  @click="() => addTwoLevel(data)"  v-if="data.level == 1">
                            添加
                          </el-button>
                          <el-button
                                      type="text"
                                      size="mini"
                                      @click="() => update(data)">
                            修改
                          </el-button>
                          <el-button
                                  type="text"
                                  size="mini"
                                  @click="() => remove(data)">
                            删除
                          </el-button>
                        </span>
                      </span>
                </el-tree>
            </div>
        </el-card>

        <!-- 对话框 -->
        <el-dialog
                :title="dialogTitle"
                :visible.sync="sortOfDialogShow"
                width="20%">
        <el-form :model="category" label-width="80px">
            <el-form-item label="父级名称">
                <el-input disabled v-model="parentName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="分类名称">
                <el-input v-model="category.name" size="small"></el-input>
            </el-form-item>
        </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="sortOfDialogShow = false">取 消</el-button>
                <el-button type="primary" @click="addorUpdateCategory">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getAllCategory,addCategory,deleteCategory,updateCategory} from '@/api/sort/category'
    export default {
        name: "Category",
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        data() {
            return {
                filterText:'', // 过滤字段
                sortOfDialogShow: false, // 对话框
                dialogTitle: '提示', // 对话框标题
                parentName: '根级',
                category:{
                    id: '',
                    parentId:'',
                    level: 1,
                    name:''
                },
                contentTreeData:[]
            }
        },
        methods:{
            findAll(){ // 查询所有分类请求
                getAllCategory().then(response =>{
                    if(response){
                        this.contentTreeData = response.data;
                    }
                })
            },
            addorUpdateCategory(){ // 添加分类请求
                if(this.category.id != ''){ //修改
                    updateCategory(this.category).then(response =>{
                        if(response && response.data){ // 修改成功
                            this.findAll(); // 从新加载数据
                            this.sortOfDialogShow = false; // 关闭弹框
                        }
                    })
                }else{ // 添加
                    addCategory(this.category).then(response =>{
                        if(response && response.data){ // 添加成功
                            this.findAll(); // 从新加载数据
                            this.sortOfDialogShow = false; // 关闭弹框
                        }
                    })
                }

            },
            deleteCategory(data){ // 删除数据请求
                deleteCategory(data).then(response =>{
                    if(response && response.data){ // 删除成功
                        this.findAll(); // 从新加载数据
                    }
                })
            },
            addOneLevel(){ // 添加一级分类弹框
                this.parentName = '根级';
                this.category.parentId = 0;
                this.category.level = 1;
                this.category.name = ''; // 置空
                this.category.id = ''; // 置空
                this.dialogTitle = '添加一级分类';
                this.sortOfDialogShow = true;
            },
            addTwoLevel(data){ // 添加二级分类弹框
                this.parentName = data.name;
                this.category.parentId = data.id;
                this.category.level = 2;
                this.category.name = ''; // 置空
                this.category.id = ''; // 置空
                this.dialogTitle = '添加二级分类';
                this.sortOfDialogShow = true;
            },
            remove(data){ // 删除分类提示框
                // ①，判断是否有子分类
                if(data.children && data.children.length > 0){
                    this.$message({
                        type: 'warning',
                        message: '该分类下有子分类不能删除，已取消删除'
                    });
                    return;
                }
                this.$confirm('此操作将永久删除<'+data.name+'>该分类, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 删除
                    this.deleteCategory(data);

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            update(data){
                console.log("修改数据data:"+JSON.stringify(data));
                if(data.level == 1){
                    this.parentName = '根级';
                }else{
                    // 遍历
                    for(let oneLevel of this.contentTreeData){
                        if(oneLevel.id == data.parentId){
                            this.parentName = oneLevel.name;
                            break;
                        }
                    }
                }
                this.category.parentId = data.parentId;
                this.category.level = data.level;
                this.category.id = data.id;
                this.category.name = data.name; // 置空
                this.dialogTitle = '修改分类';
                this.sortOfDialogShow = true;

            },
            filterNode(value, data){ // 过滤节点
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            }
        },
        created() {
            // ①，查询所有分类
            this.findAll();
        }
    }
</script>

<style scoped>

    .addOrSearch {
        width: 50%;
    }
    .contentTree{
        margin-top: 15px;
        width: 50%;
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
