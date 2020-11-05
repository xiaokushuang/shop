<template>
  <el-dialog
          :close-on-click-modal="false"
          title="协议补充"
          :visible.sync="isShow"
          width="1000px"
  >
    <div class="fromRow border-bottom">
      <div class="fromCol auto-col protocol">
        <div class="protocolUploadBox">
          <PaUpload
                  v-for="(item, index) in FormList"
                  :key="index"
                  class="protocolUpload noflex"
                  v-model="item.value"
                  :typename="item.typename"
                  :seller_id="seller_id"
                  :is_required="false"
                  placeholder="上传协议"
                  is_required_text="请上传协议"
                  :isSupplementToTheAgreement="true"
                  :Tips="item.typename"
          />
        </div>
      </div>
      <div class="fromCol border-left">
        <div class="new-photo-col">
          <PaTitleZ>
            新建补充协议
          </PaTitleZ>
          <el-input placeholder="请输入补充协议名称" v-model="from.typename"
          ><i slot="prefix" class="el-input__icon el-icon-edit"></i>
          </el-input>
          <div class="stopClick-bott">
            <div class="protocol">
              <div class="protocolUploadBox">
                <PaUpload
                        class="protocolUpload "
                        v-model="from.value"
                        :typename="from.typename"
                        :seller_id="seller_id"
                        :is_required="false"
                        :submitType="submitType"
                        placeholder="上传补充协议"
                        is_required_text="请上传补充协议"
                        :isSupplementToTheAgreement="true"
                        Tips=""
                />
              </div>
            </div>
            <div
                    class="stopClick-bott-fw"
                    v-if="from.typename === ''"
                    @click.stop="Tips"
            ></div>
          </div>
          <!-- <div class="submit">
            <el-button type="primary">提交</el-button>
          </div> -->
          <div class="explain">
            <p>1.文件大小≤8M，支持PNG.JPG.PDF</p>
            <p>2.必须先输入新建补充协议名称才能上传文件</p>
            <p>3.补充协议名称具有唯一性,请不要输入已存在的补充协议名称</p>
          </div>
        </div>
      </div>
    </div>
    <div class="submit">
      <el-button type="primary" @click="sendSupplementAgreement"
      >提交更新</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import PaUpload from "@/components/basic/PaUpload";
import { getBusiness } from "@/assets/js/api";
import { handleResponseErrors, showMsg } from "@/assets/js/utils";
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    },
    seller_id: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isShow: this.value,
      getList: [],
      FormList: [],
      submitType: false,
      from: {
        typename: "",
        value: {
          value: "",
          isError: false
        }
      }
    };
  },
  components: {
    PaUpload,
  },
  watch: {
    value(vel) {
      this.isShow = vel;
    },
    isShow(vel) {
      this.$emit("input", vel);
      if (vel) {
        this.getSupplementAgreement();
      } else {
        this.getList = [];
        this.FormList = [];
      }
    },
    seller_id(vel) {},
    "from.value.value"(vel) {
      if (vel !== "") {
        if (
          this.FormList.every(res => {
            if (res.typename !== this.from.typename) {
              return true;
            } else {
              res.value.value = vel;
              return false;
            }
          })
        ) {
          this.FormList.unshift({
            typename: this.from.typename,
            value: {
              value: vel,
              isError: false
            }
          });
        }
        this.from = {
          typename: "",
          value: {
            value: "",
            isError: false
          }
        };
      }
    }
  },
  methods: {
    ChangePage(val) {
      this.Page.count = val;
    },
    Tips() {
      showMsg("请先输入协议名称", "warning");
    },
    async getSupplementAgreement() {
      try {
        const res = await getBusiness.getSupplementAgreement(this.seller_id);
        if (res.code != 0) {
          handleResponseErrors(res.code, res.msg);
          return;
        }
        this.FormList = [];
        this.getList = res.supplement_list || [];
        for (const item of this.getList) {
          if (item.value !== "") {
            this.FormList.push({
              typename: item.typename,
              value: {
                value: item.value,
                isError: false
              }
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    async sendSupplementAgreement() {
      try {
        let add_supplement_list = [];
        for (const items of this.FormList) {
          if (
            this.getList.every(item => {
              if (item.typename !== items.typename) {
                return true;
              }
              if (item.value === items.value.value) {
                return false;
              }
              return true;
            })
          ) {
            add_supplement_list.push({
              typename: items.typename,
              value: items.value.value
            });
          }
        }
        if (add_supplement_list.length === 0) {
          showMsg("数据未发生改变", "warning");
          return;
        }
        const data = {
          seller_id: this.seller_id,
          add_supplement_list
        };
        const res = await getBusiness.sendSupplementAgreement(data);
        if (res.code != 0) {
          handleResponseErrors(res.code, res.msg);
          return;
        }
        showMsg("更新成功");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/toExamine.scss";
.border-bottom {
  border-bottom: 1px solid #dee2e6;
}
.border-left {
  border-left: 1px solid #dee2e6;
}
.stopClick-bott {
  position: relative;
  .stopClick-bott-fw {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
  }
}
.submit {
  margin-top: 10px;
  width: 100%;
  text-align: right;
  padding-right: 5px;
  .el-pagination {
    margin-top: 10px;
  }
}
.explain {
  margin-top: 20px;
  p {
    margin-top: 5px;
    font-size: 14px;
    line-height: 16px;
    transform: scale(0.85);
  }
}
.protocolUploadBox {
  max-height: 385px;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
