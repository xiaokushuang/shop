<template>
  <div class="station-class">
    <!--步骤选择-->
    <div class="step-class">
      <div class="step-item-class" v-for="(data) in storeName?stepList:stepList2" :key="data.id">
        <div>{{data.name}}</div>
        <el-checkbox size="medium" v-model="data.checked"></el-checkbox>
      </div>
    </div>
    <!--回访记录-->
    <div class="record-class">
      <div class="record-title-class">回访记录</div>
      <div class="record-content-class">
        <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">-->
        <div class="record-item-class" v-for="(data,index) in remark_list" :key="index">
          <span>{{data.create_time | formatTime}}&nbsp;&nbsp;&nbsp;</span>
          <span>{{data.username}}:&nbsp;&nbsp;&nbsp;</span>
          <span>{{data.remark}}；</span>
        </div>
        <!--</div>-->
      </div>
    </div>
    <!--站点内容输入框-->
    <div class="text-area-content">
      <el-input
              type="textarea"
              :rows="7"
              placeholder="请输入回访内容"
              v-model="textarea">
      </el-input>
    </div>
    <!--提交按钮-->
    <div class="flex-box">
      <el-button :loading="submitFlag" @click="handleSubmit()" type="primary">提交</el-button>
    </div>
  </div>
</template>

<script>
  import {returnVisit} from "@/assets/js/api";
  import mixins from "@/mixins";
  import {handleResponseErrors} from "@/assets/js/utils";

  export default {
    mixins: [mixins],
    name: "station",
    props: [
      "storeName",
      "sellerId"
    ],
    data() {
      return {
        submitFlag: false,
        page: 1,
        limit: 0,
        textarea: '',
        remark_list: [],
        remark_all_list: [],
        busy: false,
        stepArr: [],
        step_numbers: [],
        stepList: [
          {
            id: 1,
            checked: false,
            name: '第一步：产品导入',
          },
          {
            id: 2,
            checked: false,
            name: '第二步：网站主题维护',
          },
          {
            id: 3,
            checked: false,
            name: '第三步：付款账户设置',
          },
          {
            id: 4,
            checked: false,
            name: '第四步：运输方式设置',
          },
          {
            id: 5,
            checked: false,
            name: '第五步：广告投放',
          },
        ],
        stepList2: [
          {
            id: 1,
            checked: false,
            name: '第一步：建站',
          },
        ],
      }
    },
    created() {
      this.getFollowProcess()
      this.getFollowRemark()
    },
    methods: {
      //回访进度列表
      getFollowProcess() {
        let data = {}
        if (this.storeName) {
          data.store_name = this.storeName
        }
        if (this.sellerId) {
          data.seller_id = this.sellerId
        }
        returnVisit.getFollowProcess(data).then((res) => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.step_numbers = res.step_numbers
            if (this.storeName) {
              for (let i = 0; i < this.stepList.length; i++) {
                for (let j = 0; j < this.step_numbers.length; j++) {
                  if (this.step_numbers.indexOf(this.stepList[i].id) !== -1) {
                    this.stepList[i].checked = true
                  } else {
                    this.stepList[i].checked = false
                  }
                }
              }
            }
            if (this.sellerId) {
              for (let i = 0; i < this.stepList2.length; i++) {
                for (let j = 0; j < this.step_numbers.length; j++) {
                  if (this.step_numbers.indexOf(this.stepList2[i].id) !== -1) {
                    this.stepList2[i].checked = true
                  } else {
                    this.stepList2[i].checked = false
                  }
                }
              }
            }
          }
        })
      },
      //回访记录列表
      getFollowRemark() {
        let data = {}
        if (this.storeName) {
          data.store_name = this.storeName
        }
        if (this.sellerId) {
          data.seller_id = this.sellerId
        }
        data.limit = this.limit
        data.page = this.page
        returnVisit.getFollowRemark(data).then((res) => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.remark_list = res.remark_list
          }
        })
      },
      //更新回访进度列表
      updateFollowProcess() {
        this.submitFlag = true
        if (this.storeName) {
          for (let i = 0; i < this.stepList.length; i++) {
            this.stepArr.push(this.stepList[i].checked)
          }
        }
        if (this.sellerId) {
          for (let i = 0; i < this.stepList2.length; i++) {
            this.stepArr.push(this.stepList2[i].checked)
          }
        }
        let data = {}
        if (this.storeName) {
          data.store_name = this.storeName
        }
        if (this.sellerId) {
          data.seller_id = this.sellerId
        }
        data.step_numbers = this.stepArr
        returnVisit.updateFollowProcess(data).then((res) => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.submitFlag = false
          }
        })
      },
      //更新回访记录列表
      updateFollowRemark() {
        let data = {}
        if (this.storeName) {
          data.store_name = this.storeName
        }
        if (this.sellerId) {
          data.seller_id = this.sellerId
        }
        data.remark = this.textarea
        returnVisit.updateFollowRemark(data).then((res) => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          else {
            this.textarea = ''
            this.getFollowRemark()
          }
        })
      },
      handleSubmit() {
        this.stepArr = []
        if (this.textarea) {
          this.updateFollowRemark()
        }
        this.updateFollowProcess()
      },
      loadMore() {
        this.busy = true
        this.page += 1
        this.getFollowRemark()
      }
    },
  }
</script>

<style lang="scss">
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .station-class {
    .el-textarea__inner {
      resize: none !important;
    }
    .el-checkbox__inner {
      border-radius: 50%;
      width: 25px;
      height: 25px;
    }
    .el-checkbox__inner::after {
      width: 6px;
      height: 13px;
      left: 8px;
      top: 2px;
    }
    .step-class {
      .step-item-class {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
    }
    .record-class {
      border-bottom: 1px solid #DCDFE6;
      margin-bottom: 20px;
      .record-title-class {
        font-weight: bold;
        border-bottom: 1px solid #DCDFE6;
        padding-bottom: 15px;
      }
      .record-content-class {
        max-height: 120px;
        overflow-y: auto;
        padding-top: 15px;
        .record-item-class {
          margin-bottom: 20px;
        }
      }
    }
    .text-area-content {
      margin-bottom: 20px;
      height: 159px;
    }
  }
</style>