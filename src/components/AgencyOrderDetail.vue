<template>
  <div>
    <el-table
        :data="tableData"
        max-height="400"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="agencyName"
          label="门店名称"
          :show-overflow-tooltip="true"
          sortable>
        </el-table-column>
        <el-table-column
          prop="creatTime"
          label="下单时间"
          sortable
          width="180">
        </el-table-column>
        <el-table-column
          prop="materialName"
          sortable
          label="产品">
        </el-table-column>
        <el-table-column
          prop="orderPrice"
          label="单价"
          sortable>
        </el-table-column>
        <el-table-column
          prop="orderCount"
          label="数量"
          sortable>
        </el-table-column>
        <el-table-column
          prop="orderAmount"
          label="总金额"
          sortable>
        </el-table-column>
        <el-table-column
          prop="isPay"
          label="是否支付"
          :formatter="formatterIsPay"
          sortable>
        </el-table-column>
        <el-table-column
          prop="isLogistics"
          label="配送状态"
          :formatter="formatterIsLogistics"
          sortable>
        </el-table-column>
        <el-table-column
          prop="orderStatus"
          label="订单状态"
          :formatter="formatterOrderStatus"
          sortable>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
  export default {
    name: 'AgencyOrderDetail',
    data() {
      return {
        detailID: '',
        tableData: []
      }
    },
    methods: {
      formatterIsPay(row, column, cellValue) {
        let status = Number.parseInt(cellValue) === 1 ? "是" : "否";
        return status;
      },
      formatterIsLogistics(row, column, cellValue) {
        let num = Number.parseInt(cellValue);

        switch(num) {
          case 0:
            return "配货";
            break;
          case 1:
            return "运输中";
            break;
          case 2:
            return "运输完毕";
            break;
          case 3:
            return "退货";
            break;
          default:
            return '--';
            break;
        }
      },
      formatterOrderStatus(row, column, cellValue) {
        let num = Number.parseInt(cellValue);

        switch(num) {
          case 0:
            return "配货";
            break;
          case 1:
            return "运输中";
            break;
          case 2:
            return "运输完毕";
            break;
          case 4:
            return "退货中";
            break;
          case 5:
            return "退货完毕";
            break;
          default:
            return '--';
            break;
        }
      },  
      getData() {
        this.$http.post("agencyOrder/agencyOrderInfo", {
          "id": this.detailID
        }).then(data => {
          console.log(data)
          let myData = data.data;

          if(!this.$isEmpty(myData)) {
            let status = myData.status;

            switch(status) {
              case "success":
                let obj = myData.data;
                if(!this.$isEmpty(obj)) { 
                  this.tableData = obj;
                }else {
                  this.$message({
                    showClose: true,
                    message: '订单详情查询错误',
                    duration: 0,
                    type: "error"
                  })
                }
                break;
              case "failure":
                this.$message({
                  showClose: true,
                  message: myData.info,
                  duration: 0,
                  type: "error"
                })
                break;
              default:
                this.$message({
                  showClose: true,
                  message: '订单详情查询错误',
                  duration: 0,
                  type: "error"
                })
                break;
            }
          }else {
            this.$message({
              showClose: true,
              message: '订单详情获取错误',
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
      }
    },
    mounted() {
      this.detailID = this.$route.query.id;

      if(this.detailID) {
        this.getData();
      }else {
        this.$messagebox.alert('订单详情ID丢失或错误,点击确定返回上一页', '警告', {
          closeOnClickModal: false,
          type: "error",
          confirmButtonText: '确定',
          callback: action => {
            // this.$router.go(-1);
            this.$router.push({
              name: 'AgencyOrderList'
            })
          }
        });
      }
    }
  }
</script>