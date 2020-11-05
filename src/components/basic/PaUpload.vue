<template>
  <div class="avatarUploader">
    <div class="avatarUploaderMain">
      <el-upload
        class="avatarUploader"
        :action="`${sendUrl}`"
        :show-file-list="false"
        :headers="headers"
        :on-success="handleAvatarSuccess"
        :on-error="handleAvatarerror"
        :before-upload="beforeAvatarUpload"
        :data="data"
      >
        <div class="avatarBody" v-if="imageUrl">
          <div class="avatar pdf-text" v-if="isPDF&&imageUrl.includes('.pdf')">{{file.name}}</div>
          <div class="avatar pdf-text" v-if="!isPDF&&imageUrl.includes('.pdf')">{{"点击'+'查看此pdf"}}</div>
          <img v-if="!isPDF&&!imageUrl.includes('.pdf')" :src="'https://img.funpinpin.com/' + imageUrl" class="avatar" />
          <div @click.stop="" class="pupop">
            <i class="el-icon-zoom-in" @click="lookPhoto"></i>
            <i class="el-icon-delete" @click="deletePhoto"></i>
          </div>
        </div>
        <div class="avatarUploaderIconBody" v-else>
          <i class="el-icon-upload avatarUploaderIcon"></i>
          <span class="avatarUploadersmall">{{ placeholder }}</span>
        </div>
      </el-upload>
      <ImageViewer
        v-if="dialogVisible"
        :on-close="
          () => {
            dialogVisible = false;
          }
        "
        :url-list="['https://img.funpinpin.com/' + imageUrl]"
      />
      <div class="avatarUploaderMain-loading" v-if="UploadLoading">
      <i class="el-icon-loading avatarUploaderMain-icon"></i>
        <div class="avatarUploaderMain-loading-context">
          正在上传请稍后
        </div>
      </div>
    </div>
    <div class="smallBncontent NumberWord" :title="Tips" v-html="Tips"></div>
    <div class="error" v-if="isError">{{ error_text }}</div>
  </div>
</template>

<script>
import ImageViewer from "element-ui/packages/image/src/image-viewer";
import { handleResponseErrors } from "@/assets/js/utils";
export default {
  props: {
    value: {
      //vue语法糖
      type: Object,
      default: () => {
        return { value: "", isError: false };
      }
    },
    typename: {
      //图片标识
      type: String,
      default: ""
    },
    seller_id: {
      //用户id
      type: String,
      default: ""
    },
    submitType: {
      //主动启动表单验证
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: "上传图片"
    },
    is_required: {
      type: Boolean,
      default: false
    },
    is_required_text: {
      type: String,
      default: "请上传对应图片"
    },
    Tips: {
      type: String,
      default: "图片大小≤8M，支持PNG.JPG"
    },
    isSupplementToTheAgreement: {
      type: Boolean,
      default: false
    },
    personal: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      UploadLoading: false,
      imageUrl: this.value.value,
      dialogVisible: false,
      error_text: "",
      isError: this.value.isError,
      data: {
        seller_id: "",
        typename: ""
      },
      sendUrl: "",
      headers: {},
      isPDF:false,
      file:null,
    };
  },
  components: { ImageViewer },
  watch: {
    imageUrl(value) {
      this.FormValidation();
      this.$emit("input", { value, isError: this.isError });
    },
    isError(value) {
      this.$emit("input", { value: this.imageUrl, isError: value });
    },
    value: {
      handler(vel) {
        this.imageUrl = vel.value;
        this.isError = vel.isError;
      },
      deep: true
    },
    submitType: {
      handler(value) {
        if (value) {
          this.FormValidation();
        }
      },
      immediate: true
    },
    typename: {
      handler(value) {
        this.data = {
          seller_id: this.seller_id,
          typename: value
        };
      },
      immediate: true
    }
  },
  mounted() {
    this.headers.Authorization = "Bearer " + localStorage.getItem("FppToken");
    if (process.env.NODE_ENV != "development") {
      this.sendUrl = process.env.VUE_APP_REQUEST;
    } else {
      this.sendUrl = "/api";
    }
    if (this.isSupplementToTheAgreement) {
      this.sendUrl += "/crm/seller/upload_supplement_protocol_image";
    } else if(this.personal){
          this.sendUrl += "/crm/user/upload_agent_image";
    } else {
        this.sendUrl += "/crm/seller/upload_protocol_image";
    }

    this.data = {
      seller_id: this.seller_id,
      typename: this.typename
    };
  },
  methods: {
    lookPhoto() {
        if(this.isPDF || this.imageUrl.includes('.pdf')){
          window.open('https://img.funpinpin.com/'+ this.imageUrl)
        }else{
            this.dialogVisible = true;
        }
    },
    FormValidation: function() {
      let type = true;
      if (this.is_required) {
        if (this.imageUrl == null || this.imageUrl.length < 1) {
          type = false;
          this.error_text = this.is_required_text;
        }
      }
      this.isError = !type;
    },
    deletePhoto() {
      this.imageUrl = "";
    },
    handleAvatarSuccess(res) {
      if (res.code != 0) {
        handleResponseErrors(res.code, res.msg);
        return;
      }
      this.imageUrl = res.gkey;
      this.UploadLoading = false;
      // console.log(res, file);
    },
    handleAvatarerror() {
      // console.log(err,file)
      handleResponseErrors(9000, "服务异常，请稍后重试");
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt8M = file.size / 1024 / 1024 <= 8;
      this.isPDF = file.type === "application/pdf";
      this.file = file
      this.UploadLoading = true;
      if (!isJPG && !isPNG && !this.isPDF) {
          this.UploadLoading = false;
          this.$message.error("上传图片只能是 JPG，PNG或PDF格式!");
      }
      if (!isLt8M) {
          this.UploadLoading = false;
          this.$message.error("上传文件大小不能超过 8MB!");
      }
      return (isJPG || isPNG || this.isPDF) && isLt8M;
    }
  }
};
</script>
<style lang="scss" scoped>
.avatarUploader {
  width: 195px;
  .avatarUploaderMain {
    width: 140px;
    height: 140px;
    background: #f6f6f6;
    border: 1px solid #f6f6f6;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    .avatarUploader {
      .el-upload {
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatarBody {
        width: 140px;
        height: 140px;
        position: relative;
        overflow: hidden;
        &:hover {
          .pupop {
            display: flex;
          }
        }
        .avatar {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          max-height: 100%;
          display: block;
        }
        .pdf-text{
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 5;
          overflow: hidden;
          font-size: 14px;
          line-height: 20px;
        }
        .pupop {
          display: none;
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          font-size: 20px;
          color: #fff;
          justify-content: center;
          align-items: center;
          :nth-child(1) {
            margin: 0 15px;
          }
          :nth-child(2) {
            margin: 0 15px;
          }
        }
      }
      .avatarUploaderIconBody {
        width: 140px;
        height: 140px;
        .avatarUploaderIcon {
          font-size: 40px;
          color: #8c939d;
          width: 140px;
          height: 89px;
          line-height: 110px;
          text-align: center;
        }
        .avatarUploadersmall {
          display: block;
          font-size: 14px;
          transform: scale(0.85);
          font-weight: 400;
          color: #312f2e;
          line-height: 22px;
        }
      }
    }
  }
  .avatarUploaderMain-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 140px;
    height: 140px;
    transform: translate(-50%, -50%);
    background: #f6f6f6;
    // filter: blur(40px);
    cursor: pointer;
    .avatarUploaderMain-loading-context {
      position: absolute;
      width: 140px;
      top: 75%;
      left: 50%;
      color: #8b929d;
      font-size: 16px;
      text-align: center;
      transform: translate(-50%, -50%) scale(0.8);
    }
  }
  .avatarUploaderMain-icon {
    display: block;
    position: absolute;
    font-size: 25px;
    top: 50%;
    left: 50%;
    color: #8b929d;
    transform: translate(-50%, -50%);
    z-index: 50;
    animation: Loading 2s linear infinite;
  }
}
.smallBncontent {
  width: 100%;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 400;
  color: #312f2e;
  line-height: 22px;
}
.error {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 400;
  color: red;
  line-height: 22px;
}
@keyframes Loading {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
    -webkit-transform: translate(-50%, -50%) rotate(0deg);
  }
  50% {
    transform: translate(-50%, -50%) rotate(180deg);
    -webkit-transform: translate(-50%, -50%) rotate(180deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
    -webkit-transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
