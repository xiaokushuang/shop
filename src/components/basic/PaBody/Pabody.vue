<template>
  <div class="Pabody">
    <slot />
  </div>
</template>
<script>
export default {
  name: "Pabody"
};
</script>
<style lang="scss" scoped>
.Pabody {
  padding: 25px;
  background: #fff;
  border-radius: 6px;
  box-sizing: border-box;
}
</style>
