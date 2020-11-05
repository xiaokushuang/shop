<template>
  <div>
    <router-view />
    <Pabody v-show="!isDetails">
      <PaTitle>
        商户列表
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
            商务负责人
          </div>
          <el-input
            class="fromContent"
            v-model="form.BusinessDirector"
            placeholder="请输入商务负责人"
          ></el-input>
        </div>
      </div>
      <div class="fromRow">
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
            >搜索</el-button
          >
        </div>
      </div>
    </Pabody>
    <Pabody v-show="!isDetails" style="margin-top:20px">
      <div class="fromRow">
        <div class="fromCol endCol">
          <el-input
            v-model="url"
            placeholder="点击按钮生成分享链接"
            class="input-with-select"
          >
            <el-button slot="append" @click="copyUrl">生成分享链接</el-button>
          </el-input>
        </div>
      </div>
      <PaTable>
        <tr>
          <th>审核ID</th>
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
          <th class="centext">商务负责人</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in list" :key="index">
          <td>{{ item.seller_id }}</td>
          <td>{{ item.create_time | formatTime }}</td>
          <td>{{ item.seller_name }}</td>
          <td>{{ item.seller_contract }}</td>
          <td>{{ item.seller_email }}</td>
          <td>{{ item.seller_phone }}</td>
          <td>{{ item.seller_type | MerchantOption }}</td>
          <td class="centext">{{ item.bd_name || "" }}</td>
          <td>
            <el-button
              v-if="jurisdiction('Merchants-DistributionBusiness')"
              @click="DistributionBusiness(index)"
              size="mini"
              type="warning"
              icon="el-icon-user"
              >分配商务</el-button
            >
            <el-button
              v-if="jurisdiction('Merchants-UploadPhotoCol')"
              @click="UploadPhotoCol(item.seller_id, index)"
              size="mini"
              type="success"
              icon="el-icon-upload"
              >上传协议</el-button
            >
            <el-button
              v-if="jurisdiction('Merchants-SupplementToTheAgreement')"
              @click="UploadSupplementPhotoCol(item.seller_id)"
              size="mini"
              type="success"
              icon="el-icon-receiving"
              >协议补充</el-button
            >
            <el-button
              v-if="jurisdiction('Merchants-UpdateMaterials')"
              @click="openUpPhotoData(item.seller_id, index)"
              size="mini"
              type="danger"
              icon="el-icon-receiving"
              >材料更新</el-button
            >
            <el-button
              v-if="jurisdiction('Merchants-details')"
              @click="gotodetails(item.seller_id)"
              size="mini"
              type="primary"
              icon="el-icon-document"
              >查看</el-button
            >
            <el-button
              @click="returnVisit(item)"
              size="mini"
              type="warning"
              icon="el-icon-phone-outline"
              >回访</el-button
            >
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
    <el-dialog
            :close-on-click-modal="false"
            title="分配商务"
            :visible.sync="distributionIsShow"
    >
      <div class="distribution">
        <el-select v-model="popupForm.businessAffairs" placeholder="请选择">
          <el-option
                  v-for="item in BusinessOptions"
                  :key="item.value"
                  :label="item.label + '(' + item.email + ')'"
                  :value="item.value"
          >
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-check" @click="bindingBusiness"
        >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
            :close-on-click-modal="false"
            title="上传协议"
            :visible.sync="protocolIsShow"
    >
      <div class="protocol">
        <div class="protocolContent">
          <span>协议合同</span>
          <small
          >（请上传协议合同扫描件，其中保证协议、使用协议、预付/后付协议、代付协议必须上传）
          </small>
        </div>
        <div class="protocolUploadBox">
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.agreement.ensureImg"
                  typename="assure_protocol_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.agreement.submitType"
                  placeholder="上传保证协议"
                  is_required_text="请上传保证协议"
                  Tips="请上传保证协议并确保图片清晰可见"
          />
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.agreement.useImg"
                  typename="use_protocol_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.agreement.submitType"
                  placeholder="上传使用协议"
                  is_required_text="请上传使用协议"
                  Tips="请上传使用协议并确保图片清晰可见"
          />
        </div>
        <div class="protocolUploadBox">
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.agreement.PayAfterAdvanceImg"
                  typename="pre_after_use_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.agreement.submitType"
                  placeholder="上传预付/后付协议"
                  is_required_text="请上传预付/后付协议"
                  Tips="请上传预付/后付协议并确保图片清晰可见"
          />
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.agreement.PaymentOnBehalf"
                  typename="behalf_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.agreement.submitType"
                  placeholder="上传代付协议"
                  is_required_text="请上传代付协议"
                  Tips="请上传代付协议并确保图片清晰可见"
          />
        </div>
        <div class="protocolButt">
          <el-button type="primary" @click.native="submitAgreement()"
          >提交</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
            width="1000px"
            :close-on-click-modal="false"
            title="材料更新"
            :visible.sync="upPhotoData"
    >
      <div class="protocol">
        <div class="protocolContent">
          <span>材料更新</span>
          <small>资料提交才会更新到数据库（目前只能更新不提供删除功能） </small>
        </div>

        <div class="protocolUploadBox">
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.MaterialUpdate.id_card_human_page_gkey"
                  typename="id_card_human_page_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.MaterialUpdateSubmintType"
                  placeholder="上传身份证(人像)"
                  is_required_text="请上传身份证(人像)"
                  Tips="请上传身份证(人像)并确保图片清晰可见"
          />
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.MaterialUpdate.id_card_country_page_gkey"
                  typename="id_card_country_page_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.MaterialUpdateSubmintType"
                  placeholder="上传身份证（国徽）"
                  is_required_text="请上传身份证（国徽）"
                  Tips="请上传身份证（国徽）并确保图片清晰可见"
          />
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.MaterialUpdate.bank_revenue_gkey"
                  typename="bank_revenue_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.MaterialUpdateSubmintType"
                  placeholder="上传银行账户流水"
                  is_required_text="请上传银行账户流水"
                  Tips="请上传银行账户流水并确保图片清晰可见"
          />
        </div>
        <div class="protocolUploadBox">
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.MaterialUpdate.paypal_balance_gkey"
                  typename="paypal_balance_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.MaterialUpdateSubmintType"
                  placeholder="上传Paypal账户余额"
                  is_required_text="请上传Paypal账户余额"
                  Tips="请上传Paypal账户余额并确保图片清晰可见"
          />
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.MaterialUpdate.order_detail_gkey"
                  typename="order_detail_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.MaterialUpdateSubmintType"
                  placeholder="上传订单明细"
                  is_required_text="请上传订单明细"
                  Tips="请上传订单明细并确保图片清晰可见"
          />
          <PaUpload
                  class="protocolUpload"
                  v-model="popupForm.MaterialUpdate.transport_detail_gkey"
                  typename="transport_detail_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.MaterialUpdateSubmintType"
                  placeholder="上传发货明细"
                  is_required_text="请上传发货明细"
                  Tips="请上传发货明细并确保图片清晰可见"
          />
        </div>
        <div class="protocolUploadBox">
          <PaUpload
                  v-if="
              list[protocolIndex] ? list[protocolIndex].seller_type == 2 : false
            "
                  class="protocolUpload"
                  v-model="popupForm.MaterialUpdate.business_license_gkey"
                  typename="business_license_gkey"
                  :seller_id="protocolId"
                  :is_required="false"
                  :submitType="popupForm.MaterialUpdateSubmintType"
                  placeholder="上传营业执照"
                  is_required_text="请上传营业执照"
                  Tips="请上传营业执照并确保图片清晰可见"
          />
          <div class="protocolButt">
            <el-button type="primary" @click.native="submitUpPhotoData()"
            >提交</el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
    <SupplementToTheAgreement
      v-model="SupplementToTheAgreementIsShow"
      :seller_id="activeId"
    />
    <!--弹窗-->
    <el-dialog
      :close-on-click-modal="false"
      :title="sellerName + '进度及回访'"
      :visible.sync="stationDialog"
    >
      <station v-if="stationDialog" :sellerId="sellerId"></station>
    </el-dialog>
  </div>
</template>

<script>
import store from "@/store/index";
import { mapState } from "vuex";
import copy from "copy-to-clipboard";
import PaUpload from "@/components/basic/PaUpload";
import SupplementToTheAgreement from "@/components/pages/BusinessListings/SupplementToTheAgreement";
import { handleResponseErrors, showMsg } from "@/assets/js/utils";
import { getApproval, getBusiness } from "@/assets/js/api";
import station from "../returnVisit/station/index";
import mixins from "@/mixins";
export default {
  mixins: [mixins],
  store,
  data() {
    return {
      stationDialog: false,
      sellerName: "",
      sellerId: "",
      url: "",
      distributionIsShow: false, //分配商务开关
      protocolIsShow: false, //协议上传开关
      protocolId: null, //当前弹出层id
      protocolIndex: 0, //当前弹出层index
      upPhotoData: false, //材料更新开关
      form: {
        name: "", //商户名称
        longTime: null,
        email: "", //邮箱
        phoneno: "", //手机号
        MerchantType: null, //商户类型
        BusinessDirector: "" //商务负责人
      },
      search: {
        //查询生效参数
        name: "", //商户名称
        longTime: null,
        email: "", //邮箱
        phoneno: "", //手机号
        MerchantType: null, //商户类型
        BusinessDirector: "" //商务负责人
      },
      popupForm: {
        businessAffairs: "", //分配商务
        NumberSeller: "",
        agreement: {
          //协议上传
          ensureImg: { value: "", isError: false }, //保证
          useImg: { value: "", isError: false }, //使用
          PayAfterAdvanceImg: { value: "", isError: false }, //预付后付
          PaymentOnBehalf: { value: "", isError: false }, //代付
          submitType: false
        },
        MaterialUpdate: {
          //材料更新
          business_license_gkey: { value: "", isError: false }, //营业执照  key:business_license_gkey
          id_card_human_page_gkey: { value: "", isError: false }, //身份证(人像)  key:id_card_human_page_gkey
          id_card_country_page_gkey: { value: "", isError: false }, //身份证（国徽）  key:id_card_country_page_gkey
          bank_revenue_gkey: { value: "", isError: false }, //银行账户流水  key:bank_revenue_gkey
          paypal_balance_gkey: { value: "", isError: false }, //Paypal账户余额  key:paypal_balance_gkey
          order_detail_gkey: { value: "", isError: false }, //运营明细(上传订单明细)  key:order_detail_gkey
          transport_detail_gkey: { value: "", isError: false } //运营明细(上传发货明细)  key:transport_detail_gkey
        },
        MaterialUpdateSubmintType: false
      },
      page: {
        total: 0, //总数
        pageSize: 10, //页长
        count: 1
      },
      list: [],
      BusinessOptions: [],
      isDetails: false,
      sortType: "", //up/desc
      SupplementToTheAgreementIsShow: false,
      activeId: null
    };
  },
  computed: { ...mapState(["userMsg", "usersPermission"]) },
  components: {
    PaUpload,
    SupplementToTheAgreement,
    station
  },
  created() {
    this.getList();
    this.getBusinessOptions();
  },
  beforeUpdate() {
    let url = this.$route.path.toString();
    if (url.match(/details/)) {
      this.isDetails = true;
    } else {
      this.isDetails = false;
    }
  },
  methods: {
    searchList() {
      this.page.count = 1;
      this.sortType = "";
      this.search = JSON.parse(JSON.stringify(this.form));
      this.getList();
    },
    copyUrl() {
      console.log(this.userMsg.id);
      let path =
        process.env.NODE_ENV == "production"
          ? "https://business.funpinpin.com/"
          : "https://fpp-merchants-test.firebaseapp.com/";
      this.url = `${path}register?business=${encodeURIComponent(
        this.userMsg.id
      ) || ""}`;
      copy(this.url);
      this.$message({
        message: "复制成功",
        type: "success"
      });
    },
    clearFrom() {
      this.form = {
        name: "", //商户名称
        longTime: null,
        email: "", //邮箱
        phoneno: "", //手机号
        MerchantType: null, //商户类型
        BusinessDirector: "" //商务负责人
      };
    },
    async submitAgreement() {
      this.popupForm.agreement.submitType = true;
      this.$nextTick(async () => {
        if (
          Object.values(this.popupForm.agreement).some(item => {
            if (item.isError) {
              return item.isError;
            } else {
              return false;
            }
          })
        )
          return;
        try {
          let data = {
            seller_id: this.protocolId,
            assure_protocol_gkey: this.popupForm.agreement.ensureImg.value,
            use_protocol_gkey: this.popupForm.agreement.useImg.value,
            pre_after_use_gkey: this.popupForm.agreement.PayAfterAdvanceImg.value,
            behalf_gkey: this.popupForm.agreement.PaymentOnBehalf.value
          };
          /*for (let itemKey in data) {
            if (data[itemKey] === "" || data[itemKey] === null)
              data[itemKey] = undefined;
          }*/
          let res = await getApproval.sendFiles(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          } else {
            this.protocolIsShow = false;
          }
          this.getList();
        } catch (error) {
          console.log(error);
        }
      });
    },
    async submitUpPhotoData() {
      this.popupForm.MaterialUpdateSubmintType = true;
      let dataBody = this.popupForm.MaterialUpdate;
      this.$nextTick(async () => {
        if (
          Object.values(dataBody).some(item => {
            if (item.isError) {
              return item.isError;
            } else {
              return false;
            }
          })
        )
          return;
        try {
          let data = {
            seller_id: this.protocolId,
            id_card_human_page_gkey: dataBody.id_card_human_page_gkey.value,
            id_card_country_page_gkey: dataBody.id_card_country_page_gkey.value,
            bank_revenue_gkey: dataBody.bank_revenue_gkey.value,
            paypal_balance_gkey: dataBody.paypal_balance_gkey.value,
            order_detail_gkey: dataBody.order_detail_gkey.value,
            transport_detail_gkey: dataBody.transport_detail_gkey.value
          };
          if (this.list[this.protocolIndex].seller_type == 2)
            data.business_license_gkey = this.popupForm.MaterialUpdate.business_license_gkey.value;
          for (let itemKey in data) {
            if (data[itemKey] === "" || data[itemKey] === null)
              data[itemKey] = undefined;
          }
          let res = await getApproval.sendFiles(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          } else {
            this.upPhotoData = false;
          }
          this.getList();
        } catch (error) {
          console.log(error);
        }
      });
    },
    async getList() {
      try {
        let data = {
          sort_type: this.sortType == "" ? null : this.sortType,
          seller_name: this.search.name,
          seller_email: this.search.email,
          seller_type:
            this.search.MerchantType == "" ? null : this.search.MerchantType,
          seller_phone: this.search.phoneno,
          seller_bd: this.search.BusinessDirector,
          create_date_start: this.search.longTime
            ? this.search.longTime[0]
            : null,
          create_date_end: this.search.longTime
            ? this.search.longTime[1]
            : null,
          page: this.page.count,
          limit: this.page.pageSize
        };
        let res = await getBusiness.BusinessList(data);
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
    openPopup() {
      this.PopupIsShow = true;
    },
    closePopup() {
      this.PopupIsShow = false;
    },
    UploadSupplementPhotoCol(id) {
      this.SupplementToTheAgreementIsShow = true;
      this.activeId = id;
    },
    UploadPhotoCol(key, index) {
      let data = this.list[index];
      this.popupForm.agreement = {
        //协议上传
        ensureImg: { value: data.assure_protocol_gkey || "", isError: false }, //保证
        useImg: { value: data.use_protocol_gkey || "", isError: false }, //使用
        PayAfterAdvanceImg: {
          value: data.pre_after_use_gkey || "",
          isError: false
        }, //预付后付
        PaymentOnBehalf: {
          value: data.behalf_gkey || "",
          isError: false
        }, //代付
        submitType: false
      };
      this.protocolIsShow = true;
      this.protocolId = key;
    },
    openUpPhotoData(key, index) {
      let data = this.list[index];
      this.popupForm.MaterialUpdate = {
        //材料更新
        business_license_gkey: {
          value: data.business_license_gkey || "",
          isError: false
        }, //营业执照  key:business_license_gkey
        id_card_human_page_gkey: {
          value: data.id_card_human_page_gkey || "",
          isError: false
        }, //身份证(人像)  key:id_card_human_page_gkey
        id_card_country_page_gkey: {
          value: data.id_card_country_page_gkey || "",
          isError: false
        }, //身份证（国徽）  key:id_card_country_page_gkey
        bank_revenue_gkey: {
          value: data.bank_revenue_gkey || "",
          isError: false
        }, //银行账户流水  key:bank_revenue_gkey
        paypal_balance_gkey: {
          value: data.paypal_balance_gkey || "",
          isError: false
        }, //Paypal账户余额  key:paypal_balance_gkey
        order_detail_gkey: {
          value: data.order_detail_gkey || "",
          isError: false
        }, //运营明细(上传订单明细)  key:order_detail_gkey
        transport_detail_gkey: {
          value: data.transport_detail_gkey || "",
          isError: false
        } //运营明细(上传发货明细)  key:transport_detail_gkey
      };
      this.popupForm.MaterialUpdateSubmintType = false;
      this.upPhotoData = true;
      this.protocolId = key;
      this.protocolIndex = index;
    },
    async getBusinessOptions() {
      try {
        let res = await getBusiness.BusinessOptions();
        if (res.code != 0) {
          handleResponseErrors(res.code, res.msg);
          return;
        }
        this.BusinessOptions = res.user_list.map(item => {
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
    DistributionBusiness(index) {
      index = String(index);
      this.distributionIsShow = true;
      if (this.popupForm.NumberSeller != index) {
        this.popupForm.businessAffairs = "";
        this.popupForm.NumberSeller = index;
      }
    },
    async bindingBusiness() {
      try {
        if (this.popupForm.businessAffairs == "") {
          showMsg("请选择商务", 3);
          return;
        }
        let data = {
          seller_id: this.list[this.popupForm.NumberSeller].seller_id
        };
        let res = await getBusiness.bindingBusiness(
          this.popupForm.businessAffairs,
          data
        );
        if (res.code != 0) {
          handleResponseErrors(res.code, res.msg);
          return;
        }
        this.BusinessOptions.forEach(item => {
          if (item.value == this.popupForm.businessAffairs) {
            this.list[this.popupForm.NumberSeller].bd_name = item.label;
          }
        });
        this.distributionIsShow = false;
        showMsg("绑定成功");
      } catch (error) {
        console.log(error);
      }
    },
    gotodetails(id) {
      this.$router.push({
        path: `/BusinessListings/details/${id}`
      });
    },
    sortTime() {
      if (this.sortType == "desc" || this.sortType == "") {
        this.sortType = "up";
      } else {
        this.sortType = "desc";
      }
      this.getList();
    },
    returnVisit(val) {
      this.sellerName = val.seller_name;
      this.sellerId = val.seller_id;
      this.stationDialog = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/toExamine.scss";
.distribution {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}
</style>
