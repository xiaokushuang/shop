<template>
  <div>
    <div class="data-row">
      <div class="data-col">
        <div class="data-label">{{ content }}审核结果:</div>
        <div class="data-content">
          <el-select :disabled="!statusFlag&&$route.query.flag==='1'"  v-model="value.findingsOfAudit" placeholder="请选择">
            <el-option
              v-for="item in FindingsOfAuditOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="data-col" v-if="value.findingsOfAudit != 1">
        <div class="data-label">
          账户类型:
        </div>
        <div class="data-content">
          <el-select :disabled="!statusFlag&&$route.query.flag==='1'" v-model="value.AccountType" placeholder="请选择">
            <el-option
              v-for="item in AccountTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="data-col" v-if="value.findingsOfAudit != 1 && value.AccountType===2">
        <div class="data-label">
          建议额度:
        </div>
        <div class="data-content">
          <el-input
            v-model="value.SuggestedQuota"
            placeholder="精确到小数点后两位"
          ></el-input>
        </div>
      </div>
      <div class="data-col" v-if="value.findingsOfAudit != 1 && value.AccountType===2">
        <div class="data-label">
          建议账期:
        </div>
        <div class="data-content">
          <el-select v-model="value.ProposedAccountPeriod" placeholder="请选择">
            <el-option
              v-for="item in AccountPeriodOptions"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="data-col all-col label">
        <div class="data-label">
          备注:
        </div>
        <div class="data-text-area">
          <el-input
            :disabled="!statusFlag&&$route.query.flag==='1'"
            type="textarea"
            :minRows="1"
            placeholder="请输入备注（审核未通过时，需详细备注驳回原因）"
            v-model="value.remarks"
          >
          </el-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from "@/mixins";
export default {
  name: "AuditContainer",
  mixins: [mixins],
  props: {
    ApplicationQuota: {
      type: String,
      default: ""
    },
    ApplicationPeriod: {
      type: String,
      default: ""
    },
    remarks: {
      type: String,
      default: ""
    },
    value: {
      type: Object,
      default: () => {
        return {
          findingsOfAudit: null, //审核结果
          AccountType: null, //账户类型
          SuggestedQuota: null, //建议额度
          ProposedAccountPeriod: null, //建议账期
          remarks: "" //备注
        };
      }
    },
    statusFlag:{

    }
  },
  data() {
    return {
      content: ""
    };
  },
  created() {
    let url = this.$route.path.toString();
    if (url.match(/OperationAudit/)) {
      this.content = "运营";
    } else if (url.match(/FinancialAudit/)) {
      this.content = "财务";
    } else if (url.match(/BusinessReview/)) {
        this.content = "商务";
    }
    console.log('路由传参',this.$route)

  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/toExamineDetails.scss";
.data-row {
  .data-col {
    .data-label {
      min-width: 90px;
      text-align: right;
    }
  }
}
</style>
