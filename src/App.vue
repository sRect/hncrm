<template>
  <div id="app">
    <el-tabs v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="首页" name="first" data-index="0"></el-tab-pane>
    <el-tab-pane label="产品列表" name="second" data-index="1"></el-tab-pane>
    <el-tab-pane label="产品订单" name="third" data-index="2"></el-tab-pane>
    <el-tab-pane label="门店列表" name="fourth" data-index="3"></el-tab-pane>
    <el-tab-pane label="销售订单" name="five" data-index="4"></el-tab-pane>
    <el-tab-pane label="人员列表" name="six" data-index="5"></el-tab-pane>
  </el-tabs>

    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      let index = tab.$el.dataset.index;
      console.log(index);
      switch(index) {
        case "0":
          this.$router.push({
            name: 'Home'
          })
          break;
        case "1":
          this.$router.push({
            name: 'ProductList'
          })
          break;
        case "2":
          this.$router.push({
            name: 'AgencyOrderList'
          })
          break;
        case "3":
          this.$router.push({
            name: 'StoreList'
          })
          break;
        case "4":
          this.$router.push({
            name: 'SalesList'
          })
          break;
        case "5":
          this.$router.push({
            name: 'StaffList'
          })
          break;
        default: 
          break;
      }
    }
  }
}
</script>

<style lang="less">
@import './assets/less/reset.css';

#app {
  width: 1200px;
  margin: 10px auto 0;
  padding: 10px 20px 40px 20px;
  background-color: #fff;
}
</style>
