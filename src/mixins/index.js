export default {
  data() {
    return {
      PickerOptions: {
        shortcuts: [
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      MerchantTypeOptions: [
        {
          value: 1,
          label: "个人"
        },
        {
          value: 2,
          label: "企业"
        }
      ],
      AuditStatusOptions: [
        {
          value: -1,
          label: "待审核"
        },
        {
          value: 0,
          label: "审核通过"
        },
        {
          value: 1,
          label: "审核未通过"
        }
      ],
      FindingsOfAuditOptions: [
        {
          value: 0,
          label: "通过"
        },
        {
          value: 1,
          label: "驳回"
        }
      ],
      AccountTypeOptions: [
        {
          value: 1,
          label: "预付"
        },
        {
          value: 2,
          label: "后付"
        }
      ],
      AccountPeriodOptions: [
        {
          value: 7
        },
        {
          value: 10
        },
        {
          value: 15
        },
        {
          value: 20
        },
        {
          value: 30
        },
        {
          value: 45
        },
        {
          value: 60
        }
      ],
      //权限数据
      permisionList: [
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 0,
          secondName: "商务审核",
          thirdId: 102,
          thirdName: "查看",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 0,
          secondName: "商务审核",
          thirdId: 100,
          thirdName: "商户审核",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 0,
          secondName: "商务审核",
          thirdId: 101,
          thirdName: "材料更新",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 1,
          secondName: "运营审核",
          thirdId: 110,
          thirdName: "查看",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 1,
          secondName: "运营审核",
          thirdId: 111,
          thirdName: "商户审核",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 2,
          secondName: "财务审核",
          thirdId: 120,
          thirdName: "查看",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 2,
          secondName: "财务审核",
          thirdId: 121,
          thirdName: "商户审核",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 3,
          secondName: "商户列表",
          thirdId: 141,
          thirdName: "分配商务",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 3,
          secondName: "商户列表",
          thirdId: 142,
          thirdName: "查看",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 3,
          secondName: "商户列表",
          thirdId: 143,
          thirdName: "上传协议",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 3,
          secondName: "商户列表",
          thirdId: 144,
          thirdName: "材料更新",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 3,
          secondName: "商户列表",
          thirdId: 145,
          thirdName: "回访",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 1,
          firstName: "商户管理",
          secondId: 3,
          secondName: "商户列表",
          thirdId: 146,
          thirdName: "补充协议",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 2,
          firstName: "组织机构",
          secondId: 1,
          secondName: "角色管理",
          thirdId: 411,
          thirdName: "创建角色",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 2,
          firstName: "组织机构",
          secondId: 1,
          secondName: "角色管理",
          thirdId: 412,
          thirdName: "编辑",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 2,
          firstName: "组织机构",
          secondId: 2,
          secondName: "用户管理",
          thirdId: 421,
          thirdName: "创建用户",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 2,
          firstName: "组织机构",
          secondId: 2,
          secondName: "用户管理",
          thirdId: 423,
          thirdName: "编辑",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 2,
          firstName: "组织机构",
          secondId: 2,
          secondName: "用户管理",
          thirdId: 424,
          thirdName: "移除",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 3,
          firstName: "代理商管理",
          secondId: 1,
          secondName: "代理商列表",
          thirdId: 311,
          thirdName: "查看",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 3,
          firstName: "代理商管理",
          secondId: 1,
          secondName: "代理商列表",
          thirdId: 312,
          thirdName: "分配商务",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 3,
          firstName: "代理商管理",
          secondId: 2,
          secondName: "",
          thirdId: 321,
          thirdName: "渠道列表",
          indeterminate1: false,
          indeterminate2: false
        },
        {
          firstId: 3,
          firstName: "代理商管理",
          secondId: 3,
          secondName: "",
          thirdId: 331,
          thirdName: "个人信息",
          indeterminate1: false,
          indeterminate2: false
        },
      ]
    };
  },
  filters: {
    time(value) {
      let minutes = parseInt(value / 60);
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      let seconds = value - 60 * minutes;
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return minutes + ":" + seconds;
    },
    MerchantOption(key) {
      let content = "";
      switch (key) {
        case 1:
          content = "个人";
          break;
        case 2:
          content = "企业";
          break;
        default:
          content = "";
          break;
      }
      return content;
    },
    AccountTypeOption(key) {
      let content = "";
      switch (key) {
        case 1:
          content = "预付";
          break;
        case 2:
          content = "后付";
          break;
        default:
          content = "";
          break;
      }
      return content;
    },
    AuditStatusOption(key) {
      let content = "";
      switch (key) {
        case null:
          content = "待审核";
          break;
        case 0:
          content = "审核通过";
          break;
        case 1:
          content = "审核未通过";
          break;
        default:
          content = "";
          break;
      }
      return content;
    },
    DailyTurnoverOption(key) {
      let content = "";
      switch (key) {
        case 1:
          content = "1w美金及以下";
          break;
        case 2:
          content = "10w美金及以下";
          break;
        case 3:
          content = "20w美金及以下";
          break;
        case 4:
          content = "30w美金及以下";
          break;
        case 5:
          content = "40w美金及以下";
          break;
        case 6:
          content = "40w美金及以上";
          break;
        default:
          content = "";
          break;
      }
      return content;
    },
    formatTime(timestamp) {
      try {
        if (isNaN(timestamp)) return "";
        let date = new Date(Number.parseInt(timestamp) * 1000);
        let Y = date.getFullYear();
        let M =
            date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1;
        let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let m =
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let s =
            date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return `${Y}-${M}-${D}  ${h}:${m}:${s}`;
      } catch (error) {
        return "";
      }
    }
  },
  methods: {
    forTime(timestamp) {
      try {
        if (isNaN(timestamp)) return "";
        let date = new Date(Number.parseInt(timestamp) * 1000);
        let Y = date.getFullYear();
        let M =
            date.getMonth() + 1 < 10
                ? "0" + (date.getMonth() + 1)
                : date.getMonth() + 1;
        let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        let m =
            date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        let s =
            date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return `${Y}-${M}-${D}  ${h}:${m}:${s}`;
      } catch (error) {
        return "";
      }
    },
    /**
     * 局部权限控制器
     * @param key //权限
     * @returns {boolean} //是否拥有码值权限
     * @constructor
     */
    jurisdiction(key) {
      for (const data of this.usersPermission) {
        switch (key) {
          case 'Merchants-DistributionBusiness'://商户列表-分配商务
            if (data == 141) return true;
            break;
          case 'Merchants-details'://商户列表-查看
            if (data == 142) return true;
            break;
          case 'Merchants-UploadPhotoCol'://商户列表-上传协议
            if (data == 143) return true;
            break;
          case 'Merchants-UpdateMaterials'://商户列表-材料更新
            if (data == 144) return true;
            break;
          case 'Merchants-ReturnVisit'://商户列表-回访
            if (data == 145) return true;
            break;
          case 'Merchants-SupplementToTheAgreement'://商户列表-协议补充
            // if (data == 145) return true;
            if (data == 146) return true;
            break;
          default:
            return false;
        }
      }
    }
  }
};
