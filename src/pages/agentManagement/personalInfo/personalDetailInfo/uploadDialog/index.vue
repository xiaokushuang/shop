<template>
  <div class="upload-dialog-class">
    <div class="personal-info">
      <div class="info-item flex-baseline">
                <span class="w100 inline-block-class">
                    <span>姓名</span>
                    <span class="red-class">*</span>：
                </span>
        <span class="input-width inline-block-class">
                    <PaInput
                            class="reset-pa-input"
                            v-model="form.name"
                            placeholder="请输入姓名"
                            is_required_text="请输入姓名"
                            :wordLimit="true"
                            :submitType="submitType"
                            :is_required="true"
                    />
                </span>
      </div>
      <div class="info-item flex-baseline">
                <span class="w100 inline-block-class">
                    <span>身份证号</span>
                    <span class="red-class">*</span>：
                </span>
        <span class="input-width inline-block-class">
                     <PaInput
                             class="reset-pa-input"
                             v-model="form.idCard"
                             placeholder="请输入身份证号"
                             is_required_text="请输入身份证号"
                             error_content="请输入正确的身份证号"
                             type="(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)"
                             :submitType="submitType"
                             :is_required="true"
                     />
                </span>
      </div>
      <div class="info-item info-item3 flex-baseline">
        <span class="w100 inline-block-class">Paypal账号：</span>
        <span class="input-width inline-block-class">
                    <PaInput
                            class="reset-pa-input"
                            v-model="form.PaypalAccount"
                            placeholder="请输入Paypal账号"
                            :wordLimit="true"
                            :submitType="submitType"
                            :is_required="false"
                    />
                </span>
      </div>
      <div class="info-item">
        <div class="data-row">
          <div style="width: 100%;" class="data-Img-col">
            <div class="data-Img-title">
              <div class="data-Img-label">
                营业执照:(若有则上传)
              </div>
            </div>
            <PaUpload
                    class="protocolUpload"
                    v-model="form.business_license_gkey"
                    typename="business_license_gkey"
                    :personal="true"
                    :is_required="false"
                    :submitType="MaterialUpdateSubmintType"
                    placeholder="上传营业执照"
                    is_required_text="请上传营业执照"
                    Tips="请上传营业执照并确保图片清晰可见"
            />
          </div>
        </div>
      </div>
    </div>
    <!--按钮-->
    <div class="flex">
      <el-button @click="handleUpload()" type="primary" :loading="uploadFlag">提交</el-button>
      <el-button @click="handleClose()">关闭</el-button>
    </div>
    <ImageViewer v-if="dialogVisible" :on-close="() => {dialogVisible = false;}" :url-list="[imageUrl]"/>
  </div>
</template>

<script>
  import ImageViewer from "element-ui/packages/image/src/image-viewer";
  import PaUpload from "@/components/basic/PaUpload";
  import PaInput from "@/components/basic/PaInput.vue";
  import {agentManagement} from "@/assets/js/api";
  import {handleResponseErrors, showMsg} from "@/assets/js/utils";

  export default {
    name: "uploadDialog",
    props: [
      "info"
    ],
    components: {
      ImageViewer,
      PaUpload,
      PaInput
    },
    data() {
      return {
        uploadFlag: false,
        dialogVisible: false,
        imageUrl: "",
        name: '',
        idCard: "",
        paypal: '',
        protocolId: null, //当前弹出层id
        submitType: false,
        MaterialUpdateSubmintType: false,
        form: {
          name: {value: "", isError: false},
          idCard: {value: "", isError: false},
          PaypalAccount: {value: "", isError: false},
          business_license_gkey: {value: "", isError: false}, //营业执照  key:business_license_gkey
        },
      }
    },
    created() {
    },
    mounted() {
      this.$nextTick(() => {
        this.form.name.value = this.info.username
        this.form.idCard.value = this.info.id_card_number
        this.form.PaypalAccount.value = this.info.paypal_number
        this.form.business_license_gkey.value = this.info.business_license_gkey
      })
    },
    methods: {
      updateAgentInfo() {
        this.uploadFlag = true
        let data = {
          username: this.form.name.value,
          id_card_number: this.form.idCard.value,
          paypal_number: this.form.PaypalAccount.value,
          business_license_gkey: this.form.business_license_gkey.value
        }
        agentManagement.updateAgentInfo(data).then((res) => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.uploadFlag = false
            showMsg("上传成功")
            this.$emit('updateInfo')
          }
        })
      },
      OpenPopup(url) {
        this.dialogVisible = true;
        this.imageUrl = url;
      },
      handleUpload() {
        this.submitType = true;
        this.$nextTick(() => {
          if (
              Object.values(this.form).every(item => {
                return item.isError === false;
              })
          ) {
            this.updateAgentInfo()
          }
        });
      },
      handleClose() {
        this.$emit('closeDialog')
      },
      handleEmpty(value) {
        if (value) {
          return value
        } else {
          return '- -'
        }
      },
    },
  }
</script>

<style lang="scss">
  @import "@/assets/css/toExamineDetails.scss";

  .flex {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-baseline {
    display: flex;
    align-items: baseline;
  }

  .w100 {
    width: 100px;
  }

  .red-class {
    color: red;
  }

  .err-text {
    padding-left: 100px;
    padding-top: 5px;
  }

  .upload-dialog-class {
    .avatarUploader {
      width: 250px;
    }
    .title {
      font-weight: bold;
      margin: 25px 0;
    }
    .inline-block-class {
      display: inline-block;
    }
    .personal-info {
      .info-item {
        margin-bottom: 20px;
        /*span {
            display: inline-block;
        }
        span:first-child {
            color: #908585;
            width: 100px;
        }*/
      }
      .info-item3 {
        margin-bottom: 0;
      }
      .input-width {
        width: 50%;
      }
    }
  }

</style>