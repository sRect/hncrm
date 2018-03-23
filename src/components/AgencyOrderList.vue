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
        max-height="400"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="agencyName"
          label="门店名称"
          :show-overflow-tooltip="true"
          sortable
          width="400">
        </el-table-column>
        <el-table-column
          prop="creatTime"
          label="下单时间"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          sortable
          label="总金额">
        </el-table-column>
        <el-table-column
          prop="orderProcess"
          label="状态"
          sortable
          :formatter="formatterOrderProcess">
        </el-table-column>
        <el-table-column
          fixed="right"
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="primary" size="small" plain>销售明细</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next, jumper"
        :total="pageCount">
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
        pageSize: 20, // 每页大小
        pageCount: 0, // 总条数
      }
    },
    watch: {
      currentPage(val, oldVal) {
        this.getData();
      }
    },
    methods: {
      formatterOrderProcess(row, column, cellValue) { // 格式化表格状态列
        switch(Number.parseInt(cellValue)) {
          case 0:
            return "未处理";
            break;
          case 1:
            return "已付款";
            break;
          case 2:
            return "处理发货中";
            break;
          case 3:
            return "已收货";
            break;
          case 4:
            return "申请退货中";
            break;
          case 5:
            return "部分货退款成功";
            break;
          case 6:
            return "全部退款";
            break;
          default:
            break;
        }
      },
      getData() { // 请求列表数据
        this.$http.post("agencyOrder/agencyOrderList", {
          "pageNum": this.currentPage - 1,
          "pageSize": this.pageSize
        }).then(data => {
          console.log(data)
          let myData = data.data;

          if(!this.$isEmpty(myData)) {
            let status = myData.status;

            switch(status) {
              case "success":
                let obj = myData.data;
                if(!this.$isEmpty(obj)) { 
                  this.pageCount = Number.parseInt(obj.pageCount);
                  this.tableData3 = obj.page;
                }else {
                  this.$message({
                    showClose: true,
                    message: '产品订单查询错误',
                    duration: 0,
                    type: "error"
                  })
                }
                break;
              case "failure":
                this.$message({
                  showClose: true,
                  message: '产品订单查询错误',
                  duration: 0,
                  type: "error"
                })
                break;
              default:
                this.$message({
                  showClose: true,
                  message: '产品订单查询错误',
                  duration: 0,
                  type: "error"
                })
                break;
            }
          }else {
            this.$message({
              showClose: true,
              message: '产品订单获取错误',
              duration: 0,
              type: "error"
            })
          }

        }).catch(error => {
          console.log(error)
        })
      },
      handleChange(value) { // 下单时间
        console.log(value)
      },
      handleClick(row) { // 查看销售明细
        let id = row.id;
        console.log(id);
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) { // 分页点击
        console.log(`当前页: ${val}`);
        this.currentPage = val;
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