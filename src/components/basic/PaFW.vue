<template>
  <div class="popup" v-if="isShow" v-fixed>
    <div class="PopupShowBody" :style="`width:${width};`">
      <div class="title">
        <span>{{ title }}</span>
        <i @click="close" class="el-icon-close"></i>
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "PaFW",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    width: {
      type: String,
      default: "600px"
    }
  },
  data() {
    return {
      isShow: this.value
    };
  },
  watch: {
    value(vel) {
      this.isShow = vel;
    },
    isShow(vel) {
      this.$emit("input", vel);
    }
  },
  directives: {
    fixed: {
      // inserted 被绑定元素插入父节点时调用
      inserted() {
        let scrollTop =
          document.body.scrollTop || document.documentElement.scrollTop;
        document.body.style.cssText +=
          "position:fixed;width:100%;top:-" + scrollTop + "px;";
      },
      // unbind 指令与元素解绑时调用
      unbind() {
        let body = document.body;
        body.style.position = "";
        let top = body.style.top;
        document.body.scrollTop = document.documentElement.scrollTop = -parseInt(
          top
        );
        body.style.top = "";
      }
    }
  },
  methods: {
    close() {
      this.isShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.popup {
  font-family: PingFangSC-Medium, PingFang SC;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
  -webkit-justify-content: center;
  -webkit-align-items: center;
}
.PopupShowBody {
  background: #fff;
  padding-bottom: 10px;
  vertical-align: middle;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  font-size: 18px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: left;
  .title {
    padding: 15px 15px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    line-height: 1;
    color: #303133;
    border-bottom: 1px solid #dee2e6;
    i {
      cursor: pointer;
    }
  }
}
</style>
