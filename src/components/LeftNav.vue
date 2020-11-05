<template>
  <div class="warp">
    <el-menu :default-active='$route.path' :router='true' style="height: 100%;">　　　　　　
      <div v-for="(item, index) in navlist" :key="index">
        <el-submenu
                :index="index.toString()"
                v-if="item.children && item.jurisdiction"
        >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.navName }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
                    v-for="(items, k) in item.children"
                    v-show="items.jurisdiction"
                    :key="index + '-' + k"
                    :index="items.path"
            >{{ items.navName }}
            </el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item :index="item.path" v-else-if="item.jurisdiction">
          <i :class="item.icon"></i>
          <span>{{ item.navName }}</span>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
  import {organization} from "@/assets/js/api";
  import {handleResponseErrors} from "@/assets/js/utils";
  import {mapState, mapMutations} from "vuex";
  import { login } from "@/assets/js/api";
  export default {
    name: "leftnav",
    data() {
      return {
        roleList: [],
        permissionList: [],
        navlist: [
          {
            navName: "数据驾驶舱",
            path: "/",
            jurisdiction: true,
            icon: "el-icon-data-line",
            // children:[]
          },
          {
            navName: "审核列表",
            jurisdiction: false,
            icon: "el-icon-edit-outline",
            children: [
              {
                permissionId: [100,101,102],
                navName: "商务审核",
                path: "/BusinessReview",
                jurisdiction: false,
                icon: "el-icon-s-home"
              },
              {
                permissionId: [111, 110],
                navName: "运营审核",
                path: "/OperationAudit",
                jurisdiction: false,
                icon: "el-icon-s-home"
              },
              {
                permissionId: [120,121],
                navName: "财务审核",
                path: "/FinancialAudit",
                jurisdiction: false,
                icon: "el-icon-s-home"
              },
              {
                permissionId: [141, 142],
                navName: "商户列表",
                path: "/BusinessListings",
                jurisdiction: false,
                icon: "el-icon-s-home"
              }
            ]
          },
          {
            navName: "组织机构",
            path: "/Organization",
            jurisdiction: false,
            icon: "el-icon-menu",
            children: [
              {
                permissionId: [411, 412],
                navName: "角色管理",
                path: "/Role",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
              {
                permissionId: [421, 423, 424],
                navName: "用户管理",
                path: "/User",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
            ],
          },
          {
            navName: "代理商管理",
            path: "/agentManagement",
            jurisdiction: false,
            icon: "el-icon-s-check",
            children: [
              {
                permissionId: [311, 312],
                navName: "代理商列表",
                path: "/AgentList",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
              {
                permissionId: [321],
                navName: "渠道列表",
                path: "/ChannelsShare",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
              {
                permissionId: [331],
                navName: "个人信息",
                path: "/PersonalInfo",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
            ],
          },
        ]
      };
    },
    /*监听是否点击角色管理的保存按钮，点击之后就需要重新刷新leftNav值，刷新之后再把flag值置为false*/
    computed: {...mapState(["updateNav","userMsg"])},
    watch: {
      updateNav(val, oldVal) {
        if (val) {
          this.initUsersRoleList()
          this.$store.commit('setUpdateNav', false);
        }
      }
    },
    methods: {
      ...mapMutations(["savePermission","upDataUserMsg"]),
      //角色列表数据获取
      async initUsersRoleList() {
        try {
          let res = await organization.getUsersRoleList();
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.roleList = res.role_list
            //更新角色信息，header 中的个人信息中的角色实时更新
            this.upDataUserMsg({
              id:this.userMsg.id,
              username:this.userMsg.username,
              email:this.userMsg.email,
              role_list: this.roleList
            });
            /*将所有角色的权限整合到一个数组中，并进行数组扁平化处理*/
            this.permissionList = this.roleList.map(item => {
              return item.permission_list
            }).flat(Infinity)
            //数组去重
            this.permissionList = Array.from(new Set(this.permissionList))
            this.$store.commit('setUsersPermission', this.permissionList);
            this.savePermission({
              permissionList: this.permissionList,
            });
            /*循环判断导航栏中的权限id是否包括在返回的权限数组中，,*/
            for (let i = 0; i < this.navlist.length; i++) {
              if (this.navlist[i].children) {
                for (let j = 0; j < this.navlist[i].children.length; j++) {
                  //如果菜单中的权限包括在权限数组里
                  if (this.navlist[i].children[j].permissionId.some(item => {
                    return this.permissionList.indexOf(item) !== -1
                  })) {
                    //将包括的jurisdiction置为true
                    this.navlist[i].children[j].jurisdiction = true
                  } else {
                    //否则置为false
                    this.navlist[i].children[j].jurisdiction = false
                  }
                  //如果菜单中的children 中的jurisdiction都为false 的话，就将父级的jurisdiction置为false
                  if (this.navlist[i].children.every(item => {
                    return item.jurisdiction == false
                  })) {
                    this.navlist[i].jurisdiction = false
                  } else {
                    this.navlist[i].jurisdiction = true
                  }
                }
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      async iflogin() {
        try {
          let res = await login.loginMsg({
            code: this.$route.query.code
          });
          console.log('重新刷新useMsg 数据',res)
          if (res.code == 0) {
            this.upDataUserMsg({
              id: window.btoa(res.fpp_id),
              email: res.email,
              username: res.username,
              role_list: res.role_list
            });
          } else {
            handleResponseErrors(res.code, res.msg);
          }
        } catch (error) {
          console.log(error);
        }
      },
    },
    created() {
      this.initUsersRoleList()
    },
    mounted() {

    },
  };
</script>

<style lang="scss" scoped>
  .warp {
    // background: #F73B3B;
    background: #fff;
    height: 100%;
  }

  .tools {
    height: 100px;
    background: red;
  }
</style>
