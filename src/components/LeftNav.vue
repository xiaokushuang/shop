<template>
  <div class="warp">
    <el-menu  :default-active='$route.path' :router='true' style="height: 100%;">　　　　　　
      <div v-for="(item, index) in navlist" :key="index">
        <el-submenu
                :index="index.toString()"
        >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{ item.navName }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
                    v-for="(items, k) in item.children"
                    :key="index + '-' + k"
                    :index="items.path"
            >{{ items.navName }}
            </el-menu-item
            >
          </el-menu-item-group>
        </el-submenu>

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
                navName: "商务审核",
                path: "/home",
                jurisdiction: false,
                icon: "el-icon-s-home"
              },
              {
                navName: "运营审核",
                path: "/",
                jurisdiction: false,
                icon: "el-icon-s-home"
              },
              {
                navName: "财务审核",
                path: "/",
                jurisdiction: false,
                icon: "el-icon-s-home"
              },
              {
                navName: "商户列表",
                path: "/",
                jurisdiction: false,
                icon: "el-icon-s-home"
              }
            ]
          },
          {
            navName: "组织机构",
            path: "/",
            jurisdiction: false,
            icon: "el-icon-menu",
            children: [
              {
                navName: "角色管理",
                path: "/",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
              {
                navName: "用户管理",
                path: "/",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
            ],
          },
          {
            navName: "代理商管理",
            path: "/",
            jurisdiction: false,
            icon: "el-icon-s-check",
            children: [
              {
                navName: "代理商列表",
                path: "/",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
              {
                navName: "渠道列表",
                path: "/",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
              {
                navName: "个人信息",
                path: "/",
                jurisdiction: false,
                icon: "el-icon-s-home",
              },
            ],
          },
        ]
      };
    },
    methods: {
    },
    created() {
      // this.initUsersRoleList()
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
