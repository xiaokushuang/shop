<template>
  <div>
    <Pabody>
      <PaTitle class="flex-space-between">
        <span>个人信息</span>
        <span class="text-r margin-b10">
                    <el-button type="primary" @click="handleUpload()">上传</el-button>
                </span>
      </PaTitle>
      <section v-loading="loadingFlag" class="margin-t10">
        <personalDetailInfo :info="info"></personalDetailInfo>
      </section>
      <el-dialog
              :close-on-click-modal="false"
              title="上传个人信息"
              :visible.sync="dialogUploadFlag"
              width="600px"
      >
        <uploadDialog :info="info" v-if="dialogUploadFlag" @closeDialog="handleCloseDialog"
                      @updateInfo="handleUpdateInfo"
        ></uploadDialog>
      </el-dialog>
    </Pabody>
  </div>
</template>

<script>
  import personalDetailInfo from './personalDetailInfo/index'
  import uploadDialog from './personalDetailInfo/uploadDialog/index'
  import {agentManagement} from "@/assets/js/api";
  import {handleResponseErrors} from "@/assets/js/utils";

  export default {
    name: "personalInfo",
    components: {
      personalDetailInfo,
      uploadDialog
    },
    data() {
      return {
        dialogUploadFlag: false,
        loadingFlag: false,
        info: {
          username: '',
          id_card_number: '',
          paypal_number: '',
          business_license_gkey: '',
        },
      }
    },
    created() {
      this.getAgentInfo()
    },
    methods: {
      handleUpdateInfo() {
        this.dialogUploadFlag = false
        this.getAgentInfo()
      },
      getAgentInfo() {
        this.loadingFlag = true
        agentManagement.getAgentInfo().then((res) => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.loadingFlag = false
            this.info.username = res.username
            this.info.id_card_number = res.id_card_number
            this.info.paypal_number = res.paypal_number
            this.info.business_license_gkey = res.business_license_gkey
          }
        })
      },
      handleUpload() {
        this.dialogUploadFlag = true
      },
      handleCloseDialog() {
        this.dialogUploadFlag = false
      },
    },
  }
</script>

<style scoped>

</style>