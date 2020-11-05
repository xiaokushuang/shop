<template>
  <Pabody>
    <PaTitle>
      {{ content }}
    </PaTitle>
    <PaTitleZ>
      基本信息
    </PaTitleZ>
    <div class="data-row">
      <div class="data-col">
        <div class="data-label">
          商户名称:
        </div>
        <div class="data-content">
          {{ dataBody.username || "" }}
        </div>
      </div>
      <div class="data-col">
        <div class="data-label">
          商户联系人:
        </div>
        <div class="data-content">
          {{ dataBody.login_name || "" }}
        </div>
      </div>
      <div class="data-col">
        <div class="data-label">
          邮箱:
        </div>
        <div class="data-content">{{ dataBody.email || "" }}</div>
      </div>
      <div class="data-col">
        <div class="data-label">
          手机号:
        </div>
        <div class="data-content">{{ dataBody.phone || "" }}</div>
      </div>
      <div class="data-col">
        <div class="data-label">
          是否从事过跨境电商：
        </div>
        <div class="data-content">
          {{ dataBody.cross_board_shop_history ? "是" : "否" }}
        </div>
      </div>
      <div class="data-col">
        <div class="data-label">
          单日营业额：
        </div>
        <div class="data-content">
          {{ dataBody.daily_revenue | DailyTurnoverOption }}
        </div>
      </div>
      <div class="data-col">
        <div class="data-label">
          商品类型：
        </div>
        <div class="data-content">
          {{ dataBody.product_types || "" }}
        </div>
      </div>
      <div class="data-col">
        <div class="data-label">
          客户来源：
        </div>
        <div class="data-content">
          <span>{{ dataBody.affiliate_with || "" }}</span>
          <span v-if="dataBody.bd_name_of_refer">-{{dataBody.bd_name_of_refer || ""}}</span>
        </div>
      </div>
    </div>
    <div class="data-row">
      <div class="data-col column all-col">
        <div class="data-label">
          {{ dataBody.seller_type == 2 ? "公司地址：" : "详细地址" }}
        </div>
        <div class="data-content">
          {{
          dataBody.address && dataBody.detail_address
          ? dataBody.address.replace(",", "-") +
          "-" +
          dataBody.detail_address
          : ""
          }}
        </div>
      </div>
    </div>
    <PaTitleZ>
      {{ dataBody.seller_type == 2 ? "企业信息" : "个人信息" }}
    </PaTitleZ>
    <div class="data-row">
      <div class="data-col">
        <div class="data-label">
          是否在木瓜进行过广告业务:
        </div>
        <div class="data-content">
          {{ dataBody.have_ppy_ad_account ? "是" : "否" }}
        </div>
      </div>
      <div class="data-col" v-if="dataBody.have_ppy_ad_account">
        <div class="data-label">
          曾在木瓜使用的广告账户:
        </div>
        <div class="data-content">
          {{ dataBody.ppy_ad_account || "" }}
        </div>
      </div>
    </div>
    <div class="data-row">
      <div class="data-Img-col" v-if="dataBody.id_card_human_page_gkey">
        <div class="data-Img-title">
          <div class="data-Img-label">
            {{
            dataBody.seller_type == 2 ? "法人身份证人像页：" : "身份证人像页:"
            }}
          </div>
        </div>
        <div
                class="data-Img-box"
                @click="
            OpenPopup(
              `https://img.funpinpin.com/${dataBody.id_card_human_page_gkey}`
            )
          "
        >
          <div v-if="dataBody.id_card_human_page_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="
              `https://img.funpinpin.com/${dataBody.id_card_human_page_gkey}`
            "
                  alt=""
          />
        </div>
      </div>
      <div class="data-Img-col" v-if="dataBody.id_card_country_page_gkey">
        <div class="data-Img-title">
          <div class="data-Img-label">
            {{
            dataBody.seller_type == 2
            ? "法人身份证国徽页:"
            : "身份证人像页国徽页:"
            }}
          </div>
        </div>
        <div
                class="data-Img-box"
                @click="
            OpenPopup(
              `https://img.funpinpin.com/${dataBody.id_card_country_page_gkey}`
            )
          "
        >
          <div v-if="dataBody.id_card_country_page_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="
              `https://img.funpinpin.com/${dataBody.id_card_country_page_gkey}`
            "
                  alt=""
          />
        </div>
      </div>
    </div>
    <div class="data-row">
      <div class="data-Img-col" v-if="dataBody.seller_type == 2">
        <div class="data-Img-title">
          <div class="data-Img-label">
            营业执照:
          </div>
        </div>
        <div
                v-if="dataBody.business_license_gkey"
                class="data-Img-box"
                @click="
            OpenPopup(
              `https://img.funpinpin.com/${dataBody.business_license_gkey}`
            )
          "
        >
          <div v-if="dataBody.business_license_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.business_license_gkey}`"
                  alt=""
          />
        </div>
      </div>
      <div class="data-Img-col">
        <div class="data-Img-title">
          <div class="data-Img-label">
            过往店铺订单明细:
          </div>
        </div>
        <div
                v-if="dataBody.order_detail_gkey"
                class="data-Img-box"
                @click="
            OpenPopup(`https://img.funpinpin.com/${dataBody.order_detail_gkey}`)
          "
        >
          <div v-if="dataBody.order_detail_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.order_detail_gkey}`"
                  alt=""
          />
        </div>
      </div>
      <div class="data-Img-col">
        <div class="data-Img-title">
          <div class="data-Img-label">
            过往店铺发货明细:
          </div>
        </div>
        <div
                v-if="dataBody.transport_detail_gkey"
                class="data-Img-box"
                @click="
            OpenPopup(
              `https://img.funpinpin.com/${dataBody.transport_detail_gkey}`
            )
          "
        >
          <div v-if="dataBody.transport_detail_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.transport_detail_gkey}`"
                  alt=""
          />
        </div>
      </div>
    </div>
    <PaTitleZ>
      财务信息
    </PaTitleZ>
    <div class="data-row">
      <div class="data-Img-col">
        <div class="data-Img-title">
          <div class="data-Img-label">
            银行账户流水:
          </div>
        </div>
        <div
                v-if="dataBody.bank_revenue_gkey"
                class="data-Img-box"
                @click="
            OpenPopup(`https://img.funpinpin.com/${dataBody.bank_revenue_gkey}`)
          "
        >
          <div v-if="dataBody.bank_revenue_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.bank_revenue_gkey}`"
                  alt=""
          />
        </div>
      </div>
      <div class="data-Img-col">
        <div class="data-Img-title">
          <div class="data-Img-label">
            Paypal账户余额:
          </div>
        </div>
        <div
                v-if="dataBody.paypal_balance_gkey"
                class="data-Img-box"
                @click="
            OpenPopup(
              `https://img.funpinpin.com/${dataBody.paypal_balance_gkey}`
            )
          "
        >
          <div v-if="dataBody.paypal_balance_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.paypal_balance_gkey}`"
                  alt=""
          />
        </div>
      </div>
      <div class="data-Img-col">
        <div class="data-Img-title">
          <div class="data-Img-label">
            保证协议:
          </div>
        </div>
        <div
                v-if="dataBody.assure_protocol_gkey"
                class="data-Img-box"
                @click="
            OpenPopup(
              `https://img.funpinpin.com/${dataBody.assure_protocol_gkey}`
            )
          "
        >
          <div v-if="dataBody.assure_protocol_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.assure_protocol_gkey}`"
                  alt=""
          />
        </div>
      </div>
      <div class="data-Img-col">
        <div class="data-Img-title">
          <div class="data-Img-label">
            使用协议:
          </div>
        </div>
        <div
                v-if="dataBody.use_protocol_gkey"
                class="data-Img-box"
                @click="
            OpenPopup(`https://img.funpinpin.com/${dataBody.use_protocol_gkey}`)
          "
        >
          <div v-if="dataBody.use_protocol_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.use_protocol_gkey}`"
                  alt=""
          />
        </div>
      </div>
      <div class="data-Img-col">
        <div class="data-Img-title">
          <div class="data-Img-label">
            预付/后付协议:
          </div>
        </div>
        <div
                v-if="dataBody.pre_after_use_gkey"
                class="data-Img-box"
                @click="
            OpenPopup(
              `https://img.funpinpin.com/${dataBody.pre_after_use_gkey}`
            )
          "
        >
          <div v-if="dataBody.pre_after_use_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.pre_after_use_gkey}`"
                  alt=""
          />
        </div>
      </div>
      <div class="data-Img-col" v-if="dataBody.behalf_gkey">
        <div class="data-Img-title">
          <div class="data-Img-label">
            代付协议:
          </div>
        </div>
        <div
                class="data-Img-box"
                @click="
            OpenPopup(`https://img.funpinpin.com/${dataBody.behalf_gkey}`)
          "
        >
          <div v-if="dataBody.behalf_gkey.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img
                  v-else
                  :src="`https://img.funpinpin.com/${dataBody.behalf_gkey}`"
                  alt=""
          />
        </div>
      </div>
    </div>
    <PaTitleZ v-if="SupplementAgreementList.length > 0">
      补充协议
    </PaTitleZ>
    <div class="data-row">
      <div
              class="data-Img-col"
              v-for="item in SupplementAgreementList"
              :key="item.typename"
      >
        <div class="data-Img-title">
          <div class="data-Img-label">
            {{ item.typename }}:
          </div>
        </div>
        <div
                class="data-Img-box"
                @click="OpenPopup(`https://img.funpinpin.com/${item.value}`)"
        >
          <div v-if="item.value.includes('.pdf')">{{"点击查看此pdf"}}</div>
          <img v-else :src="`https://img.funpinpin.com/${item.value}`" alt=""/>
        </div>
      </div>
    </div>
    <PaTitleZ>
      审核信息
    </PaTitleZ>
    <div
            class="data-row"
            v-if="
        (reviewer_role == 'bd' && dataBody.bd_review_status != null) ||
          isBusinessListings
      "
    >
      <div class="data-col">
        <div class="data-label">
          商务审核:
        </div>
        <div class="data-content">
          <span v-if="dataBody.bd_review_time">{{dataBody.bd_review_time | formatTime}}</span>
          {{ dataBody.bd_review_status | AuditStatusOption }}
        </div>
      </div>
      <div class="data-col" v-if="dataBody.bd_review_status === 0">
        <div class="data-label">
          账户类型:
        </div>
        <div class="data-content">
          {{ dataBody.bd_suggest_ad_account_type | AccountTypeOption }}
        </div>
      </div>
      <div class="data-col" v-if="dataBody.bd_review_status === 0">
        <div class="data-label">
          建议额度:
        </div>
        <div class="data-content">
          {{ dataBody.bd_suggest_quota }}
        </div>
      </div>
      <div class="data-col" v-if="dataBody.bd_review_status === 0">
        <div class="data-label">
          建议账期:
        </div>
        <div class="data-content">
          <span v-if="dataBody.bd_suggest_billing_period">
            {{ dataBody.bd_suggest_billing_period }}期
          </span>
        </div>
      </div>
      <div class="data-col column all-col" v-if="dataBody.bd_remark">
        <div class="data-label">
          备注:
        </div>
        <div class="data-content">
          {{ dataBody.bd_remark || "" }}
        </div>
      </div>
    </div>
    <div
            class="data-row"
            v-if="
        (reviewer_role == 'ops' && dataBody.ops_review_status != null) ||
          isBusinessListings
      "
    >
      <div class="data-col">
        <div class="data-label">
          运营审核:
        </div>
        <div class="data-content">
          <span v-if="dataBody.ops_review_time">{{dataBody.ops_review_time | formatTime}}</span>
          {{ dataBody.ops_review_status | AuditStatusOption }}
        </div>
      </div>
      <div class="data-col" v-if="dataBody.ops_review_status === 0">
        <div class="data-label">
          账户类型:
        </div>
        <div class="data-content">
          {{ dataBody.ops_suggest_ad_account_type | AccountTypeOption }}
        </div>
      </div>
      <div class="data-col" v-if="dataBody.ops_review_status === 0">
        <div class="data-label">
          建议额度:
        </div>
        <div class="data-content">
          {{ dataBody.ops_suggest_quota }}
        </div>
      </div>
      <div class="data-col" v-if="dataBody.ops_review_status === 0">
        <div class="data-label">
          建议账期:
        </div>
        <div class="data-content">
          {{ dataBody.ops_suggest_billing_period }}期
        </div>
      </div>
      <div class="data-col column all-col" v-if="dataBody.ops_remark">
        <div class="data-label">
          备注:
        </div>
        <div class="data-content">
          {{ dataBody.ops_remark || "" }}
        </div>
      </div>
    </div>
    <div
            v-if="
        (reviewer_role == 'fo' && dataBody.fo_review_status != null) ||
          isBusinessListings
      "
    >
      <div class="data-row">
        <div class="data-col">
          <div class="data-label">
            财务审核:
          </div>
          <div class="data-content">
            <span v-if="dataBody.fo_review_time">{{dataBody.fo_review_time | formatTime}}</span>
            {{ dataBody.fo_review_status | AuditStatusOption }}
          </div>
        </div>
        <div class="data-col" v-if="dataBody.fo_review_status === 0">
          <div class="data-label">
            账户类型:
          </div>
          <div class="data-content">
            {{ dataBody.fo_suggest_ad_account_type | AccountTypeOption }}
          </div>
        </div>
        <div class="data-col" v-if="dataBody.fo_review_status === 0">
          <div class="data-label">
            建议额度:
          </div>
          <div class="data-content">
            {{ dataBody.fo_suggest_quota }}
          </div>
        </div>
        <div class="data-col" v-if="dataBody.fo_review_status === 0">
          <div class="data-label">
            建议账期:
          </div>
          <div class="data-content">
            {{ dataBody.fo_suggest_billing_period }}期
          </div>
        </div>
      </div>
      <div class="data-row " v-if="dataBody.fo_remark">
        <div class="data-col column all-col">
          <div class="data-label ">
            备注:
          </div>
          <div class="data-content ">
            {{ dataBody.fo_remark || "" }}
          </div>
        </div>
      </div>
    </div>

    <AuditContainer
            :statusFlag="statusFlag"
            v-if="(!isBusinessListings && reviewer_role == 'bd' && dataBody.bd_review_status == null)
            || (!isBusinessListings && reviewer_role == 'ops' && dataBody.ops_review_status == null)
            || (!isBusinessListings && reviewer_role == 'fo' && dataBody.fo_review_status == null)"
            v-model="from"
    />
    <ReturnVisit v-if="dataBody.id" :sellerId="dataBody.id"/>
    <div
            class="butt-width"
            :class="{
        'return-pages': !(
          (!isBusinessListings &&
            reviewer_role == 'bd' &&
            dataBody.bd_review_status == null) ||
          (!isBusinessListings &&
            reviewer_role == 'ops' &&
            dataBody.ops_review_status == null) ||
          (!isBusinessListings &&
            reviewer_role == 'fo' &&
            dataBody.fo_review_status == null)
        )
      }"
    >
      <el-button @click="returnPage">关闭</el-button>
      <el-button
              v-if="
               (!isBusinessListings &&
               reviewer_role == 'bd' &&
               dataBody.bd_review_status == null
               && $route.query.flag==='2') ||
              (!isBusinessListings &&
               reviewer_role == 'ops' &&
               dataBody.ops_review_status == null
               && $route.query.flag==='2') ||
               (!isBusinessListings &&
              reviewer_role == 'fo' &&
              dataBody.fo_review_status == null
              && $route.query.flag==='2')
        "
              @click="examineMerchants"
              type="success"
      >提交
      </el-button
      >
    </div>
    <ImageViewer
            v-if="dialogVisible"
            :on-close="
        () => {
          dialogVisible = false;
        }
      "
            :url-list="[imageUrl]"
    />
  </Pabody>
</template>

<script>
  import ImageViewer from "element-ui/packages/image/src/image-viewer";
  import AuditContainer from "@/components/pages/_type/Auditdetails/_id/AuditContainer";
  import ReturnVisit from "@/components/pages/_type/Auditdetails/_id/ReturnVisit";
  import {handleResponseErrors, showMsg} from "@/assets/js/utils";
  import {getApproval, examine, getBusiness} from "@/assets/js/api";
  import mixins from "@/mixins";

  export default {
    mixins: [mixins],
    data() {
      return {
        content: "详情", //页面title
        dialogVisible: false,
        reviewer_role: "", //审核角色
        statusFlag:null,//审核结果
        imageUrl: "",
        dataBody: {},
        from: {
          findingsOfAudit: null, //审核结果
          AccountType: null, //账户类型
          SuggestedQuota: null, //建议额度
          ProposedAccountPeriod: null, //建议账期
          remarks: "" //备注
        },
        isBusinessListings: false,
        SupplementAgreementList: []
      };
    },
    components: {
      AuditContainer,
      ImageViewer,
      ReturnVisit
    },
    created() {
      let url = this.$route.path.toString();
      if (url.match(/BusinessListings/)) {
        this.content = "商户详情";
        this.isBusinessListings = true;
        this.getSupplementAgreement();
      } else if (url.match(/OperationAudit/)) {
        this.content = "运营审核";
        this.reviewer_role = "ops";
      } else if (url.match(/FinancialAudit/)) {
        this.reviewer_role = "fo";
        this.content = "财务审核";
      } else if (url.match(/BusinessReview/)) {
        this.reviewer_role = "bd";
        this.content = "商务审核";
      }
      this.getApprovalDetails();
    },
    methods: {
      OpenPopup(url) {
        if (url.includes('.pdf')) {
          window.open(url)
        } else {
          this.dialogVisible = true;
          this.imageUrl = url;
        }
      },
      async getSupplementAgreement() {
        try {
          const res = await getBusiness.getSupplementAgreement(
              this.$route.params.id
          );
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          const list = res.supplement_list || [];
          for (const item of list) {
            if (item.value !== "") {
              this.SupplementAgreementList.push({
                typename: item.typename,
                value: item.value
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      async getApprovalDetails() {
        try {
          let res;
          if (this.reviewer_role == "ops" || this.reviewer_role == "fo" || this.reviewer_role == "bd") {
            res = await getApproval.getApprovalRequRestDetails(
                this.$route.params.id
            );
            if(this.reviewer_role == "ops"){
              this.statusFlag = res.ops_review_status
            }
            if(this.reviewer_role == "fo"){
              this.statusFlag = res.fo_review_status
            }
            if(this.reviewer_role == "bd"){
              this.statusFlag = res.bd_review_status
            }
            console.log('sss',this.statusFlag)
          } else {
            res = await getApproval.getApprovalDetails(this.$route.params.id);
          }
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          this.dataBody = res;
        } catch (error) {
          console.log(error);
        }
      },
      returnPage() {
        this.$router.go(-1);
      },
      async examineMerchants() {
        let data = {
          reviewer_role: this.reviewer_role, //审核人身份
          request_id: Number(this.$route.params.id),
          review_status: this.from.findingsOfAudit, //结果
          remark: this.from.remarks //备注
          /**
           *  suggest_ad_account_type : "",//账户类型
           *  suggest_quota : 0, //建议额度
           *  suggest_billing_period : "",//建议账期
           */
        };
        if (this.from.findingsOfAudit == 1) {
          if (data.remark == "") {
            showMsg("请备注驳回原因", 3);
            return;
          }
          data.suggest_ad_account_type = 0;
          data.suggest_quota = 0;
          data.suggest_billing_period = 0;
        } else if (this.from.findingsOfAudit == 0) {
          if (this.from.AccountType == null) {
            showMsg("请输选择账户类型", 3);
            return;
          }
          if(this.from.AccountType===2){
            if (
                !/^-?([1-9]\d*|0(?!\.0+$))\.\d{2}$/.test(this.from.SuggestedQuota)
            ) {
              showMsg("建议额度输入的内容精确到小数点后两位的小数", 3);
              return;
            }
            if (!this.from.ProposedAccountPeriod) {
              showMsg("请输选择建议账期", 3);
              return;
            }
          }

          if (data.remark == "") data.remark = undefined;
          data.suggest_ad_account_type = this.from.AccountType; //账户类型
          data.suggest_quota = Number(this.from.SuggestedQuota); //建议额度
          data.suggest_billing_period = this.from.ProposedAccountPeriod; //建议账期
        } else {
          showMsg("请选择审核结果", 3);
          return;
        }
        data.review_status = this.from.findingsOfAudit; //审核结果
        try {
          let res = await examine.opsOrFoExamine(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          showMsg("提交成功");
          this.returnPage();
        } catch (error) {
          console.log(error);
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  @import "@/assets/css/toExamineDetails.scss";
</style>
