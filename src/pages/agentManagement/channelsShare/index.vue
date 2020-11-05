<template>
  <div class="channels-share-class">
    <Pabody>
      <PaTitle v-if="!fpp_user_id" class="flex-space-between">
        <span>渠道列表</span>
      </PaTitle>
      <section class="margin-t10">
        <!--搜索栏-->
        <div v-if="!fpp_user_id" class="conditions">
          <div class="w75percent">
            <el-date-picker
                    v-model="condition.date"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="timestamp"
                    align="right">
            </el-date-picker>
            <el-button @click="clear" class="margin-l10">清空</el-button>
            <el-button type="primary" @click="search()" class="margin-l10">搜索</el-button>
          </div>
          <div class="w25percent">
            <el-input
                    v-model="url"
                    placeholder="点击按钮生成分享链接"
                    class="input-with-select margin-l10"
            >
              <el-button slot="append" @click="copyUrl">生成分享链接</el-button>
            </el-input>
          </div>
        </div>
        <!-- 表格 -->
        <div>
          <el-table
                  v-loading="loadingFlag"
                  :data="agentSellerList"
                  tooltip-effect="dark"
                  class="w100"
          >
            <el-table-column
                    label="入驻时间"
            >
              <template slot-scope="scope">
                <div>
                  {{scope.row.create_time | formatTime}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="商户姓名"
            >
              <template slot-scope="scope">
                <div>{{ handleEmpty(scope.row.username)}}</div>
              </template>
            </el-table-column>
            <el-table-column
                    prop="role"
                    label="站点信息"
                    show-overflow-tooltip>
              <template slot-scope="scope">
                                <span v-if="scope.row.stores&&scope.row.stores.length>0">
                                     <span v-for="(data,index) in scope.row.stores" :key="index">
                                         <span>
                                             {{data}}
                                         </span>
                                         <span v-if="index!==scope.row.stores.length-1">,</span>
                                     </span>
                                </span>
                <span v-else>- -</span>
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
    </Pabody>
  </div>
</template>

<script>
  import {agentManagement} from "@/assets/js/api";
  import {handleResponseErrors} from "@/assets/js/utils";
  import {mapState} from "vuex";
  import copy from "copy-to-clipboard";
  import mixins from "@/mixins";

  export default {
    mixins: [mixins],
    name: "channelsShare",
    props: [
      "fpp_user_id"
    ],
    components: {},
    computed: {...mapState(["userMsg", "usersPermission"])},
    data() {
      return {
        url: "",
        condition: {
          limit: 10,
          page: 1,
          date: '',
          create_date_start: '',
          create_date_end: '',
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        total: null,
        agentSellerList: [],
        loadingFlag: false,
      }
    },
    created() {
      this.initAgentSeller()
    },
    mounted() {

    },
    methods: {
      //渠道列表数据获取
      async initAgentSeller(flag) {
        this.loadingFlag = true
        if (this.condition.date) {
          this.condition.create_date_start = this.condition.date[0]
          this.condition.create_date_end = this.condition.date[1]
        } else {
          this.condition.create_date_start = null
          this.condition.create_date_end = null
        }
        try {
          if (flag == 'page') {
          } else {
            this.condition.page = 1
            this.condition.limit = 10
          }
          let data;
          data = {
            create_date_start: this.condition.create_date_start,
            create_date_end: this.condition.create_date_end,
            limit: this.condition.limit,
            page: this.condition.page,
            fpp_user_id: this.fpp_user_id,
          }
          let res = await agentManagement.getAgentSeller(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.agentSellerList = res.seller_agent_list
            this.loadingFlag = false
            this.total = res.total
          }
        } catch (error) {
          console.log(error);
        }
      },
      copyUrl() {
        let path =
            process.env.NODE_ENV == "production"
                ? "https://business.funpinpin.com/"
                : "https://fpp-merchants-test.firebaseapp.com/";
        this.url = `${path}register?business=${encodeURIComponent(this.userMsg.id) ||
        ""}`;
        copy(this.url);
        this.$message({
          message: "复制成功",
          type: "success"
        });
      },
      search() {
        this.initAgentSeller()
      },
      clear() {
        this.condition.date = []
        this.condition.create_date_start = null
        this.condition.create_date_end = null
        this.initAgentSeller()
      },
      handleEmpty(value) {
        if (value) {
          return value
        } else {
          return '- -'
        }
      },
      handleSizeChange(val) {
        this.condition.limit = val
        this.initAgentSeller('page')
      },
      handleCurrentChange(val) {
        this.condition.page = val
        this.initAgentSeller('page')

      },
      havePermission(id, name) {
        return this.usersPermission.indexOf(id) !== -1
      },
    },
  }
</script>
<style lang="scss">
  .channels-share-class {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 450px;
    }
    .w100 {
      width: 100%;
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
    .w25percent {
      width: 25%;
    }
    .w75percent {
      width: 75%;
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