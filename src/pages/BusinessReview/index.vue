<template>
  <div>
    <router-view/>
    <Pabody v-show="!isDetails">
      <PaTitle>
        商务审核
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
          <el-button class="formButt"
                     @click="clearFrom">清空
          </el-button>
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
            <i class="el-icon-d-caret"
               v-if="sortType == ''"></i>
            <i class="el-icon-caret-top"
               v-else-if="sortType == 'up'"></i>
            <i class="el-icon-caret-bottom"
               v-else-if="sortType == 'desc'"></i>
          </th>
          <th>商户名称</th>
          <th>商户联系人</th>
          <th>邮箱</th>
          <th>手机号</th>
          <th>商户类型</th>
          <th>商务审核状态</th>
          <th>操作</th>
        </tr>
        <tr v-for="(item, index) in list"
            :key="index">
          <td>{{ item.request_id }}</td>
          <td>{{ item.seller_id }}</td>
          <td>{{ item.create_time | formatTime
            }}
          </td>
          <td>{{ item.seller_name }}</td>
          <td>{{ item.seller_contract }}</td>
          <td>{{ item.seller_email }}</td>
          <td>{{ item.seller_phone }}</td>
          <td>{{ item.seller_type | MerchantOption
            }}
          </td>
          <td>{{ item.bd_review_status |
            AuditStatusOption }}
          </td>
          <td>
            <el-button
                    v-if="havePermission(102,'查看')"
                    style="width:97px;"
                    @click="gotodetails(item.request_id,'1')"
                    size="mini"
                    type="primary"
            >查看
            </el-button>

            <el-button
                    v-if="item.bd_review_status == null&&havePermission(100,'商户审核')"
                    @click="gotodetails(item.request_id,'2')"
                    size="mini"
                    type="primary"
                    icon="el-icon-edit-outline"
            >商户审核
            </el-button>
            <el-button
                    v-if="havePermission(101,'材料更新')"
                    @click="openUpPhotoData(item.seller_id, index)"
                    size="mini"
                    type="danger"
                    icon="el-icon-receiving"
            >材料更新
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
    <el-dialog
            width="1000px"
            :close-on-click-modal="false"
            title="材料更新"
            :visible.sync="upPhotoData"
    >

      <div class="protocol">
        <div class="protocolContent">
          <span>材料更新</span>
          <small>资料提交才会更新到数据库（目前只能更新不提供删除功能）
          </small>
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
                  v-if="list[protocolIndex] ? list[protocolIndex].seller_type == 2 : false"
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
            <el-button type="primary"
                       @click.native="submitUpPhotoData()"
            >提交
            </el-button
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {handleResponseErrors} from "@/assets/js/utils";
  import {getApproval} from "@/assets/js/api";
  import mixins from "@/mixins";
  import PaUpload from "@/components/basic/PaUpload";
  import {mapState} from "vuex";

  export default {
    mixins: [mixins],
    components: {
      PaUpload,
    },
    computed: {...mapState(["usersPermission"])},
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
        sortType: "",//up/desc
        popupForm: {
          businessAffairs: "", //分配商务
          NumberSeller: "",
          agreement: {
            //协议上传
            ensureImg: {
              value: "",
              isError: false
            }, //保证
            useImg: {value: "", isError: false}, //使用
            PayAfterAdvanceImg: {
              value: "",
              isError: false
            }, //预付后付
            PaymentOnBehalf: {
              value: "",
              isError: false
            }, //代付
            submitType: false
          },
          MaterialUpdate: {
            //材料更新
            business_license_gkey: {
              value: "",
              isError: false
            }, //营业执照  key:business_license_gkey
            id_card_human_page_gkey: {
              value: "",
              isError: false
            }, //身份证(人像)  key:id_card_human_page_gkey
            id_card_country_page_gkey: {
              value: "",
              isError: false
            }, //身份证（国徽）  key:id_card_country_page_gkey
            bank_revenue_gkey: {
              value: "",
              isError: false
            }, //银行账户流水  key:bank_revenue_gkey
            paypal_balance_gkey: {
              value: "",
              isError: false
            }, //Paypal账户余额  key:paypal_balance_gkey
            order_detail_gkey: {
              value: "",
              isError: false
            }, //运营明细(上传订单明细)  key:order_detail_gkey
            transport_detail_gkey: {
              value: "",
              isError: false
            } //运营明细(上传发货明细)  key:transport_detail_gkey
          },
          MaterialUpdateSubmintType: false
        },
        protocolId: null, //当前弹出层id
        protocolIndex: 0, //当前弹出层index
        upPhotoData: false, //材料更新开关
      };
    },
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
            bd_review_status:
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
          console.log('商务审核列表',this.list)
          this.page.total = res.total;
        } catch (error) {
          console.log(error);
        }
      },
      handleCurrentChange(val) {
        this.page.count = val;
        this.getList();
      },
      gotodetails(id,btn) {
        this.$router.push({
          path: `/BusinessReview/details/${id}`,
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
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/css/toExamine.scss";
</style>
