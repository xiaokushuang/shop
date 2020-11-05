<template>
  <div class="create-input">
    <div
      class="inputBox"
      :class="{
        ErrorClass: isError,
        success: !isError && myValue != '' && successContent != '',
        icon: icon != '',
      }"
    >
      <div
        v-if="icon != ''"
        class="iconBody"
        :style="'background-image: url(' + icon + ');'"
      ></div>
      <input
        :type="inputType"
        :placeholder="placeholder"
        v-model="myValue"
        @input="FormValidation()"
        @blur="FormValidation()"
      />
      <div class="Describe" v-if="successContent != ''">
        {{ successContent }}
      </div>
    </div>
    <small class="errorText" v-show="isError">{{ error_text }}</small>
  </div>
</template>
<script>
import { Debounce } from "@/assets/js/utils";
export default {
  props: {
    value: {
      //vue语法糖
      type: Object,
      default: () => {
        return { value: "", isError: false };
      },
    },
    //提交触发，传入true自动启动表单验证
    submitType: {
      type: Boolean,
      default: false,
    },
    //输入提示
    placeholder: {
      type: String,
      default: "请输入",
    },
    //错误文本提示
    error_content: {
      type: String,
      default: "",
    },
    //表单状态
    type: {
      type: String,
      default: "",
    },
    //是否必填
    is_required: {
      type: Boolean,
      default: false,
    },
    //必填项内容为空时提示
    is_required_text: {
      type: String,
      default: "输入框不能为空",
    },
    //成功文本提示
    successContent: {
      type: String,
      default: "",
    },
    //传入"require('@/assets/images/main/icon02.png')"
    icon: {
      type: String,
      default: "",
    },
    inputType: {
      // 输入框状态
      type: String,
      default: "text",
    },
  },
  data() {
    return {
      myValue: this.value.value,
      error_text: "",
      isError: this.value.isError,
    };
  },
  watch: {
    myValue(value) {
      this.$emit("input", { value, isError: this.isError });
    },
    isError(value) {
      this.$emit("input", { value: this.myValue, isError: value });
    },
    value: {
      handler(vel, old) {
        this.isError = vel.isError;
        this.myValue = vel.value;
        if (vel.isError) {
          this.FormValidation();
          if (!this.isError) {
            this.error_text = this.error_content;
            this.isError = true;
          }
        }
      },
      deep: true,
    },
    submitType: {
      handler(value) {
        if (value) {
          this.FormValidation();
        }
      },
      immediate: true,
    },
  },
  methods: {
    FormValidation: function() {
      let key = this.type;
      let res;
      let type = true;
      if (this.is_required) {
        if (this.myValue == null || this.myValue.length < 1) {
          // type = false;
          this.isError = true;
          this.error_text = this.is_required_text;

          return;
        }
      } else {
        if (this.myValue == "") {
          this.isError = false;
          return;
        }
      }
      let text = this.error_content == "" ? false : this.error_content;
      switch (key) {
        case "phoneno":
          res = /^1[3-9][0-9]{9}$/;
          type = res.test(this.myValue);
          if (!type) {
            this.error_text = text || "请输入正确的手机号码";
          }
          break;
        case "user":
          res = /(^1[3-9][0-9]{9}$)|(^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$)/;
          type = res.test(this.myValue);
          if (!type) {
            this.error_text = text || "请输入正确的邮箱/手机号";
          }
          break;
        case "email":
          res = /^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
          type = res.test(this.myValue);
          if (!type) {
            this.error_text = text || "请输入正确的邮箱";
          }
          break;
        case "zipcode":
          res = /^[0-9]{6}$/;
          type = res.test(this.myValue);
          if (!type) {
            this.error_text = text || "请输入正确的邮编";
          }
          break;
        case "ShopName":
          type = true;
          if (/^(\_|\-{1})|[^A-Za-z0-9\_\-]+$/.test(this.myValue)) {
            type = false;
            this.error_text =
              "商店名称仅支持英文、数字、横线、下划线，且不能以横线或下划线开头";
          } else if (/^(funpinpin)$/.test(String(this.myValue).toLowerCase())) {
            type = false;
            this.error_text = "商店名称已被使用";
          } else if (this.myValue.length < 4) {
            type = false;
            this.error_text = "商店名称至少 4 个字符";
          } else if (this.myValue.length > 60) {
            type = false;
            this.error_text = "商店名称最长 60 个字符";
          }
          break;
        case "":
          type = true;
          break;
        default:
          res = new RegExp(key);
          type = res.test(this.myValue);
          if (!type) {
            this.error_text = text;
          }
          break;
      }
      this.isError = !type;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/common.scss";
input {
  background: none;
  outline: none;
  border: 0px;
}
.create-input {
  margin-bottom: 20px;
  .errorText {
    width: 100%;
    display: inline-block;
    margin-top: 4px;
    font-size: 14px;
    color: red;
    text-align: left;
  }
  .inputBox {
    width: 100%;
    min-height: 54px;
    position: relative;
    &.ErrorClass {
      border-color: red;
      input {
        border-color: red;
        &:focus {
          border-color: red;
        }
      }
    }
    &.success {
      input {
        border-bottom: none;
        border-radius: 8px 8px 0 0;
        &:focus {
          border-width: 1px;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
        }
      }
      .Describe {
        display: block;
      }
    }
    &.icon {
      input {
        padding-left: 47px;
      }
    }
    .iconBody {
      position: absolute;
      left: 17px;
      top: 0;
      width: 20px;
      height: 54px;
      background-size: 20px auto;
      background-position: center center;
      background-repeat: no-repeat;
    }
    input {
      font-family: $font;
      box-sizing: border-box;
      border: 1px solid $grays;
      font-size: 18px;
      color: $fontSize-gray;
      width: 100%;
      min-height: 54px;
      line-height: 200%;
      // max-width: 420px;
      min-width: 100px;
      // line-height: 2.4rem;
      border-radius: 8px;
      padding: 0 20px 0 10px;
      &:focus {
        color: $black;
        border: 2px solid $gray;
      }
      &::placeholder {
        color: $fontSize-gray;
      }
    }
    .Describe {
      display: none;
      width: 100%;
      min-height: 54px;
      color: $black;
      font-size: 14px;
      padding: 10px 15px;
      box-sizing: border-box;
      background-color: $orangeLight;
      line-height: 1.6;
      text-align: left;
      border: 1px solid $grays;
      border-radius: 0 0 8px 8px;
    }
  }
}
</style>
