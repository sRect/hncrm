<template>
  <div class="container">
    <div class="top">
      <div>
        <span>下单时间：</span>
        <el-date-picker
          v-model="value13"
          :editable="false"
          value-format="yyyy-MM-dd"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleChange"
          :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="value2" placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary">导出明细</el-button>
      </div>
    </div>
    <div class="main">
      <el-table
        :data="tableData3"
        max-height="250"
        border
        style="width: 100%">
        <el-table-column
          prop="agencyName"
          label="门店名称"
          :show-overflow-tooltip="true"
          width="400">
        </el-table-column>
        <el-table-column
          prop="creatTime"
          label="下单时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          label="总金额">
        </el-table-column>
        <el-table-column
          prop="orderProcess"
          label="状态">
        </el-table-column>
        <el-table-column
          fixed="right"
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="info" size="small">销售明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="20"
        layout="prev, pager, next, jumper"
        :total="1000">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AgencyOrderList',
    data() {
      return {
        value13: [],
        options: [{
          value: '1',
          label: '龙虾类'
        }, {
          value: '2',
          label: '非虾类'
        }],
        value: '',
        options2: [{
          value: '1',
          label: '已发货'
        }, {
          value: '2',
          label: '未发货'
        }],
        value2: '',
        tableData3: [{
          creatTime: '2016-05-03',
          agencyName: '浦东店浦东店浦东店浦东店浦东店浦东店',
          orderAmount: 1000,
          orderProcess: '未处理',
          id: '12'
        },{
          creatTime: '2016-05-03',
          agencyName: '浦东店浦东店浦东店浦东店浦东店浦东店浦东店浦东店浦东店浦东店浦东店浦东店',
          orderAmount: 1000,
          orderProcess: '未处理',
          id: '12'
        }],
        currentPage: 1, // 当前页
        pageSize: 20 // 每页大小
      }
    },
    methods: {
      getData() {
        this.$http.post(this.HOST+"agencyOrder/agencyOrderList", {
          "pageNum": this.currentPage - 1,
          "pageSize": this.pageSize
        }).then(data => {
          console.log(data)
        }).catch(error => {
          console.log(error)
        })
      },
      handleChange(value) {
        console.log(value)
      },
      handleClick(row) {
        console.log(row);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style lang="less">
.main,.top {
  padding-top: 20px;
}
.pagination {
  padding-top: 20px;
  text-align: right;
}
</style>