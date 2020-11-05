<template>
  <div class="createDialog">
    <div>
      <div class="margin-b10">姓名</div>
      <!--编辑弹窗显示的姓名输入框-->
      <el-input
              v-if="lineData"
              class="margin-b10"
              placeholder=""
              v-model="lineData.username"
              :disabled="true">
      </el-input>
      <!--创建弹窗显示的姓名输入框-->
      <limitWordPaInput
              v-else
              class="crmCreateUserInput"
              v-model="form.name"
              placeholder="请输入姓名"
              is_required_text="请输入姓名"
              :minlength=0
              :maxlength=20
              :wordLimit="true"
              :submitType="submitType"
              :is_required="true"
      />
    </div>
    <div>
      <div class="margin-b10">邮箱</div>
      <!--编辑弹窗显示的邮箱输入框-->
      <el-input
              v-if="lineData"
              class="margin-b10"
              placeholder=""
              v-model="lineData.email"
              :disabled="true">
      </el-input>
      <!--创建弹窗显示的邮箱输入框-->
      <limitWordPaInput
              v-else
              class="crmCreateUserInput"
              v-model="form.email"
              type="(^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$)"
              placeholder="请输入登录邮箱"
              error_content="请输入正确的邮箱"
              :submitType="submitType"
              :is_required="true"
      />
    </div>
    <div>
      <div class="margin-b10">密码</div>
      <limitWordPaInput
              class="crmCreateUserInput"
              v-model="form.password"
              inputType="password"
              type="(^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])\w{6,})"
              placeholder="请设置不低于6位，且包含大小写字母和数字的密码"
              error_content="请设置不低于6位，且包含大小写字母和数字的密码"
              :submitType="submitType"
              :is_required="lineData?false:true"
      />
    </div>
    <div class="margin-b10" v-if="roleList&&roleList.length>0">
      <div class="margin-b10">角色</div>
      <el-checkbox-group v-model="checkList" @change="handleCheckedRoleChange">
        <el-checkbox v-for="data in roleList" :key="data.id" :label="data.id">{{data.role_name}}</el-checkbox>
      </el-checkbox-group>
      <div class="errorText" v-if="roleError">请关联至少一个角色</div>
    </div>
    <!--<div class="margin-b10" v-if="roleList&&roleList.length>0">
        <div class="margin-b10">所属商务</div>
        <el-checkbox-group v-model="checkList" @change="handleCheckedRoleChange">
            <el-checkbox v-for="data in roleList" :key="data.id" :label="data.id">{{data.role_name}}</el-checkbox>
        </el-checkbox-group>
        <div class="errorText" v-if="roleError">请关联至少一个所属商务</div>
    </div>-->
    <div class="margin-b10 text-r">
      <el-button @click="handleCancel()">取 消</el-button>
      <el-button @click="handleSure()" type="primary">确 定</el-button>
    </div>
  </div>
</template>

<script>
  import {organization} from "@/assets/js/api";
  import {handleResponseErrors} from "@/assets/js/utils";
  import limitWordPaInput from "@/components/basic/limitWordPaInput.vue";
  import {mapState} from "vuex";

  export default {
    name: "createDialog",
    props: ["roleList", "lineData"],
    components: {
      limitWordPaInput
    },
    computed: {...mapState(["userMsg"])},
    data() {
      return {
        roleError: false,
        checkList: [],
        submitType: false,
        form: {
          name: {value: "", isError: false},
          email: {value: "", isError: false},
          password: {value: "", isError: false},
        },
      }
    },
    created() {
    },
    mounted() {
      //用户列表点击编辑，将角色信息默认选中
      if (this.lineData && this.lineData.role_infos && this.lineData.role_infos.length > 0) {
        let roleInfoIdArr = []
        for (let i = 0; i < this.lineData.role_infos.length; i++) {
          roleInfoIdArr.push(this.lineData.role_infos[i].id)
        }
        this.checkList = roleInfoIdArr
      }
    },
    methods: {
      //用户列表数据获取
      async initUserList() {
        try {
          let data = {
            limit: 0,
          }
          let res = await organization.getUserList(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.relevanceUserList = res.user_list
          }
        } catch (error) {
          console.log(error);
        }
      },
      //创建用户
      async createUser() {
        try {
          let data = {
            username: this.form.name.value,
            email: this.form.email.value,
            password: this.form.password.value,
            role_list: this.checkList
          }
          let res = await organization.getCreateUser(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.$emit("closeDialog", 'f55')
            this.$message({
              message: '创建成功！',
              type: 'success'
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      //编辑用户
      async editUser() {
        try {
          let data = {
            password: this.form.password.value,
            role_ids: this.checkList
          }
          let res = await organization.editUser(data, this.lineData.id);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.$emit("closeDialog", 'f5')
            //点击保存之后，将flag设置为true,存到vuex中，在leftNav页面如果检测到这个值发生变化，就更新数据
            if(this.lineData.id===window.atob(this.userMsg.id)){
              this.$store.commit('setUpdateNav', true);
            }
            this.$message({
              message: '编辑成功！',
              type: 'success'
            });
          }
        } catch (error) {
          console.log(error);
        }
      },
      handleCheckedRoleChange() {
        if (this.checkList.length > 0) {
          this.roleError = false
        }
      },
      handleCancel() {
        this.$emit("closeDialog")
      },
      handleSure() {
        const emailReg = /^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        const passwordReg = /^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])\w{6,}/;
        //错误提示语的展示
        this.submitType = true;
        if (this.checkList.length < 1) {
          this.roleError = true
        }
        //点击编辑弹窗的确定按钮
        if (this.lineData) {
          //(密码不修改 || 密码输入符合要求)&&角色必须选择 都可以调用接口
          if ((passwordReg.test(this.form.password.value) || !this.form.password.value) && !this.roleError) {
            this.editUser()
          }
          //点击创建弹窗的确定按钮
        } else {
          if ((emailReg.test(this.form.email.value)) && (this.form.name.value) && passwordReg.test(this.form.password.value) && !this.roleError) {
            this.createUser()
          }
        }
      }
    },
  }
</script>
<style lang="scss">
  .crmCreateUserInput .inputBox input {
    font-size: 12px !important;
    min-height: 34px !important;
  }

  .createDialog {
    .el-checkbox {
      line-height: 35px;
    }
  }
</style>
<style scoped lang="scss">

  .createDialog {
    .errorText {
      width: 100%;
      display: inline-block;
      margin-top: 4px;
      font-size: 14px;
      color: red;
      text-align: left;
    }
  }
</style>