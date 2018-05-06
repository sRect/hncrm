<template>
  <div>
    <div class="top clearfix">
      <div>
        <el-button  type="primary" @click="handleAddAgency">添加</el-button>
      </div>
    </div>

    <div class="main">
      <el-table
        :data="tableData1"
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
          prop="address"
          label="门店地址"
          :show-overflow-tooltip="true"
          sortable
          width="280">
        </el-table-column>
        <el-table-column
          prop="linkName"
          sortable
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="agencyTel"
          label="联系电话"
          sortable>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button 
              type="primary" 
              size="small"
              plain
              @click="handleEditAgency(scope.row)">
              修改
            </el-button>
            <el-button 
              type="primary" 
              size="small"
              plain
              @click="handleDeleteAgendy(scope.row)">
              删除
            </el-button>
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
  name: 'StoreList',
  data () {
    return {
      pageSize: 20, // 每页大小
      currentPage: 1, // 当前页
      pageCount: 0, // 总条数
      tableData1: []
    }
  },
  watch: {
    currentPage(val, oldVal) {
      this.getData();
    }
  },
  methods: {
    getData() {
      this.$http.post("/agency/agencyList", {
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
                  this.tableData1 = obj.page;
                }else {
                  this.$message({
                    showClose: true,
                    message: '门店列表查询错误',
                    duration: 0,
                    type: "error"
                  })
                }
                break;
              case "failure":
                this.$message({
                  showClose: true,
                  message: '门店列表查询错误',
                  duration: 0,
                  type: "error"
                })
                break;
              default:
                this.$message({
                  showClose: true,
                  message: '门店列表查询错误',
                  duration: 0,
                  type: "error"
                })
                break;
            }
          }else {
            this.$message({
              showClose: true,
              message: '门店列表获取错误',
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
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) { // 分页点击
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    handleAddAgency(val) {
      console.log(val)
    },
    handleEditAgency(val) {
      console.log(val)
    },
    handleDeleteAgendy(val) {
      console.log(val)
    }
  },
  mounted() {
    this.getData();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.main,.top {
  padding-top: 20px;
}
</style>