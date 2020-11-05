<template>
  <div class="agent-list-class">
    <Pabody>
      <PaTitle class="flex-space-between">
        <span>代理商列表</span>
      </PaTitle>
      <section class="margin-t10">
        <!--搜索栏-->
        <div class="conditions">
          <span class="w357">代理商姓名：</span>
          <div class="namePan1-class w100 margin-r10">
            <el-autocomplete
                    class="w100 "
                    v-model="condition.username"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入代理商名称"
                    @select="handleSelect"
            >
              <template slot-scope="{item}">
                <div>{{item.username}}</div>
              </template>
            </el-autocomplete>
          </div>
          <span class="w170">邮箱：</span>
          <div class="emailPan1-class w100 margin-r10">
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
          <span class="w280">所属商务：</span>
          <div class="businessPan1-class w100 margin-r10">
            <el-autocomplete
                    class="w100"
                    v-model="condition.bd_name"
                    :fetch-suggestions="querySearchAsync3"
                    placeholder="请输入商务负责人"
                    @select="handleSelect3"
            >
              <template slot-scope="{item}">
                <div>{{item.bd_name}}</div>
              </template>
            </el-autocomplete>
          </div>
          <el-button @click="clear">清空</el-button>
          <el-button type="primary" @click="search()" class="margin-l10">搜索</el-button>
        </div>
        <!-- 表格 -->
        <div>
          <el-table
                  v-loading="loadingFlag"
                  :data="agent_list"
                  tooltip-effect="dark"
                  class="w100"
          >
            <el-table-column
                    label="代理商名称"
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
                    label="所属商务"
                    show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{ handleEmpty(scope.row.bd_name)}}</div>
              </template>
            </el-table-column>
            <el-table-column
                    v-if="havePermission(311,'查看') || havePermission(312,'分配商务')"
                    width="220"
                    label="操作">
              <template slot-scope="scope">
                <el-button
                        v-if="havePermission(312,'分配商务')"
                        @click="handleDistributeBusiness(scope.$index, scope.row)"
                        size="mini"
                        type="warning"
                        icon="el-icon-user"
                >分配商务
                </el-button>
                <el-button
                        v-if="havePermission(311,'查看')"
                        @click="handleView(scope.$index, scope.row)"
                        size="mini"
                        type="primary"
                        icon="el-icon-document"
                >查看
                </el-button>
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
        <!-- 查看详情弹窗 -->
        <el-dialog
                class="agent-detail-class"
                :close-on-click-modal="false"
                title="代理商详情"
                :visible.sync="agentDetailFlag"
                width="600"
        >
          <agentDetail v-if="agentDetailFlag" @closeDialog="handleCloseDialog" :roleList="roleList"
                       :lineData="lineData"></agentDetail>
        </el-dialog>
        <!--分配商务弹窗-->
        <el-dialog
                :close-on-click-modal="false"
                title="所属商务"
                :visible.sync="distributeBusinessFlag"
                width="600"
        >
          <div class="distribution" v-if="distributeBusinessFlag">
            <el-select v-model="businessSelect" placeholder="请选择">
              <el-option
                      v-for="item in businessOptions"
                      :key="item.value"
                      :label="item.label + '(' + item.email + ')'"
                      :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-check" @click="bindingBusiness"
            >确定
            </el-button
            >
          </div>
        </el-dialog>
      </div>
    </Pabody>
  </div>
</template>

<script>
  import {agentManagement, getBusiness} from "@/assets/js/api";
  import {handleResponseErrors, showMsg} from "@/assets/js/utils";
  import agentDetail from './agentDetail/index';
  import {mapState} from "vuex";

  export default {
    name: "agentList",
    components: {
      agentDetail,
    },
    computed: {...mapState(["usersPermission"])},
    data() {
      return {
        businessSelect: '',
        businessOptions: [],
        businessList: [],
        agentDetailFlag: false,
        distributeBusinessFlag: false,
        lineData: null,
        checkList: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        roleList: [],
        relevanceAgentList: [],//关联代理商-联想查询-用户名
        condition: {
          limit: 10,
          page: 1,
          username: '',
          email: '',
          bd_name: '',
        },
        total: null,
        agent_list: [],
        loadingFlag: false,
        multipleSelection: [],
        currentPage: 1,
      }
    },
    created() {
      this.initagentList()
      this.initAllAgentList()
      this.getBusinessOptions()
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
          if (document.getElementsByClassName('namePan1-class') && document.getElementsByClassName('namePan1-class')[0]) {
            let namePan1 = document.getElementsByClassName('namePan1-class')[0].contains(e.target)
            if (namePan1) {
              return
            } else {
              //联想查询，必须选择联想出来的内容，否则清空输入内容
              _this.autocompleteChange1();
            }
          }
          if (document.getElementsByClassName('emailPan1-class') && document.getElementsByClassName('emailPan1-class')[0]) {
            /*email联想查询*/
            let emailPan1 = document.getElementsByClassName('emailPan1-class')[0].contains(e.target)
            if (emailPan1) {
              return
            } else {
              //联想查询，必须选择联想出来的内容，否则清空输入内容
              _this.autocompleteChange2();
            }
          }
          if (document.getElementsByClassName('businessPan1-class') && document.getElementsByClassName('businessPan1-class')[0]) {
            /*商务联想查询*/
            let businessPan1 = document.getElementsByClassName('businessPan1-class')[0].contains(e.target)
            if (businessPan1) {
              return
            } else {
              //联想查询，必须选择联想出来的内容，否则清空输入内容
              _this.autocompleteChange3();
            }
          }
        })
      },
      //用户列表所有名称获取（用于联想查询）
      async initAllAgentList() {
        try {
          let data = {
            limit: 0,
          }
          let res = await agentManagement.getAgentList(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.relevanceAgentList = res.agent_list
          }
        } catch (error) {
          console.log(error);
        }
      },
      async getBusinessOptions() {
        try {
          let res = await getBusiness.BusinessOptions();
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          this.businessOptions = res.user_list.map(item => {
            return {
              value: item.id,
              label: item.username,
              email: item.email
            };
          });
        } catch (error) {
          console.log(error);
        }
      },
      async distributeBusiness(id) {
        try {
          let data = {
            fpp_id: id,
          }
          let res = await agentManagement.distributeBusiness(data, this.businessSelect);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.distributeBusinessFlag = false
            this.initagentList()//分配商务成功之后刷新列表
            this.initAllAgentList()//分配商务成功之后刷新列表
          }
        } catch (error) {
          console.log(error);
        }
      },
      //联想查询，必须选择联想出来的内容，否则清空输入内容
      autocompleteChange1() {
        /*用户姓名*/
        if (this.relevanceAgentList.some((value) => {
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
        if (this.relevanceAgentList.some((value) => {
          return value.email === this.condition.email
        })) {
          this.condition.email = this.condition.email
        } else {
          this.condition.email = ''
        }
      },
      //联想查询，必须选择联想出来的内容，否则清空输入内容
      autocompleteChange3() {
        /*用户邮箱*/
        if (this.relevanceAgentList.some((value) => {
          return value.bd_name === this.condition.bd_name
        })) {
          this.condition.bd_name = this.condition.bd_name
        } else {
          this.condition.bd_name = ''
        }
      },
      //代理商列表数据获取
      async initagentList(flag) {
        this.loadingFlag = true
        //联想查询，必须选择联想出来的内容，否则清空输入内容
        this.autocompleteChange1();
        this.autocompleteChange2();
        this.autocompleteChange3();
        try {
          if (flag === 'page') {
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
            bd: this.condition.bd_name,
          }
          let res = await agentManagement.getAgentList(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.loadingFlag = false
            this.agent_list = res.agent_list
            this.total = res.total
          }
        } catch (error) {
          console.error(error);
        }
      },
      //姓名-联想查询
      querySearchAsync(queryString, cb) {
        let results = queryString ? this.relevanceAgentList.filter(this.createStateFilter(queryString)) : this.relevanceAgentList;
        cb(results);
      },
      //姓名-联想查询-过滤数据条件
      createStateFilter(queryString) {
        return (state) => {
          if (state.username) {
            return (state.username.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
          }
        };
      },
      //姓名-关联用户联想查询-选中选择值
      handleSelect(item) {
        this.condition.username = item.username
        this.initagentList()
      },
      //邮箱-联想查询
      querySearchAsync2(queryString, cb) {
        let results = queryString ? this.relevanceAgentList.filter(this.createStateFilter2(queryString)) : this.relevanceAgentList;
        cb(results);
      },
      //邮箱-联想查询-过滤数据条件
      createStateFilter2(queryString) {
        return (state) => {
          if (state.email) {
            return (state.email.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
          }
        };
      },
      //邮箱-关联用户联想查询-选中选择值
      handleSelect2(item) {
        this.condition.email = item.email
        this.initagentList()
      },
      //所属商务-联想查询
      querySearchAsync3(queryString, cb) {
        let results = queryString ? this.relevanceAgentList.filter(this.createStateFilter3(queryString)) : this.relevanceAgentList;
        cb(results);
      },
      //所属商务-联想查询-过滤数据条件
      createStateFilter3(queryString) {
        return (state) => {
          if (state.bd_name) {
            return (state.bd_name.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
          }
        };
      },
      //所属商务-关联用户联想查询-选中选择值
      handleSelect3(item) {
        this.condition.bd_name = item.bd_name
        this.initagentList()
      },
      search() {
        this.initagentList()
      },
      clear() {
        this.condition.username = ''
        this.condition.email = ''
        this.condition.bd_name = ''
        this.initagentList()
      },
      handleEmpty(value) {
        if (value) {
          return value
        } else {
          return '- -'
        }
      },
      handleView(index, row) {
        this.lineData = row
        this.agentDetailFlag = true
      },
      handleDistributeBusiness(index, row) {
        this.lineData = row
        this.businessSelect = ''
        this.distributeBusinessFlag = true
      },
      async bindingBusiness() {
        if (!this.businessSelect) {
          showMsg("请选择商务", 3);
          return;
        } else {
          this.distributeBusiness(this.lineData.id)
        }
      },
      handleCloseDialog() {
        this.agentDetailFlag = false
      },
      handleSizeChange(val) {
        this.condition.limit = val
        this.initagentList('page')
      },
      handleCurrentChange(val) {
        this.condition.page = val
        this.initagentList('page')
      },
      havePermission(id, name) {
        return this.usersPermission.indexOf(id) !== -1
      },
    },
  }
</script>
<style lang="scss">
  .agent-detail-class {
    .el-dialog__body {
      padding-top: 0;
      height: calc(70vh - 79px);
      overflow-y: auto;
    }
  }
</style>
<style scoped lang="scss">
  .w100 {
    width: 100%;
  }

  .w357 {
    width: 357px;
  }

  .w170 {
    width: 170px;
  }

  .w280 {
    width: 280px;
  }

  .w120 {
    width: 120px;
  }

  .w226 {
    width: 226px;
  }

  .margin-b20 {
    margin-bottom: 20px;
  }

  .agent-list-class {
    .distribution {
      display: flex;
      justify-content: space-between;
      padding: 20px;
    }
    .conditions {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
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