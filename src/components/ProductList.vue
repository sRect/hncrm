<template>
  <div>
  <div class="top clearfix">
      <div>
        <el-button  type="primary" @click="handleAddPro">添加产品</el-button>
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
          prop="materialName"
          label="产品名称"
          :show-overflow-tooltip="true"
          sortable>
        </el-table-column>
        <el-table-column
          prop="materialType"
          label="产品类别"
          :formatter="formatter_materialType"
          :show-overflow-tooltip="true"
          sortable>
        </el-table-column>
        <el-table-column
          prop="materialPrice"
          sortable
          label="产品价格">
        </el-table-column>
        <el-table-column
          prop="flag"
          label="在售状态"
          :formatter="formatter_flag"
          sortable>
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
  data () {
    return {
      tableData3: [],
      pageSize: 20, // 每页大小
      currentPage: 1, // 当前页
      pageCount: 0, // 总条数
    }
  },
  methods: {
    getData() {
      this.$http.post("/material/materialList", {
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
                    message: '产品列表查询错误',
                    duration: 0,
                    type: "error"
                  })
                }
                break;
              case "failure":
                this.$message({
                  showClose: true,
                  message: '产品列表查询错误',
                  duration: 0,
                  type: "error"
                })
                break;
              default:
                this.$message({
                  showClose: true,
                  message: '产品列表查询错误',
                  duration: 0,
                  type: "error"
                })
                break;
            }
          }else {
            this.$message({
              showClose: true,
              message: '产品列表获取错误',
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
    formatter_materialType(row, column, cellValue, index) {
      let newVal = parseInt(cellValue);
      switch(newVal) {
        case 1:
          return "虾类";
          break;
        case 2:
          return "料类";
          break;
        case 3:
          return "卤品类";
          break;
        case 4:
          return "打包盒类";
          break;
        default:
          return "--";
          break;
      }
    },
    formatter_flag(row, column, cellValue, index) {
      let newVal = parseInt(cellValue);
      switch(newVal) {
        case 0:
          return "关闭";
          break;
        case 1:
          return "开售";
          break;
        default:
          break;
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) { // 分页点击
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    handleAddPro: debounce(function() {
      console.log("hello")
    }, 200, {
      "maxWait": 500
    })
  },
  mounted() {
    this.getData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main,.top {
  padding-top: 20px;
}
.pagination {
  padding-top: 20px;
  text-align: right;
}
</style>