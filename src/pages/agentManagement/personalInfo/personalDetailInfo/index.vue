<template>
  <div class="personal-detail-class">
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
            <div
                    v-if="info.business_license_gkey"
                    class="data-Img-box"
                    @click="OpenPopup(`https://img.funpinpin.com/${info.business_license_gkey}`)">
              <img :src="`https://img.funpinpin.com/${info.business_license_gkey}`" alt=""/>
            </div>
          </div>
        </div>
      </div>
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
  import ImageViewer from "element-ui/packages/image/src/image-viewer";

  export default {
    name: "personalDetail",
    props: [
      "info"
    ],
    components: {
      ImageViewer
    },
    data() {
      return {
        dataBody: {
          business_license_gkey: 'seller_user/185/id_card_human_page_gkey_1603103502'
        },
        dialogVisible: false,
        imageUrl: "",
      }
    },
    methods: {
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

  .personal-detail-class {
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