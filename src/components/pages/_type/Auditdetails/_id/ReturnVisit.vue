<template>
  <div>
    <PaTitleZ v-if="SiteInforList.length > 0">
      站点信息
    </PaTitleZ>
    <div class="data-row" v-if="SiteInforList.length > 0">
      <div class="data-col column all-col">
        <PaTable>
          <tr>
            <th>店铺名称</th>
            <th>待支付账单金额</th>
            <th>店铺套餐</th>
            <th>到期时间</th>
            <th>套餐状态</th>
            <th>店铺主域名</th>
            <th>站点进度</th>
            <th>操作</th>
          </tr>
          <tr v-for="(item, index) in SiteInforList" :key="index">
            <td>{{ item.store_name }}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{{ item.store_domain }}</td>
            <td></td>
            <td>
              <el-button
                @click="returnVisit(item)"
                size="mini"
                type="warning"
                icon="el-icon-phone-outline"
                >回访</el-button
              >
              <el-button
                @click="returnVisitRecord(item)"
                size="mini"
                type="primary"
                icon="el-icon-document"
                >回访记录</el-button
              >
            </td>
          </tr>
        </PaTable>
      </div>
    </div>
    <div class="MLeft" v-if="SiteInforPage.total > SiteInforPage.pageSize">
      <el-pagination
        background
        @current-change="ChangeSiteInforPage"
        :current-page.sync="SiteInforPage.count"
        :page-size="SiteInforPage.pageSize"
        layout="total, prev, pager, next"
        :total="SiteInforPage.total"
      >
      </el-pagination>
    </div>
    <PaTitleZ v-if="ReturnVisitList.length > 0">
      回访记录
    </PaTitleZ>
    <div class="return-visit" v-show="ReturnVisitList.length > 0">
      <div class="return-visit-box">
        <div
          class="return-visit-box-main"
          v-infinite-scroll="getReturnVisit"
          infinite-scroll-throttle-delay="500"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
        >
          <el-timeline class="return-visit-box-body">
            <el-timeline-item
              v-for="(item, index) in ReturnVisitList"
              :key="index"
              :timestamp="forTime(item.time)"
              placement="top"
            >
              <div>
                <p class="return-visit-lable" v-if="item.web">
                  站点：{{ item.web }}
                </p>
                <p class="return-visit-lable" v-if="item.seller_name">
                  商户：{{ item.seller_name }}
                </p>
                <p class="return-visit-lable">备注：{{ item.record }}</p>
                <p class="return-visit-lable">商务：{{ item.user }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
          <div class="loading">
            <div class="loadingIcon" v-if="!noData"></div>
            <div class="loadingText" v-else>已经到底了</div>
          </div>
        </div>
      </div>
    </div>
    <!--弹窗-->
    <el-dialog
      width="957px"
      :close-on-click-modal="false"
      :title="storeName + '进度及回访'"
      :visible.sync="stationDialog"
    >
      <station v-if="stationDialog" :storeName="storeName"></station>
    </el-dialog>
    <el-dialog
      width="957px"
      :close-on-click-modal="false"
      title="回访记录"
      :visible.sync="recordDialog"
    >
      <record
        v-if="recordDialog"
        :storeName="storeName"
        @closeRecordDialog="closeRecordDialog()"
      ></record>
    </el-dialog>
  </div>
</template>

<script>
import { handleResponseErrors, showMsg } from "@/assets/js/utils";
import { getBusiness, returnVisit } from "@/assets/js/api";
import record from "../../../../../pages/returnVisit/record/index";
import station from "../../../../../pages/returnVisit/station/index";
import mixins from "@/mixins";
export default {
  mixins: [mixins],
  props: {
    sellerId: {
      type: String,
      default: ""
    }
  },
  components: {
    record,
    station
  },
  data() {
    return {
      stationDialog: false,
      recordDialog: false,
      storeName: "",
      isShow: false,
      noData: false,
      ReturnVisitList: [],
      ReturnVisitPage: {
        total: 10, //总数
        pageSize: 5, //页长
        count: 1
      },
      SiteInforList: [],
      SiteInforPage: {
        total: 0, //总数
        pageSize: 6, //页长
        count: 1
      },
      busy: false
    };
  },
  mounted() {
    this.getSiteInformation();
    this.getReturnVisit();
  },
  methods: {
    async getSiteInformation() {
      try {
        const data = {
          page: this.SiteInforPage.count,
          limit: this.SiteInforPage.pageSize
        };
        const res = await getBusiness.getSiteInformation(this.sellerId, data);
        if (res.code != 0) {
          handleResponseErrors(res.code, res.msg);
          return;
        }
        this.SiteInforList = res.store_list;
        this.SiteInforPage.total = res.total;
      } catch (error) {
        console.log(error);
      }
    },
    ChangeReturnVisitPage(val) {
      this.ReturnVisitPage.count = val;
    },
    ChangeSiteInforPage(val) {
      this.SiteInforPage.count = val;
      this.getSiteInformation();
    },
    getReturnVisit: function() {
      // try {
      this.busy = true;
      let data = {
        seller_id: this.sellerId,
        format: "full",
        limit: this.ReturnVisitPage.pageSize,
        page: this.ReturnVisitPage.count
      };
      // const res = await returnVisit.getFollowRemark(data);
      returnVisit
        .getFollowRemark(data)
        .then(res => {
          if (res.code != 0) {
            handleResponseErrors(res.code, res.msg);
            return;
          }
          this.ReturnVisitPage.count++;
          for (const item of res.remark_list) {
            this.ReturnVisitList.push({
              time: item.create_time,
              user: item.username,
              web: item.store_name,
              record: item.remark,
              seller_name: item.seller_name
            });
          }
          if (
            res.remark_list.length ===
            Number.parseInt(this.ReturnVisitPage.pageSize)
          ) {
            this.busy = false;
          } else {
            this.noData = true;
          }
        })
        .catch(err => {
          this.busy = false;
          console.log(err);
        });

      // } catch (error) {
      //   console.log(error);
      // }
    },

    returnVisit(val) {
      this.storeName = val.store_name;
      this.stationDialog = true;
    },
    returnVisitRecord(val) {
      this.storeName = val.store_name;
      this.recordDialog = true;
    },
    closeRecordDialog() {
      this.recordDialog = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/toExamineDetails.scss";
.loading {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  .loadingIcon {
    width: 20px;
    height: 20px;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABW0lEQVQ4T6WTQS8DURSFz5n6Cw1L0lcSG3/BhpUVQSwaOxFmphZExMaKSFedqVpjg7CzwlLsJQ1J+yYs8RtMr8zQdjp0WvE2L3n3vu/dd869RMISS40GYbr6sVMa4wGxMiZdrxSci6l2QkBJh7tYmQ26XiF65xeAqoK4pKO3ogCx1R4EM3T1cDIgn51AXa5hpMbg+9OgcQeD76j7DzA4yWLt5gcgKBvgMihLdLx7sdUJyDMWa1dh6fnsFETm6eicmGocxCEgB8FXm18QO7MOYQGUBTre6W+iiaWOAeQAbNPVu6E+0UTJD/Wz+PzWSXEx1SzqrLBce2rkMLRKMBceEOdJlkWdaeb/G5DUSL3EWiJaWRuUETp6tZeLTQ2+O+zLRhhrdKu3fwa0OWGpNIB0NzHbKogBKhBcNPo/FtuE/3HE8strAqA1MG2zsDI4gFTfIl29nzgLsRe7jvMnN2+VhSj2tGYAAAAASUVORK5CYII=);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 20px 20px;
    -webkit-animation: myRotate 2s linear infinite;
    animation: myRotate 2s linear infinite;
  }
  .loadingText{
    color: #8d8d8d;
    font-size: 16px;
  }
}
@keyframes myRotate {
  0% {
    transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
  }
}
</style>
