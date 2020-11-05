<template>
  <table border="0" cellspacing="0" cellpadding="0" class="mytable">
    <slot />
  </table>
</template>

<script>
export default {
  name: "PaTable"
};
</script>
<style lang="scss">
.mytable {
  width: 100%;
  border-left: 1px solid #e9e9e9;
  border-top: 1px solid #e9e9e9;
  border-radius: 4px 4px 0 0;
  font-size: 12px;
  line-height: 40px;
  box-sizing: border-box;
  tr {
    // background-color: #f7f7f7;
    &:nth-child(2n) {
      background-color: #fff;
    }
    th {
      white-space:nowrap;
      border-right: 1px solid #e9e9e9;
      border-bottom: 1px solid #e9e9e9;
      min-height: 40px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.75);
      background: #f7f7f7;
      text-align: left;
      padding: 0 10px;
      i {
        display: inline-block;
        margin-left: auto;
      }
    }
    td {
      border-right: 1px solid #e9e9e9;
      border-bottom: 1px solid #e9e9e9;
      padding-left: 10px;
      min-height: 40px;
      color: rgba(0, 0, 0, 0.65);
      .el-button+.el-button{
        margin-left: 0;
      }
      button{
        width: 95px;
        margin-right: 10px;
      }
    }
  }
}
.isflex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.centext {
  text-align: center !important;
  th {
    padding-left: 0 !important;
  }
  td {
    padding-left: 0 !important;
  }
}
.blue {
  /* background-color: #2196f3!important; */
}
.green {
  /* background-color: #4caf50!important; */
}
.oringe {
  /* background-color: #ff9800!important; */
}
</style>
