<template>
  <div class="main_body">
    <div class="header">
      <Header />
    </div>
    <el-container class="main">
      <el-aside width="200px">
        <LeftNav />
      </el-aside>
      <el-main class="content">
        <div class="ct-body">
          <router-view />
        </div>
      </el-main>
    </el-container>
    <template>
      <el-backtop target=".el-main"></el-backtop>
    </template>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import LeftNav from "@/components/LeftNav.vue";

export default {
  name: "index",
  components: {
    Header,
    LeftNav
  },
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang="scss">
html,
body,
#app {
  padding: 0;
  margin: 0;
  height: 100%;
  min-width: 1100px;
  background-color: #ededed;
}
.main_body {
  min-height: 100vh;
}
.header {
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 11;
  min-width: 960px;
}
.el-aside {
  position: fixed;
  top: 60px;
  left: 0;
  z-index: 10;
  overflow: hidden;
  height: 100%;
  font-family: PingFangSC-Regular, Microsoft YaHei, Arial, Helvetica, sans-serif;
}
.main {
  max-height: 100vh;
  min-width: 1160px;
}
.el-container {
  height: 100%;
  background: #ededed;
}
.ct-body {
  width: 100%;
  margin: 0 auto;
  padding: 15px;
  /*overflow-x: hidden;*/
}
.content {
  margin-top: 60px;
  padding-bottom: 20px;
}
.el-main {
  margin-left: 200px;
}
</style>
