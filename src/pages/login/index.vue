<template>
  <div class="warp">
    <div class="login-box">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="扫码登录" name="first">
          <div class="login_wechat_work-box">
            <div id="login_wechat_work"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="账号登录" name="second">
          <div class="email-login">
            <div class="em-title">账号登录</div>
            <div class="em-input">
              <el-input placeholder="请输入邮箱" v-model="from.email">
                <i slot="prefix" class="el-input__icon el-icon-user"></i>
              </el-input>
            </div>
            <div class="em-input">
              <el-input
                placeholder="请输入密码"
                v-model="from.password"
                show-password
              >
                <i slot="prefix" class="el-input__icon el-icon-lock"></i>
              </el-input>
            </div>
            <el-button type="primary" class="em-butt" @click="login"
              >登录</el-button
            >
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import store from "@/store/index";
import { mapState, mapMutations } from "vuex";
import { login } from "@/assets/js/api";
import { handleResponseErrors, showMsg } from "@/assets/js/utils";
export default {
  store,
  data() {
    return {
      activeName: "first",
      from: {
        password: "",
        email: ""
      }
    };
  },
  computed: { ...mapState(["userMsg"]) },
  mounted() {
    this.iflogin();
    this.getlogin();
  },
  methods: {
    ...mapMutations(["upDataUserMsg"]),
    async iflogin() {
      console.log('ssssa---',this.$route)
      if (this.$route.query.code) {
        try {
          let res = await login.loginMsg({
            code: this.$route.query.code
          });
          if (res.code == 0) {
            localStorage.setItem("FppToken", res.token);
            this.upDataUserMsg({
              id: window.btoa(res.fpp_id),
              email: res.email,
              username: res.username,
              role_list: res.role_list
            });
            this.$router.push({
              path: `/`
            });
          } else {
            handleResponseErrors(res.code, res.msg);
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
    async getlogin() {
      try {
        let res = await login.login();
        if (res.code == 0) {
          let { agentid, appid, state } = res;
          const url = window.location.origin + window.location.pathname;
          window.WwLogin({
            id: "login_wechat_work",
            appid,
            agentid,
            state,
            redirect_uri: encodeURIComponent(
              `${process.env.VUE_APP_REQUEST}/auth/crm_qywx_redirect?callbackUrl=${encodeURIComponent(
                url
              )}`
            ),
            href: ""
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    async login() {
      if (
        !/^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/.test(
          this.from.email
        )
      ) {
        showMsg("请输入正确的邮箱", 3);
        return;
      }
      if (this.from.email == "") {
        showMsg("请输入密码", 3);
        return;
      }
      try {
        let res = await login.emailLogin(this.from);
        if (res.code == 0) {
          localStorage.setItem("FppToken", res.token);
          this.upDataUserMsg({
            id: window.btoa(res.fpp_id),
            email: res.email,
            username: res.username,
            role_list: res.role_list
          });
          this.$router.push({
            path: `/`
          });
        } else {
          handleResponseErrors(res.code, res.msg);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.warp {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  color: rgba(29, 36, 54, 0.8);
}
.login-box {
  width: 440px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.login_wechat_work-box {
  min-width: 300px;
  // min-height: 400px;
  animation: test 0.8s;
  overflow: hidden;
}
.email-login {
  width: 300px;
  // height: 400px;
  animation: heightframes 1s;
  .em-title {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
  }
  .em-input {
    padding-top: 20px;
  }
  .em-butt {
    display: block;
    margin-top: 15px;
    margin-left: auto;
  }
}
@keyframes heightframes {
  from {
    min-height: 400px;
  }
  to {
    min-height: 0;
  }
}
@keyframes test {
  from {
    max-height: 200px;
  }
  to {
    max-height: 400px;
  }
}
</style>
