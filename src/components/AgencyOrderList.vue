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
        <span>商品类型：</span>
        <el-select v-model="value" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span>订单状态：</span>
        <el-select v-model="value2" clearable placeholder="请选择">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div class="fr">
          <el-button type="primary" @click="exportAgencyOrder">导出明细</el-button>
        </div>
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
import debounce from 'lodash/debounce'

  export default {
    name: 'AgencyOrderList',
    data() {
      return {
        value13: [], // 下单时间arr
        options: [{
          value: '1',
          label: '龙虾类'
        }, {
          value: '2',
          label: '配料'
        }, {
          value: '3',
          label: '卤品'
        }],
        options2: [{
          value: '0',
          label: '配货'
        }, {
          value: '1',
          label: '运输中'
        }, {
          value: '2',
          label: '运输完毕'
        }, {
          value: '4',
          label: '退货中'
        }, {
          value: '5',
          label: '退货完毕'
        }],
        value: '', // 商品类型
        value2: '', // 订单状态
        tableData3: [], // 列表数据
        currentPage: 1, // 当前页
        pageSize: 20, // 每页大小
        pageCount: 0 // 总条数
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
          this.$message({
            showClose: true,
            message: error.message,
            duration: 0,
            type: "error"
          })
        })
      },
      handleChange(arr) { // 下单时间change
        // this.startTime = arr[0];
        // this.endTime = arr[1];
      },
      handleClick: debounce(function(row) { // 查看销售明细
        let id = row.id;
        this.$router.push({
          name: 'AgencyOrderDetail',
          query: {id: id}
        })
      }, 200, {
      "maxWait": 500
      }),
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) { // 分页点击
        console.log(`当前页: ${val}`);
        this.currentPage = val;
      },
      exportAgencyOrder: debounce(function() { // 导出明细
        const self = this;
        let orderStatus = self.value2, 
          materialType = self.value,
          startTime = "",
          endTime = "";

        if(self.value13) {
          if(self.value13.length) {
              startTime = self.value13[0], 
              endTime = self.value13[1];
          }else {
            self.$messagebox.alert('请选择下单时间', '提示', {
              closeOnClickModal: false,
              type: "warning",
              confirmButtonText: '确定',
              callback: action => {
              }
            });
            return;
          }
        }else {
          self.$messagebox.alert('请选择下单时间', '提示', {
            closeOnClickModal: false,
            type: "warning",
            confirmButtonText: '确定',
            callback: action => {
            }
          });
          return;
        }

        if(!materialType) {
          self.$messagebox.alert('请选择商品类型', '提示', {
            closeOnClickModal: false,
            type: "warning",
            confirmButtonText: '确定',
            callback: action => {
            }
          });
          return;
        }

        if(!orderStatus) {
          self.$messagebox.alert('请选择订单状态', '提示', {
            closeOnClickModal: false,
            type: "warning",
            confirmButtonText: '确定',
            callback: action => {
            }
          });
          return;
        }
console.log(orderStatus)
console.log(materialType)
console.log(startTime)
console.log(endTime)
        if(orderStatus && materialType && startTime && endTime) {
          let form = document.createElement("form");
          let input = document.createElement("input");
          // $(input).attr('type', 'hidden');
          form.style.display = "none";
          form.setAttribute("method", "post");
          // 本地
          form.setAttribute("action", "https://www.jzwms.com/hncrm/agencyOrder/exportAgencyOrder?orderStatus="+ orderStatus + "&materialType=" + materialType + "&startTime=" + startTime + "&endTime=" + endTime );

          document.body.appendChild(form);
          form.appendChild(input);
          form.submit();
          form.parentNode.removeChild(form);
        }else {
          self.$messagebox.alert('请选择导出条件', '提示', {
            closeOnClickModal: false,
            type: "warning",
            confirmButtonText: '确定',
            callback: action => {
            }
          });
          return;
        }

      }, 500, {
      "maxWait": 1000
      }),
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
.main,.top {
  padding-top: 20px;
}
.pagination {
  padding-top: 20px;
  text-align: right;
}
.fr {
  float: right;
}
</style>