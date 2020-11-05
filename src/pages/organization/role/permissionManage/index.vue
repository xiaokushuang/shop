<template>
  <section class="page-clientsManage">
    <el-row>
      <el-card>
        <el-row slot="header">
          <span class="title">{{currentRoleName}}权限</span>
        </el-row>
        <div class="deliverySetting">
          <!--头部名称-->
          <div class="deliverySetting-table">
            <div class="table-body">
              <div class="first-col">
                                 <span class="bold name-title">
                                    角色
                                </span>
              </div>
              <div class="width120">
                                 <span class="bold name-title">
                                   菜单项
                                 </span>
              </div>
              <div class="width265">
                             <span class="bold name-title">
                                   权限
                             </span>
              </div>
            </div>
          </div>
          <!--多选按钮权限-->
          <div v-loading="permissionLoading">
            <div class="deliverySetting-table" v-for="(item, idx) in permisionList" :key="idx">
              <div class="table-body" v-for="(pro, idx2) in item.secondPermissions" :key="idx2">
                <!--一级权限-->
                <div class="first-col">
                                 <span v-if="idx2 === 0" class="name-title">
                                    <el-checkbox :indeterminate="item.indeterminate1"
                                                 @change="handleChecked('first', item)" :label="item.firstName"
                                                 v-model="item.checked"
                                                 :disabled="!havePermission(412,'编辑')"
                                                 :key="item.firstId">{{ item.firstName }}</el-checkbox>
                                </span>
                </div>
                <!--二级权限-->
                <div v-if="pro.secondName" class="width120">
                                 <span class="name-title">
                                    <el-checkbox
                                            :indeterminate="pro.indeterminate2"
                                            @change="handleChecked('second', pro)"
                                            :label="pro.secondName"
                                            v-model="pro.checked"
                                            :disabled="!havePermission(412,'编辑')"
                                            :key="pro.secondId">
                                        {{ pro.secondName }}
                                    </el-checkbox>
                                 </span>
                </div>
                <!--三级权限-->
                <div class="width265">
                  <span style="display: inline-block;margin-right: 30px;" v-for="c in pro.thirdPermissions" :key="c.thirdId">
                    <el-checkbox
                         v-if="c.thirdName"
                         v-model="c.checked"
                         :label="c.thirdName"
                         :disabled="!havePermission(412,'编辑')"
                         @change="handleChecked('third', c)"
                    >{{c.thirdName}}
                 </el-checkbox>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="save-btn">
            <el-button type="primary" @click="savePermission()">保存</el-button>
          </div>
        </div>
      </el-card>
    </el-row>
  </section>
</template>
<script>
  import mixins from "@/mixins";
  import {mapState} from "vuex";

  export default {
    mixins: [mixins],
    name: "deliverySetting",
    components: {},
    props: [],
    data() {
      return {
        permissionLoading: false,
        currentRoleName: '',//角色名称
        checkedPermissions: [],//默认选中权限
        checkedArr: [],//手动选中权限
      };
    },
    computed: {...mapState(["usersPermission"])},
    created() {
    },
    mounted() {
    },
    methods: {
      havePermission(id, name) {
        return this.usersPermission.indexOf(id) !== -1
      },
      savePermission() {
        this.$parent.$parent.setPermission()
      },
      //初始化数据
      initAreaData() {
        /*返回的选中数组中，如果包含三级权限的id,就将checked置为true*/
        this.permisionList = this.permisionList.map(item => {
          let res = item;
          if (this.checkedPermissions.includes(item.thirdId)) {
            res.checked = true;
          } else {
            res.checked = false;
          }
          return res;
        });

        let resThird = [];
        this.permisionList.forEach(item => {
          let obj = {};
          let existsFirst = resThird.find(c => {
            return c.firstId === item.firstId;
          });

          if (existsFirst) {
            obj = existsFirst;
          } else {
            obj.firstId = item.firstId;
            obj.firstName = item.firstName;
            obj.indeterminate1 = item.indeterminate1;
          }

          obj.checked = false;

          if (!obj.secondPermissions) {
            obj.secondPermissions = [];
          }

          let existsSecond = obj.secondPermissions.find(c => {
            return c.secondId === item.secondId;
          });

          if (!existsSecond) {
            existsSecond = {
              secondId: item.secondId,
              secondName: item.secondName,
              indeterminate2: item.indeterminate2,
              checked: false
            };
            obj.secondPermissions.push(existsSecond);
          }

          if (!existsSecond.thirdPermissions) {
            existsSecond.thirdPermissions = [];
          }

          existsSecond.thirdPermissions.push({
            thirdId: item.thirdId,
            thirdName: item.thirdName,
            checked: item.checked
          });

          if (!existsFirst) {
            resThird.push(obj);
          }
        });
        this.permisionList = resThird;
        this.opreationData()
      },
      //操作数据
      opreationData() {
        //每次点击就将选中的权限清空
        this.checkedArr = []
        this.permisionList.forEach(c => {
          c.secondPermissions.forEach(p => {
            if (p.thirdPermissions && p.thirdPermissions.length > 0) {
              p.checked = p.thirdPermissions.every(p => p.checked)
              //二级菜单的多选框 - 样式显示[条件是三级权限有选中的，并且不能全部选中]
              p.indeterminate2 = (!p.thirdPermissions.every(p => p.checked)) && p.thirdPermissions.some(p => p.checked)
            }
          })

          if (c.secondPermissions && c.secondPermissions.length > 0) {
            c.checked = c.secondPermissions.every(p => p.checked)
            //一级菜单的多选框 - 样式显示[条件是二级权限有选中的，并且不能全部选中]
            c.indeterminate1 = (!c.secondPermissions.every(p => p.checked)) && c.secondPermissions.some(p => p.checked)
          }
        })
        /*获取选中的权限数组*/
        for (let i = 0; i < this.permisionList.length; i++) {
          for (let j = 0; j < this.permisionList[i].secondPermissions.length; j++) {
            for (let k = 0; k < this.permisionList[i].secondPermissions[j].thirdPermissions.length; k++) {
              if (this.permisionList[i].secondPermissions[j].thirdPermissions[k].checked) {
                this.checkedArr.push(this.permisionList[i].secondPermissions[j].thirdPermissions[k].thirdId)
              }
            }
          }
        }
      },
      handleChecked(level, item) {
        let isChecked = item.checked
        switch (level) {
          case "first":
            if (item && item.secondPermissions) {
              item.secondPermissions.forEach(p => {
                if (p.thirdPermissions) {
                  p.thirdPermissions.forEach(c => {
                    c.checked = isChecked
                  })
                }
              })
            }
            break;
          case "second":
            if (item && item.thirdPermissions) {
              item.thirdPermissions.forEach(c => {
                c.checked = isChecked
              })
            }
            break;
          case "third":
            break;
        }
        this.opreationData()
      }
    },
  };
</script>
<style lang="scss">
  .page-clientsManage {
    width: 100%;
    .el-card.is-always-shadow,
    .el-card.is-hover-shadow:focus,
    .el-card.is-hover-shadow:hover {
      box-shadow: none;
      border: none;
    }
  }

  .first-col {
    padding-left: 20px;
    width: 150px;
  }

  .deliverySetting {
    padding: 20px 0;
    position: relative;
    .name-title {
      display: inline-block;
      line-height: 30px;
      cursor: pointer;
    }
    .bold {
      font-weight: bold;
    }
    .save-btn {
      text-align: right;
      padding: 0px 16px;
      margin-top: 15px;
    }
    //表格样式修改
    .el-table thead tr th {
      font-size: 14px;
    }
    .el-table tbody tr td {
      vertical-align: baseline;
    }
    .el-table tbody tr td p {
      line-height: 30px;
    }
    .el-table tbody tr td .el-checkbox-group {
      display: flex;
      flex-direction: column;
    }
    .el-table tbody tr td .el-checkbox-group label {
      line-height: 30px;
      margin-left: 0;
    }
    .deliverySetting-table {
      font-size: 14px;
      color: #333;
      border-bottom: 1px solid #e4e4e4;
      .table-head,
      .table-body {
        display: flex;
        padding: 10px 0;
      }

      .table-head .selection,
      .table-body .selection {
        text-align: center;
        line-height: 36px;
      }

      .table-head .width120,
      .table-body .width120 {
        width: 150px;
      }
      .table-head {
        height: 36px;
        align-items: center;
        background-color: #e7f2ff;
      }

      .table-body {
        color: #666;
      }

      .table-body:hover {
        background-color: #f5f7fa;
      }
      .table-body .width265 label {
        line-height: 30px;
        margin-left: 0;
        color: #666;
        padding: 0 5px;
      }

      .table-body p {
        line-height: 30px;
      }
      .el-checkbox__label {
        padding-left: 5px;
      }
    }

    .deliverySetting-btn {
      height: 59px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: absolute;
      top: -55px;
      right: -16px;
      z-index: 100;
      .tabs-btn {
        min-width: 90px;
        height: 34px;
        line-height: 32px;
        padding: 0 10px;
        color: #2387f7;
        border: solid 1px #4fa2ff;
        background-color: #e7f2ff;
        cursor: pointer;
      }
      .tabs-btn:nth-of-type(2) {
        margin: 0 15px;
      }
      .tabs-btn input {
        border: none;
        background: transparent;
        color: inherit;
        cursor: inherit;
        outline: none;
        margin: 0;
        padding: 0;
      }
      .tabs-btn:hover {
        color: #fff;
        background-color: #2387f7;
      }
    }
  }
</style>

