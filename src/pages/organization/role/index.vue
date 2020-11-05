<template>
  <div class="role-class">
    <Pabody>
      <PaTitle class="flex-space-between">
        <span>角色管理</span>
        <span class="margin-b10 text-r">
                    <el-button v-if="havePermission(411,'创建')" @click="handleCreate()">创建</el-button>
                </span>
      </PaTitle>
      <div class="flex roles-manage">
        <!--角色列表-->
        <section class="roles-setting">
          <h3 class="title">角色</h3>
          <div>
            <!--角色列表-->
            <ul v-loading="roleLoading" class="roles-list">
              <li @click="handleClickLi(data.id,data.role_name,data.permission_list)"
                  v-for="(data,index) in roleList" :key="index">
                <div class="flex flex-space-between roles-bj"
                     :class="currentLi===data.id?'roles-focus-bj':''">
                  <!--角色名称-->
                  <div v-if="!data.renameFlag">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAGKADAAQAAAABAAAAGAAAAADiNXWtAAADxklEQVRIDYVWTWhUVxQ+574382Zqpo1JVFCRFiWMFbopolTxB7qRQDQbrZuKkl2JRRC7DG7apajbQBDc1wS66MpRgtR2VaQlGzf+hNZWE9NkMvPe/el33rx582Z8Tg7cvHvPvff7zt89E6Y+cvXqz9ubio5Z644Qud1MPCLHHbl/ifgFs3vkFQoPb37/5d/vg+G8jUvXFnbqBl13zl3Evpd3JqMz2hZnvzlamz56/ruljD6eql7FhW8fjOsNs+isniRnPAyY3Hd4xujJv97wolsYG+/F6yK4MFW7bA3dg+WV3oN914jDanNLBbH70dVOX86eTQnEckd8A+bmhi17qXfOQF4LS2QtK2J7wz0YTz2JCSTmztJdWJ4S9oJstq5HAVm53sK46xbGd8qdGFBvaEloHBbnOlDZeUf77gzVRBthQMYCTvyPsfi6nFSTU7/sBtBFWQhgueTTtuESbR8pU2WgIOpNRULU0EUyxu+cBeby/TODfsTN09j3BLxYUDQ0FJCXBCoIijHp2npE3CczshUCXFupaAmBaJw3qPSnCsBjWMVSCrwYXMhkiJRKXl9wOSPkESq6RSCaRJStKhDuba+Nbc9aX7HDGLzbhKx7N7tyFCH+oXiAfLTFOh5WuB5nW6yoNzSt13W8z1CEkaW1tf7hkcNiiFgf2Z6cMX2YyQpOwdTllRAkhhTyEDYtPIBbgpAVsUYMFX3ylQqKtMB1PJArPhrYErwYlYUIypUa8EREcPLAdX2d3vz+G3nFgCoHDpHzSxThITU1PMga42jVh+IpSFOCFFgmuSLWOyrv2EUWffCLPX/Q/l2voGPaUVnGNylB3FXsXvuw8iecP5WLlaeEpf6WAfpoXxWl6dHnH8/Rkb2/EtkiKgIhksfWFqsWVcEFc1ijXW4uDlZKvYfao0ZI1AwZcUdYDMDl29XG2KzYwp/+zO3DL76eqs3Ci8l+FCg5qhSbNLrtJZpa66RxHo188LYHOEFhmt168t5KXEV+2Z/Gb8C5dj/KI4pzhz9j1cf0ydalVmPDQZ/BZmOYzjXm/8A6LYo053G7tujnfTqqeDEALwZL68gzk4YHX332kA7ueYIwJW+AhZEm+Pj8vBCkGblz8/g8mtYVPLAkALLdLagK9P2Anr0dpuerQ/RsZZjqWKcidx1faYOLPiWQxZ3bJ27hJ2MCJHAxX4TEV6ikZEirjqV1Z4JPzN3K3uwikA3xxC97VVb+DLFnMBDI9w/lKQO2GTyJatbyNkmag7Yi+93s3xZr1aPzh+/Xjp394Z/svez8f59JnUKEIB1IAAAAAElFTkSuQmCC"
                         alt/>
                    <span>{{data.role_name}}</span>
                  </div>
                  <!--重命名角色-->
                  <div v-if="data.renameFlag" class="w100">
                    <div @click.stop>
                      <el-input
                              ref="renameInput"
                              type="text"
                              autofocus
                              @blur="handleBlurInput(data,index)"
                              placeholder="请输入内容"
                              v-model="data.role_name"
                              maxlength="20"
                              show-word-limit
                      >
                      </el-input>
                    </div>
                  </div>
                  <div v-if="!data.renameFlag&&havePermission(412,'编辑')" class="roles-point">
                    <div @click.stop>
                      <el-dropdown trigger="click">
                                                <span class="el-dropdown-link">
                                                    ···
                                                </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="handleClickRelevance(data)">
                            关联用户
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="handleClickRename(data,index)">
                            重命名
                          </el-dropdown-item>
                          <el-dropdown-item @click.native="handleClickDel(data)">删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
                <!--关联用户-->
                <div @click.stop v-if="currentLi===data.id&&relevanceList&&relevanceList.length>0"
                     class="associated-data">
                  <h4>关联用户</h4>
                  <div v-for="(item,i) in relevanceList" :key="i" class="margin-b20">
                    <div class="flex">
                      <div class="margin-b10">
                        <div class="avatar-name margin-r10">
                          <span>{{item.username&&item.username.length>1?item.username.substr(-2,2):item.username}}</span>
                        </div>
                      </div>
                      <div style="width: calc(100% - 34px);">
                        <p class="margin-b10">{{item.username}}</p>
                        <p class="word-wrap">{{item.email}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
        <!--权限控制-->
        <section class="permission-setting">
          <permissionManage v-if="isShowPermission" ref="permissionManageRef"></permissionManage>
        </section>
      </div>
      <!--弹窗-->
      <div class="allDialog">
        <el-dialog
                :close-on-click-modal="false"
                :destroy-on-close="true"
                title="创建角色"
                :visible.sync="createRoleDialog"
                width="400px"
        >
          <div>
            <div class="margin-b10">
              <span style="color: #c23934;">*</span>
              <span>角色名称</span>
            </div>
            <!--创建弹窗显示的姓名输入框-->
            <limitWordPaInput
                    class="crm-create-user-input"
                    v-model="form.roleName"
                    placeholder="请输入角色名"
                    is_required_text="请输入角色名"
                    :minlength=0
                    :maxlength=20
                    :wordLimit="true"
                    :submitType="submitType"
                    :is_required="true"
            />
          </div>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="createRoleDialog = false">取 消</el-button>
                        <el-button type="primary" :loading="createRoleLoading"
                                   @click="handleCreateRoleSure()">确定</el-button>
                    </span>
        </el-dialog>
        <el-dialog
                :close-on-click-modal="false"
                :destroy-on-close="true"
                title="移除角色"
                :visible.sync="delDialog"
                width="300px"
        >
          <span>移除后将无法恢复该角色</span>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="delDialog = false">取 消</el-button>
                        <el-button type="danger" :loading="delRoleLoading" @click="handleDelRoleSure()">移除</el-button>
                    </span>
        </el-dialog>
        <el-dialog
                :close-on-click-modal="false"
                :destroy-on-close="true"
                title="添加关联用户"
                :visible.sync="relevanceDialog"
                width="30%"
        >
          <div>
            <el-autocomplete
                    class="w100"
                    v-model="relevanceModel"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入用户名称"
                    @select="handleSelect"
            >
              <template slot-scope="{item}">
                <div>{{item.username}}</div>
              </template>
            </el-autocomplete>
            <span class="select-user" v-for="(data,index) in this.relevanceArr" :key="index">
                            <span>{{data.username}}</span>
                            <i @click="delRelevance(data)" class="el-icon-delete"></i>
                        </span>
          </div>
          <span slot="footer" class="dialog-footer">
                        <el-button @click="relevanceDialog = false">取 消</el-button>
                        <el-button type="primary" @click="relevanceUserSureClick(relevanceModel)">确定</el-button>
                    </span>
        </el-dialog>
      </div>
    </Pabody>
  </div>
</template>

<script>
  import {organization} from "@/assets/js/api";
  import {handleResponseErrors} from "@/assets/js/utils";
  import permissionManage from './permissionManage/index'
  import limitWordPaInput from "@/components/basic/limitWordPaInput.vue";
  import mixins from "@/mixins";
  import {mapState} from "vuex";

  export default {
    mixins: [mixins],
    name: "role",
    components: {
      permissionManage,
      limitWordPaInput
    },
    inject: ['reload'],
    computed: {...mapState(["usersPermission"])},
    data() {
      return {
        isShowPermission: true,//权限板块显示
        delDialog: false,//删除弹窗显示
        relevanceDialog: false,//关联用户弹窗
        createRoleDialog: false,//创建角色弹窗
        relevanceModel: '',//关联用户弹窗-联想查询用户名绑定值
        currentLi: 0,//选中高亮的角色列表
        relevanceList: [],//关联用户列表显示
        relevanceArr: [],//关联用户-联想查询-选中的用户名称
        roleId: '',//添加关联用户-用到的角色id
        roleList: [],//角色列表数据
        roleLoading: false,
        currentName: '',//重命名角色名
        relevanceUserList: [],//关联用户-联想查询-用户名
        submitType: false,
        createRoleLoading: false,
        form: {
          roleName: {
            value: "",
            isError: false
          },//创建角色弹窗-角色名绑定值
        },
        delRoleLoading: false,
      };
    },
    created() {
      this.initRoleList('start')//角色列表数据获取
      this.initUserList()//用户列表数据获取
    },
    methods: {
      havePermission(id) {
        return this.usersPermission.indexOf(id) !== -1
      },
      //角色列表数据获取
      async initRoleList(flag) {
        this.roleLoading = true
        try {
          let res = await organization.getRoleList();
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.roleLoading = false
            let temp_permission_list = []
            let temp_role_name = ''
            this.roleList = res.roles
            if (this.roleList && this.roleList.length > 0) {
              for (let i = 0; i < this.roleList.length; i++) {
                this.roleList[i].renameFlag = false
                //当点击角色列表中的删除或者重命名之后，更新右侧权限内容
                if (this.roleList[i].id === this.currentLi) {
                  temp_permission_list = this.roleList[i].permission_list
                  temp_role_name = this.roleList[i].role_name
                }
              }
            }
            //如果是删除角色的话，就将currentLi置为空,不请求关联用户接口
            if (flag === 'delRoleFlag') {
              this.currentLi = ''
            }
            //第一次获取角色列表数据的时候，默认展示第一个列表的关联用户数据
            else if (flag === 'start') {
              this.handleClickLi(this.roleList[0].id, this.roleList[0].role_name, this.roleList[0].permission_list)
            }
            // 不是第一次的话，就点击哪个角色，显示哪个角色的关联用户数据
            else {
              this.handleClickLi(this.currentLi, temp_role_name, temp_permission_list)
            }
          }
        } catch (error) {
          console.log(error);
        }
      },
      //角色的关联用户列表
      async getRelevanceList(id) {
        this.relevanceList = []
        try {
          let data = {}
          let res = await organization.getRelevanceList(data, id);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.relevanceList = res.user_list
          }
        } catch (error) {
          console.log(error);
        }
      },
      //用户列表数据获取
      async initUserList() {
        try {
          let data = {
            limit: 0
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
      //关联用户
      async addRelevanceUser() {
        let roleIdArr = []
        for (let i = 0; i < this.relevanceArr.length; i++) {
          roleIdArr.push(this.relevanceArr[i].id)
        }
        roleIdArr = roleIdArr.map(Number)
        try {
          let data = {
            user_ids: roleIdArr
          }
          let res = await organization.addRelevanceUser(data, this.roleId);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.relevanceDialog = false
            //角色关联用户之后，更新角色列表数据和关联用户数据
            this.initRoleList()
          }
        } catch (error) {
          console.log(error);
        }
      },
      //删除角色
      async delRole() {
        this.delRoleLoading = true
        try {
          let data = {
            role_id: this.roleId
          }
          let res = await organization.delRole(data, this.roleId);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.delRoleLoading = false
            this.$message({
              message: '角色删除成功！',
              type: 'success'
            });
            this.delDialog = false
            //角色删除完，更新角色列表数据和关联用户数据
            this.initRoleList('start')

          }
        } catch (error) {
          console.log(error);
        }
      },
      //保存设置权限
      async setPermission() {
        this.$refs.permissionManageRef.permissionLoading = true
        try {
          let data = {
            permissions: this.$refs.permissionManageRef.checkedArr
          }
          let res = await organization.setPermission(data, this.currentLi);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.$refs.permissionManageRef.permissionLoading = false
            this.$message({
              message: '保存成功！',
              type: 'success'
            });
            //点击保存之后，将flag设置为true,存到vuex中，在leftNav页面如果检测到这个值发生变化，就更新数据
            this.$store.commit('setUpdateNav', true);
            //保存权限完，更新角色列表数据
            this.initRoleList()
          }
        } catch (error) {
          console.log(error);
        }
      },
      //重命名角色
      async renameRole(i) {
        try {
          let data = {
            role_name: this.roleList[i].role_name
          }
          let res = await organization.renameRole(data, this.roleId);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.$message({
              message: '角色重命名成功！',
              type: 'success'
            });
            //角色重命名完，更新角色列表数据
            this.initRoleList()
          }
        } catch (error) {
          console.log(error);
        }
      },
      //创建角色
      async createRole() {
        this.createRoleLoading = true
        try {
          let data = {
            role_name: this.form.roleName.value
          }
          let res = await organization.createRole(data);
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.createRoleLoading = false
            this.createRoleDialog = false
            this.$message({
              message: '角色创建成功！',
              type: 'success'
            });
            //角色创建完，更新角色列表数据
            this.initRoleList()
          }
        } catch (error) {
          console.log(error);
        }
      },
      //创建弹窗-确定按钮-点击事件
      handleCreateRoleSure() {
        this.submitType = true
        if (this.form.roleName.value) {
          this.createRole()
        }
      },
      //删除角色弹窗-确定按钮-点击事件
      handleDelRoleSure() {
        this.delRole()
      },
      //关联用户弹窗-确定按钮-点击事件
      relevanceUserSureClick() {
        this.addRelevanceUser()
      },
      //点击创建按钮-显示创建弹窗
      handleCreate() {
        this.createRoleDialog = true
        this.form.roleName.value = ''
      },
      //联想查询
      querySearchAsync(queryString, cb) {
        let results = queryString ? this.relevanceUserList.filter(this.createStateFilter(queryString)) : this.relevanceUserList;
        cb(results);
      },
      //联想查询-过滤数据条件
      createStateFilter(queryString) {
        return (state) => {
          return (state.username.toLowerCase().indexOf(queryString.toLowerCase()) != -1);
        };
      },
      //关联用户联想查询-选中选择值
      handleSelect(item) {
        // if (this.relevanceList && this.relevanceList.length > 0) {
        //undefined代表用户没有被添加过
        if (this.relevanceList.find(data => {
          return data.id === item.id
        }) === undefined && this.relevanceArr.find(data => {
          return data.id === item.id
        }) === undefined) {
          this.relevanceArr.push(item)
        } else {
          this.$message({
            message: '用户已添加，请勿重复操作！',
            type: 'warning'
          });
        }
        // }
      },
      //删除选中的关联用户名称
      delRelevance(data) {
        this.relevanceArr.splice(this.relevanceArr.indexOf(data), 1);
      },
      //点击角色列表
      handleClickLi(id, name, permissionList) {
        //请求关联用户数据
        this.currentLi = id
        this.getRelevanceList(id)
        //切换权限数据
        this.$refs.permissionManageRef.currentRoleName = name
        this.$refs.permissionManageRef.checkedPermissions = permissionList === null ? [] : permissionList
        //权限数据初始化显示【避免手动选中权限之后，各个角色之间相互影响】
        this.$refs.permissionManageRef.permisionList = this.permisionList//这个数据存储在mixins中统一管理
        this.$refs.permissionManageRef.initAreaData()
      },
      //点击重命名按钮
      handleClickRename(data, i) {
        this.currentName = data.role_name
        this.roleList[i].renameFlag = true
        this.$forceUpdate()
        this.$nextTick(() => {
          this.$refs.renameInput[0].$el.querySelector('input').focus()
        })
      },
      //重命名输入框，失去焦点，隐藏输入框
      handleBlurInput(data, i) {
        this.roleList[i].renameFlag = false
        this.roleId = data.id
        if (this.currentName !== data.role_name) {
          this.renameRole(i)
          this.$forceUpdate()
        }
      },
      //点击关联用户-出现弹窗
      handleClickRelevance(data) {
        this.roleId = data.id
        this.relevanceModel = ''//清空关联用户的绑定值
        this.relevanceArr = []//清空关联用户的数组显示
        this.relevanceDialog = true
      },
      //点击删除-出现弹窗
      handleClickDel(data) {
        this.roleId = data.id
        this.delDialog = true
      },
    }
  };
</script>
<style lang="scss">
  .crm-create-user-input .inputBox {
    min-height: 43px !important;
    input {
      font-size: 14px !important;
      min-height: 34px !important;
    }
  }
</style>
<style scoped lang="scss">
  .role-class {
    .w100 {
      width: 100%;
    }
    .margin-b20 {
      margin-bottom: 20px;
    }
    .word-wrap {
      font-size: 12px;
      color: rgb(145, 158, 171);
      word-wrap: break-word
    }
    .error-text {
      color: #c23934
    }
    .roles-manage {
      margin-top: 20px;
      .title {
        font-size: 14px;
        font-weight: 500;
        padding: 16px;
        margin: 0px;
      }
      .avatar-name {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 9999px;
        background-color: #25308a;
        line-height: 24px;
        color: #fff;
        position: relative;
        font-size: 12px;
        overflow: hidden;
        word-break: keep-all;
        text-align: center;
      }
      .roles-setting {
        flex-basis: 266px;
        box-shadow: rgba(35, 35, 112, 0.12) 0px 1px 3px 0px,
        rgba(67, 67, 145, 0.05) 0px 0px 0px 1px;
        margin-right: 16px;
        width: 200px;
        border-radius: 4px;
        background: #fff;
        height: calc(100vh - 285px);
        overflow: auto;
        .roles-list {
          cursor: pointer;
          .roles-focus-bj {
            background: #dfe3e8;
          }
          .roles-focus-bj:hover {
            .roles-point {
              display: inline-block;
            }
          }
          .roles-bj {
            img {
              position: relative;
              bottom: 1px;
              margin-right: 8px;
            }
          }
          .roles-bj:hover {
            background: #eee;
          }
          li > .associated-data > h4 {
            margin: 0 0 14px;
            font-size: 12px;
            font-weight: 400;
            color: #919eab;
          }
          li > .associated-data {
            padding: 10px 16px 10px 50px;
          }
          img {
            border-radius: 4px;
            vertical-align: middle;
          }
          .roles-point {
            display: none;
            font-size: 24px;
            color: #8996a3;
          }
        }
        .roles-list li > .flex {
          height: 46px;
          line-height: 44px;
          padding: 0px 16px;
        }
      }

      .permission-setting {
        box-shadow: rgba(35, 35, 112, 0.12) 0px 1px 3px 0px,
        rgba(67, 67, 145, 0.05) 0px 0px 0px 1px;
        -webkit-box-flex: 1;
        border-radius: 4px;
        background: rgb(255, 255, 255);
        flex: 1 1 0%;
        padding-bottom: 10px;
        height: calc(100vh - 285px);
        overflow: auto;
      }
      .permission-setting .save-btn {
        text-align: right;
        padding: 0px 16px;
      }

    }

    .select-user {
      height: 34px;
      border-radius: 2px;
      margin: 8px 8px 0 0;
      vertical-align: top;
      display: inline-block;
      overflow: hidden;
      line-height: 34px;
      color: #fff;
      padding: 0 34px 0 8px;
      position: relative;
      background-color: #48b381;
      i {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
      }
    }
  }
</style>