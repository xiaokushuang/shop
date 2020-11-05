<template>
  <div class="record-class">
    <!--检索条件-->
    <div class="margin-b25">
      <el-row :gutter="20" class="flex-box">
        <el-col :span="2">
          <span class="demonstration">回访时间</span>
        </el-col>
        <el-col :span="9">
          <!--时间-->
          <el-date-picker
                  v-model="timeValue"
                  type="datetimerange"
                  :picker-options="pickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="timestamp"
                  align="right">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <span class="demonstration">操作人</span>
        </el-col>
        <el-col :span="9">
          <el-input v-model="condition.follower" placeholder="请输入操作人"></el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="search()">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <!--表格-->
    <div class="margin-b25">
      <el-table
              v-loading="loadingFlag"
              element-loading-spinner="el-icon-loading"
              :data="remark_list"
              style="width: 100%"
              max-height="300">
        <el-table-column
                prop="create_time"
                label="回访时间">
          <template slot-scope="scope">
            <span>{{scope.row.create_time | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
                prop="username"
                label="操作人">
        </el-table-column>
        <el-table-column
                prop="remark"
                label="记录内容">
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
    <!--关闭按钮-->
    <div class="flex-box">
      <el-button type="primary" @click="handleCloseDialog()">关闭</el-button>
    </div>
  </div>
</template>

<script>
  import {returnVisit} from "@/assets/js/api";
  import mixins from "@/mixins";
  import {handleResponseErrors} from "@/assets/js/utils";

  export default {
    mixins: [mixins],
    name: "record",
    props: [
      "storeName",
      "sellerId"
    ],
    data() {
      return {
        loadingFlag: false,
        total: 0,
        timeValue: '',
        condition: {
          limit: 10,
          page: 1,
          follower: '',
          since: null,
          until: null,
        },
        remark_list: [],
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
      };
    },
    created() {
      this.getFollowRemark()
    },
    methods: {
      search() {
        if (this.timeValue) {
          this.condition.since = this.timeValue[0]
          this.condition.until = this.timeValue[1]
        } else {
          this.condition.since = null
          this.condition.until = null
        }
        this.getFollowRemark()
      },
      //回访记录列表
      getFollowRemark(flag) {
        this.loadingFlag = true
        let data = {}
        data = {
          limit: this.condition.limit,
          page: this.condition.page,
          follower: this.condition.follower,
          since: this.condition.since,
          until: this.condition.until,
        }
        if (flag !== 'page') {
          this.condition.page = 1
          this.condition.limit = 10
        }
        if (this.storeName) {
          data.store_name = this.storeName
        }
        if (this.sellerId) {
          data.seller_id = this.sellerId
        }

        returnVisit.getFollowRemark(data).then((res) => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.loadingFlag = false
            this.remark_list = res.remark_list
            this.total = res.total
          }
        })
      },
      handleSizeChange(val) {
        this.condition.limit = val
        this.getFollowRemark('page')
      },
      handleCurrentChange(val) {
        this.condition.page = val
        this.getFollowRemark('page')
      },
      handleCloseDialog() {
        this.$emit('closeRecordDialog')
      },
    },
  }
</script>

<style lang="scss">
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .margin-b25 {
    margin-bottom: 25px;
  }

  .record-class {

    .el-range-editor.el-input__inner {
      width: 100%;
    }
    .el-date-editor .el-range-separator {
      width: 7%;
    }
    .page-position {
      text-align: right;
      margin-top: 20px;
    }
  }

</style>