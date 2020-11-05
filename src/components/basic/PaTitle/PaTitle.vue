<template>
  <div class="PaTitle">
    <slot />
  </div>
</template>
<script>
export default {
  name: "PaTitle"
};
</script>
<style lang="scss" scoped>
.PaTitle {
  padding: 15px 0;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px #e9e9e9 solid;
}
</style>
