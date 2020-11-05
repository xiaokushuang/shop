<template>
  <div class="warp">
    <a href="/">
      <div class="logoWrap d-flex hover">
        <img src="../assets/images/main/logo.png" alt="" />
        <span>CRM系统</span>
      </div>
    </a>
    <el-popover placement="bottom-start" width="250" trigger="hover">
      <div class="loginType">
        <li> userMsg.username</li>
        <li> userMsg.email </li>
        <li @click="goToLogin()">退出登录</li>
      </div>
      <el-avatar :size="25" :src="imgUrl" slot="reference"></el-avatar>
    </el-popover>
  </div>
</template>

<script>
import store from "@/store/index";
import { mapState } from "vuex";
export default {
  store,
  data() {
    return {
      imgUrl:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    };
  },
  computed: { ...mapState(["userMsg"]) },
  methods: {
    goToLogin() {
      localStorage.clear();
      this.$router.replace({
        path: "/"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.warp {
  padding: 0 20px;
  min-width: 960px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.05);
  a {
    display: flex;
    flex: 1;
    justify-content: flex-start;
    align-items: center;
    text-decoration: none;
  }
  .logoWrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: #333;
    font-weight: bold;
    img {
      width: 60px;
      margin-right: 5px;
    }
  }
  .logoTag {
    margin-left: 10px;
  }
}
.selectBox {
  width: 120px;
  .selectType {
    margin-right: 15px;
  }
}

.logo {
  width: 170px;
  height: 50px;
}
.title {
  color: #f73b3b;
  margin-left: 5px;
  font-size: 22px;
}
.loginType {
  li {
    cursor: pointer;
    padding: 5px;
    &:hover {
      background-color: #eee;
    }
    span{
      margin: 3px 3px 3px 0;
    }
  }
}
</style>
