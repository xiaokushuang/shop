<template>
  <div class="popup" v-if="isShow" v-fixed>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
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
  z-index: 10000000;
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
  -webkit-justify-content: center;
  -webkit-align-items: center;
}
</style>
