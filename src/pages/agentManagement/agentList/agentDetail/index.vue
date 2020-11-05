<template>
  <div class="agentDetail-class">
    <div class="personal-info">
      <div class="title">个人信息</div>
      <div class="info-item">
        <span>姓名：</span>
        <span>{{info.username}}</span>
      </div>
      <div class="info-item">
        <span>身份证号：</span>
        <span>{{info.id_card_number}}</span>
      </div>
      <div class="info-item info-item3">
        <span>Paypal账号：</span>
        <span>{{info.paypal_number}}</span>
      </div>
      <div class="info-item">
        <div class="data-row">
          <div class="data-Img-col">
            <div class="data-Img-title">
              <div class="data-Img-label">
                营业执照:
              </div>
            </div>
            <div v-if="info.business_license_gkey" class="data-Img-box"
                 @click="OpenPopup(`https://img.funpinpin.com/${info.business_license_gkey}`)">
              <img
                      :src="`https://img.funpinpin.com/${info.business_license_gkey}`"
                      alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="merchants-info">
      <div class="title">商户信息</div>
      <channelsShare :fpp_user_id="lineData.id"></channelsShare>
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
  </div>
</template>

<script>
  import {agentManagement} from "@/assets/js/api";
  import {handleResponseErrors} from "@/assets/js/utils";
  import ImageViewer from "element-ui/packages/image/src/image-viewer";
  import channelsShare from '../../channelsShare/index'

  export default {
    name: "agentDetail",
    props: ["lineData"],
    components: {
      ImageViewer,
      channelsShare
    },
    data() {
      return {
        merchantsList: [
          {
            time: '21-3-4',
            name: '大酒店',
            info: '绝对是垃圾啊量较大'
          }
        ],
        dialogVisible: false,
        imageUrl: "",
        info: {
          username: "",
          id_card_number: "",
          paypal_number: "",
          business_license_gkey: ""
        }
      }
    },
    created() {
      this.getAgentInfoDetail()
    },
    methods: {
      getAgentInfoDetail() {
        let data = {
          fpp_user_id: this.lineData.id
        }
        let userId = this.lineData.id
        agentManagement.getAgentInfoDetail(data, userId).then((res) => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.info.username = res.username
            this.info.id_card_number = res.id_card_number
            this.info.paypal_number = res.paypal_number
            this.info.business_license_gkey = res.business_license_gkey
          }
        })
      },
      OpenPopup(url) {
        this.dialogVisible = true;
        this.imageUrl = url;
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

<style scoped lang="scss">
  @import "@/assets/css/toExamineDetails.scss";

  .w100Percent {
    width: 100%;
  }

  .agentDetail-class {
    .title {
      font-weight: bold;
      margin: 25px 0;
    }
    .personal-info {
      .info-item {
        margin-bottom: 20px;
        span:first-child {
          color: #908585;
        }
      }
      .info-item3 {
        margin-bottom: 0;
      }
    }
  }

</style>