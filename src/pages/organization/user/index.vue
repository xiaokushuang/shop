<template>
  <div class="user-class">
    <Pabody>
      <PaTitle class="flex-space-between">
        <span>用户管理</span>
        <span class="text-r margin-b10">
                    <el-button v-if="havePermission(421,'创建')" @click="handleCreate()">创建</el-button>
                </span>
      </PaTitle>
      <section class="margin-t10">
        <!--搜索栏-->
        <div class="conditions">
          <span class="w120">姓名：</span>
          <div class="namePan-class w100 margin-r10">
            <el-autocomplete
                    class="w100 "
                    v-model="condition.username"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入用户姓名"
                    @select="handleSelect"
            >
              <template slot-scope="{item}">
                <div>{{item.username}}</div>
              </template>
            </el-autocomplete>
          </div>
          <span class="w120">邮箱：</span>
          <div class="emailPan-class w100 margin-r10">
            <el-autocomplete
                    class="w100"
                    v-model="condition.email"
                    :fetch-suggestions="querySearchAsync2"
                    placeholder="请输入邮箱"
                    @select="handleSelect2"
            >
              <template slot-scope="{item}">
                <div>{{item.email}}</div>
              </template>
            </el-autocomplete>
          </div>
          <!--<span class="w310">所属商务：</span>
          <div class="businessPan-class w100 margin-r10">
              <el-autocomplete
                      class="w100"
                      v-model="condition.email"
                      :fetch-suggestions="querySearchAsync3"
                      placeholder="请输入商务负责人"
                      @select="handleSelect3"
              >
                  <template slot-scope="{item}">
                      <div>{{item.email}}</div>
                  </template>
              </el-autocomplete>
          </div>-->
          <el-popover
                  class="margin-r10"
                  placement="bottom"
                  width="100"
                  trigger="click"
                  content="">
            <el-checkbox-group v-if="roleList&&roleList.length>0" v-model="checkList">
              <el-checkbox v-for="data in roleList" :key="data.id" :label="data">{{data.role_name}}
              </el-checkbox>
            </el-checkbox-group>
            <div v-else class="text-c">暂无角色</div>
            <el-button slot="reference">角色</el-button>
          </el-popover>
          <el-button @click="clear">清空</el-button>
          <el-button type="primary" @click="search()" class="margin-l10">搜索</el-button>
        </div>
        <!-- 标签 -->
        <div class="margin-t10 margin-b10">
          <span v-if="checkList.length>0">角色：</span>
          <el-tag
                  class="margin-r10 margin-b10"
                  v-for="tag in checkList"
                  :key="tag.id"
                  closable
                  @close="handleClose(tag)"
          >{{tag.role_name}}
          </el-tag>

        </div>
        <!-- 表格 -->
        <div>
          <el-table
                  :data="userList"
                  tooltip-effect="dark"
                  class="w100"
                  v-loading="loadingFlag"
          >
            <el-table-column
                    label="姓名"
            >
              <template slot-scope="scope">
                <div>{{ handleEmpty(scope.row.username)
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱"
            >
              <template slot-scope="scope">
                <div>{{ handleEmpty(scope.row.email)}}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="role"
                    label="角色"
                    show-overflow-tooltip>
              <template slot-scope="scope">
                                <span v-if="scope.row.role_infos&&scope.row.role_infos.length>0">
                                     <span v-for="(data,index) in scope.row.role_infos" :key="data.id">
                                         <span>
                                             {{data.role_name}}
                                         </span>
                                         <span v-if="index!==scope.row.role_infos.length-1">,</span>
                                     </span>
                                </span>
                <span v-else>- -</span>
              </template>
            </el-table-column>
            <!--<el-table-column
                    prop="email"
                    label="所属商务"
            >
                <template slot-scope="scope">
                    <div>{{ handleEmpty(scope.row.email)}}</div>
                </template>
            </el-table-column>-->
            <el-table-column
                    v-if="havePermission(423,'编辑') || havePermission(424,'删除')"
                    width="120"
                    label="操作">
              <template slot-scope="scope">
                             <span
                                     v-if="havePermission(423,'编辑')"
                                     class="green-font"
                                     size="mini"
                                     @click="handleEdit(scope.$index, scope.row)">编辑</span>
                <span
                        v-if="havePermission(424,'删除')"
                        class="green-font"
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.$index, scope.row)">移除</span>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <div class="resetElementClass page-position">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="condition.page"
                    :page-size="condition.limit"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
          </div>
        </div>
      </section>
      <!-- 弹窗 -->
      <div>
        <!-- 创建弹窗 -->
        <el-dialog
                :close-on-click-modal="false"
                title="创建"
                :visible.sync="dialogCreateFlag"
                width="600"
        >
          <createOrEditDialog v-if="dialogCreateFlag" @closeDialog="handleCloseDialog"
                              :roleList="roleList"></createOrEditDialog>
        </el-dialog>
        <!-- 编辑弹窗 -->
        <el-dialog
                :close-on-click-modal="false"
                title="编辑"
                :visible.sync="dialogEditFlag"
                width="600"
        >
          <createOrEditDialog v-if="dialogEditFlag" @closeDialog="handleCloseDialog" :roleList="roleList"
                              :lineData="lineData"></createOrEditDialog>
        </el-dialog>

        <!-- 移除弹窗 -->
        <el-dialog
                :close-on-click-modal="false"
                title="移除用户"
                :visible.sync="dialogRemoveFlag"
                width="30%"
        >
                    <span>移除后
                        <span v-if="lineData&&lineData.username">{{lineData.username}}</span>
                        将无法登录</span>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogRemoveFlag = false">取 消</el-button>
                        <el-button type="danger" @click="handleRemoveDialogSure(lineData)">移除</el-button>
                    </span>
        </el-dialog>
      </div>
    </Pabody>
  </div>
</template>

<script>
  import {organization} from "@/assets/js/api";
  import {handleResponseErrors} from "@/assets/js/utils";
  import createOrEditDialog from '../dialog/createOrEditDialog'
  import {mapState} from "vuex";

  export default {
    name: "user",
    components: {
      createOrEditDialog,
    },
    computed: {...mapState(["usersPermission"])},
    data() {
      return {
        dialogRemoveFlag: false,
        dialogEditFlag: false,
        dialogRemarkFlag: false,
        dialogCreateFlag: false,
        lineData: null,
        input3: '',
        select: '',
        checkList: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        roleList: [],
        relevanceUserList: [],//关联用户-联想查询-用户名
        condition: {
          limit: 10,
          page: 1,
          username: '',
          email: '',
          roleIdArr: '',
          role_id: [],
        },
        total: null,
        userList: [],
        loadingFlag: false,
        multipleSelection: [],
        currentPage: 1,
      }
    },
    created() {
      this.initUserList()
      this.initAllUserList()
      this.initRoleList()
    },
    mounted() {
      this.$nextTick(() => {
        this.handleClickOut()
      })
    },
    methods: {
      handleClickOut() {
        let _this = this;
        document.addEventListener('click', function (e) {
          // 获取点击的区域是否包含菜单，如果包含，说明点击的是菜单以外，不包含则为菜单以内
          /*用户姓名联想查询*/
          if (document.getElementsByClassName('namePan-class') && document.getElementsByClassName('namePan-class')[0]) {
            let namePan = document.getElementsByClassName('namePan-class')[0].contains(e.target)
            if (namePan) {
              return
            } else {
              //联想查询，必须选择联想出来的内容，否则清空输入内容
              _this.autocompleteChange1();
            }
          }

          /*email联想查询*/
          if (document.getElementsByClassName('emailPan-class') && document.getElementsByClassName('emailPan-class')[0]) {
            let emailPan = document.getElementsByClassName('emailPan-class')[0].contains(e.target)
            if (emailPan) {
              return
            } else {
              //联想查询，必须选择联想出来的内容，否则清空输入内容
              _this.autocompleteChange2();
            }
          }

          /*所属商务联想查询*/
          /* let businessPan = document.getElementsByClassName('businessPan-class')[0].contains(e.target)
           if (businessPan) {
               return
           } else {
               //联想查询，必须选择联想出来的内容，否则清空输入内容
               _this.autocompleteChange3();
           }*/
        })
      },
      //用户列表所有名称获取（用于联想查询）
      async initAllUserList() {
        try {
          let data = {
            limit: 0,
          }
          let res = await organization.getUserList(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.relevanceUserList = res.user_list
          }
        } catch (error) {
          console.log(error);
        }
      },
      //联想查询，必须选择联想出来的内容，否则清空输入内容
      autocompleteChange1() {
        /*用户姓名*/
        if (this.relevanceUserList.some((value) => {
          return value.username === this.condition.username
        })) {
          this.condition.username = this.condition.username
        } else {
          this.condition.username = ''
        }
      },
      //联想查询，必须选择联想出来的内容，否则清空输入内容
      autocompleteChange2() {
        /*用户邮箱*/
        if (this.relevanceUserList.some((value) => {
          return value.email === this.condition.email
        })) {
          this.condition.email = this.condition.email
        } else {
          this.condition.email = ''
        }
      },
      //联想查询，必须选择联想出来的内容，否则清空输入内容
      /* autocompleteChange3() {
           /!*用户邮箱*!/
           if (this.relevanceUserList.some((value) => {
               return value.email === this.condition.email
           })) {
               this.condition.email = this.condition.email
           } else {
               this.condition.email = ''
           }
       },*/
      //用户列表数据获取
      async initUserList(flag) {
        this.loadingFlag = true
        //联想查询，必须选择联想出来的内容，否则清空输入内容
        this.autocompleteChange1();
        this.autocompleteChange2();
        // this.autocompleteChange3();
        this.condition.roleIdArr = []
        if (this.checkList && this.checkList.length > 0) {
          for (let i = 0; i < this.checkList.length; i++) {
            this.condition.roleIdArr.push(this.checkList[i].id)
          }
        } else {
          this.condition.roleIdArr = []
        }
        try {
          if (flag == 'page') {
            /* this.condition.username =  ''
             this.condition.email =  ''
             this.checkList = []
             this.condition.roleIdArr =  []*/
          } else {
            this.condition.page = 1
            this.condition.limit = 10
          }
          let data;
          data = {
            limit: this.condition.limit,
            page: this.condition.page,
            username: this.condition.username,
            email: this.condition.email,
            role_id: this.condition.roleIdArr,
          }
          let res = await organization.getUserList(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.loadingFlag = false
            this.userList = res.user_list
            this.total = res.total
          }
        } catch (error) {
          console.log(error);
        }
      },
      //角色列表数据获取
      async initRoleList() {
        try {
          let res = await organization.getRoleList();
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.roleList = res.roles
          }
        } catch (error) {
          console.log(error);
        }
      },
      //删除用户
      async delUser() {
        try {
          let data = {
            user_id: this.lineData.id
          }
          let res = await organization.delUser(data, this.lineData.id);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.dialogRemoveFlag = false
            //用户删除完，更新用户列表数据
            this.initUserList('page')
            this.initAllUserList()
          }
        } catch (error) {
          console.log(error);
        }
      },
      //姓名-联想查询
      querySearchAsync(queryString, cb) {
        let results = queryString ? this.relevanceUserList.filter(this.createStateFilter(queryString)) : this.relevanceUserList;
        cb(results);
      },
      //姓名-联想查询-过滤数据条件
      createStateFilter(queryString) {
        return (state) => {
          return (state.username.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        };
      },
      //姓名-关联用户联想查询-选中选择值
      handleSelect(item) {
        this.condition.username = item.username
        this.initUserList()
      },
      //邮箱-联想查询
      querySearchAsync2(queryString, cb) {
        let results = queryString ? this.relevanceUserList.filter(this.createStateFilter2(queryString)) : this.relevanceUserList;
        cb(results);
      },
      //邮箱-联想查询-过滤数据条件
      createStateFilter2(queryString) {
        return (state) => {
          return (state.email.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        };
      },
      //邮箱-关联用户联想查询-选中选择值
      handleSelect2(item) {
        this.condition.email = item.email
        this.initUserList()
      },
      /* //所属商务-联想查询
       querySearchAsync3(queryString, cb) {
           let results = queryString ? this.relevanceUserList.filter(this.createStateFilter3(queryString)) : this.relevanceUserList;
           cb(results);
       },
       //所属商务-联想查询-过滤数据条件
       createStateFilter3(queryString) {
           return (state) => {
               return (state.email.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
           };
       },
       //所属商务-关联用户联想查询-选中选择值
       handleSelect3(item) {
           this.condition.email = item.email
           this.initUserList()
       },*/
      handleCloseDialog(flag) {
        this.dialogEditFlag = false
        this.dialogCreateFlag = false
        if (flag) {
          this.initUserList('page')
        }
        /*新建用户之后需要刷新所有用户列表数据*/
        if (flag === 'f55') {
          this.initAllUserList()
        }
      },
      handleRemoveDialogSure() {
        this.delUser()
      },
      search() {
        this.initUserList()
      },
      clear() {
        this.condition.username = ''
        this.condition.email = ''
        this.checkList = []
        this.initUserList()
      },
      handleEmpty(value) {
        if (value) {
          return value
        } else {
          return '- -'
        }
      },
      handleClose(tag) {
        this.checkList.splice(this.checkList.indexOf(tag), 1);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleCreate() {
        this.dialogCreateFlag = true
      },
      handleEdit(index, row) {
        this.lineData = row
        this.dialogEditFlag = true
      },
      handleDelete(index, row) {
        this.dialogRemoveFlag = true
        this.lineData = row
      },
      handleSizeChange(val) {
        this.condition.limit = val
        this.initUserList('page')
      },
      handleCurrentChange(val) {
        this.condition.page = val
        this.initUserList('page')

      },
      remarkUser() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            message: "请至少选择一个用户",
            type: 'warning'
          });
        } else {
          this.dialogRemarkFlag = true
        }
      },
      havePermission(id) {
        return this.usersPermission.indexOf(id) !== -1
      },
    },
    watch: {}
  }
</script>
<style scoped lang="scss">
  .user-class {
    .w100 {
      width: 100%;
    }
    .w120 {
      width: 120px;
    }
    .w310 {
      width: 310px;
    }
    .margin-b20 {
      margin-bottom: 20px;
    }

    .conditions {
      display: flex;
      align-items: center;
    }
    .green-font {
      display: inline-block;
      cursor: pointer;
      color: #212d98;
      margin-right: 10px;

    }
    .green-font:hover {
      text-decoration: underline;
    }
    .page-position {
      margin-top: 31px;
      text-align: right;
    }
  }
</style>