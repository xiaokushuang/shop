<template>
  <div>
    <router-view/>
    <Pabody v-show="!isDetails">
      <PaTitle>
        运营审核
      </PaTitle>
      <div class="fromRow">
        <div class="fromCol">
          <div class="fromLabel">
            商户名称
          </div>
          <el-input
                  class="fromContent"
                  v-model="form.name"
                  placeholder="请输入商户名称"
          ></el-input>
        </div>
        <div class="fromCol">
          <div class="fromLabel">
            邮箱
          </div>
          <el-input
                  class="fromContent"
                  v-model="form.email"
                  placeholder="请输入邮箱"
          ></el-input>
        </div>
        <div class="fromCol">
          <div class="fromLabel">
            手机号
          </div>
          <el-input
                  class="fromContent"
                  v-model="form.phoneno"
                  placeholder="请输入手机号"
          ></el-input>
        </div>
        <div class="fromCol">
          <div class="fromLabel">
            商户类型
          </div>
          <el-select
                  class="fromContent"
                  v-model="form.MerchantType"
                  placeholder="请选择商户类型"
                  clearable
          >
            <el-option
                    v-for="item in MerchantTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="fromRow">
        <div class="fromCol">
          <div class="fromLabel">
            审核状态
          </div>
          <el-select
                  class="fromContent"
                  v-model="form.AuditStatus"
                  placeholder="请选择审核状态"
                  clearable
          >
            <el-option
                    v-for="item in AuditStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="fromCol large-col">
          <div class="fromLabel">
            录入时间
          </div>
          <el-date-picker
                  v-model="form.longTime"
                  value-format="timestamp"
                  class="fromContent"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="PickerOptions"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="fromRow">
        <div class="fromCol all-col end-col">
          <el-button class="formButt" @click="clearFrom">清空</el-button>
          <el-button
                  class="formButt"
                  type="primary"
                  icon="el-icon-search"
                  @click="searchList()"
          >搜索
          </el-button
          >
        </div>
      </div>
    </Pabody>
    <Pabody v-show="!isDetails" style="margin-top:20px">
      <PaTable>
        <tr>
          <th>审核ID</th>
          <th>商户ID</th>
          <th class="isflex" @click="sortTime">
            <span>录入时间</span>
            <i class="el-icon-d-caret" v-if="sortType == ''"></i>
            <i class="el-icon-caret-top" v-else-if="sortType == 'up'"></i>
            <i class="el-icon-caret-bottom" v-else-if="sortType == 'desc'"></i>
          </th>
          <th>商户名称</th>
          <th>商户联系人</th>
          <th>邮箱</th>
          <th>手机号</th>
          <th>商户类型</th>
          <th>运营审核状态</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in list" :key="index">
          <td>{{ item.request_id }}</td>
          <td>{{ item.seller_id }}</td>
          <td>{{ item.create_time | formatTime }}</td>
          <td>{{ item.seller_name }}</td>
          <td>{{ item.seller_contract }}</td>
          <td>{{ item.seller_email }}</td>
          <td>{{ item.seller_phone }}</td>
          <td>{{ item.seller_type | MerchantOption }}</td>
          <td>{{ item.ops_review_status | AuditStatusOption }}</td>
          <td>
            <el-button
                    v-if="havePermission(110,'查看')"
                    style="width:97px;"
                    @click="gotodetails(item.request_id,'1')"
                    size="mini"
                    type="primary"
            >查看
            </el-button>
            <el-button
                    v-if="item.ops_review_status == null&&havePermission(111,'商户审核')"
                    @click="gotodetails(item.request_id,'2')"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit-outline"
            >商户审核
            </el-button>
          </td>
        </tr>
      </PaTable>

      <div class="MLeft">
        <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page.sync="page.count"
                :page-size="page.pageSize"
                layout="total, prev, pager, next"
                :total="page.total"
        >
        </el-pagination>
      </div>
    </Pabody>
  </div>
</template>

<script>
  import {handleResponseErrors} from "@/assets/js/utils";
  import {getApproval} from "@/assets/js/api";
  import mixins from "@/mixins";
  import {mapState} from "vuex";

  export default {
    mixins: [mixins],
    data() {
      return {
        form: {
          name: "", //商户名称
          longTime: null,
          email: "", //邮箱
          phoneno: "", //手机号
          MerchantType: null, //商户类型
          AuditStatus: null //审核状态
        },
        search: {
          //查询生效参数
          name: "", //商户名称
          longTime: null,
          email: "", //邮箱
          phoneno: "", //手机号
          MerchantType: null, //商户类型
          AuditStatus: null //审核状态
        },
        page: {
          total: 0, //总数
          pageSize: 10, //页长
          count: 1
        },
        list: [],
        isDetails: false,
        sortType: "" //up/desc
      };
    },
    computed: {...mapState(["usersPermission"])},
    mounted() {
      this.getList();
    },
    beforeUpdate() {
      let url = this.$route.path.toString();
      if (url.match(/details/)) {
        this.isDetails = true;
      } else {
        this.isDetails = false;
      }
    },
    watch: {
      isDetails(vel) {
        if (!vel) {
          this.getList();
        }
      }
    },
    methods: {
      havePermission(id) {
        return this.usersPermission.indexOf(id) !== -1
      },
      searchList() {
        this.page.count = 1;
        this.sortType = "";
        this.search = JSON.parse(JSON.stringify(this.form));
        this.getList();
      },
      clearFrom() {
        this.form = {
          name: "", //商户名称
          longTime: null,
          email: "", //邮箱
          phoneno: "", //手机号
          MerchantType: null, //商户类型
          AuditStatus: null //审核状态
        };
      },
      async getList() {
        try {
          let data = {
            sort_type: this.sortType === "" ? null : this.sortType,
            seller_name: this.search.name,
            seller_email: this.search.email,
            seller_type:
                this.search.MerchantType === "" ? null : this.search.MerchantType,
            seller_phone: this.search.phoneno,
            ops_review_status:
                this.search.AuditStatus === "" ? null : this.search.AuditStatus,
            create_date_start: this.search.longTime
                ? this.search.longTime[0]
                : null,
            create_date_end: this.search.longTime
                ? this.search.longTime[1]
                : null,
            page: this.page.count,
            limit: this.page.pageSize
          };
          let res = await getApproval.getApprovalList(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          this.list = res.seller_list;
          this.page.total = res.total;
        } catch (error) {
          console.log(error);
        }
      },
      handleCurrentChange(val) {
        this.page.count = val;
        this.getList();
      },
      gotodetails(id, btn) {
        this.$router.push({
          path: `/OperationAudit/details/${id}`,
          query: {
            flag: btn
          }
        });
      },
      sortTime() {
        if (this.sortType == "desc" || this.sortType == "") {
          this.sortType = "up";
        } else {
          this.sortType = "desc";
        }
        this.getList();
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/css/toExamine.scss";
</style>
