<template>
  <div>
    <div class="top clearfix">
      <div>
        <el-button  type="primary" @click="dialogFormVisible2 = true">添加</el-button>
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
              @click="handleDialog(scope)">
              修改
            </el-button>
            <el-button 
              type="primary" 
              size="small"
              plain
              @click="handleDeleteAgendy(scope)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="门店地址" :label-width="formLabelWidth">
            <el-input v-model="form.address" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系人" :label-width="formLabelWidth">
            <el-input v-model="form.linkName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" :label-width="formLabelWidth">
            <el-input v-model="form.agencyTel" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmEdit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="增加信息" :visible.sync="dialogFormVisible2">
        <el-form :model="form2" :rules="rules" ref="form2">
          <el-form-item label="门店名称" prop="agencyName" :label-width="formLabelWidth">
            <el-input v-model="form2.agencyName" placeholder="请输入门店名称" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="门店地址" prop="address" :label-width="formLabelWidth">
            <el-input v-model="form2.address" placeholder="请输入门店地址" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="门店电话" prop="telephone" :label-width="formLabelWidth">
            <el-input v-model.number="form2.telephone" placeholder="请输入门店电话" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="城市ID" :label-width="formLabelWidth">
            <el-input v-model="form2.cityID" disabled auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="区县ID" :label-width="formLabelWidth">
            <el-input v-model="form2.boroughID" disabled auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="板块ID" :label-width="formLabelWidth">
            <el-input v-model="form2.plateID" disabled auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="门店联系人" prop="linkName" :label-width="formLabelWidth">
            <el-input v-model="form2.linkName" placeholder="请输入门店门店联系人" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="handleAddAgency('form2')">确 定</el-button>
        </div>
      </el-dialog>
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
  name: 'StoreList',
  data () {
    return {
      pageSize: 20, // 每页大小
      currentPage: 1, // 当前页
      pageCount: 0, // 总条数
      tableData1: [], // 表格数据
      dialogFormVisible: false, // 修改dialog
      dialogFormVisible2: false, // 增加dialog
      formLabelWidth: '100px',
      form: {
        "agencyID": "",
        "agencyName": "",
        "address": "",
        "telephone": "",
        "cityID": "",
        "boroughID": "",
        "plateID": "",
        "linkName": "",
        "index": ""
      },
      form2: {
        "agencyName": "",
        "address": "",
        "telephone": "",
        "cityID": "",
        "boroughID": "",
        "plateID": "",
        "linkName": ""
      },
      rules: {
        agencyName: [
          { required: true, message: '请输入门店名称', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入门店地址', trigger: 'blur' },
        ],
        telephone: [
          { required: true, message: '请输入门店电话', trigger: ['blur', 'change'] },
          { type: 'number', message: '门店电话必须为数字值'}
        ],
        linkName: [
          { required: true, message: '请输入门店门店联系人', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    currentPage(val, oldVal) {
      this.getData();
    }
  },
  methods: {
    getData() { //获取table数据
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
    handleAddAgency: debounce(function(formName) { // 添加信息
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        console.log(valid)
        if (valid) {
          this.$http.post("agency/creat", {
            "agencyName": this.form2.agencyName,
            "address": this.form2.address,
            "telephone": this.form2.telephone,
            "cityID": this.form2.cityID,
            "boroughID": this.form2.boroughID,
            "plateID": this.form2.plateID,
            "linkName": this.form2.linkName
          }).then(data => {
            let myData = data.data;
            if(!this.$isEmpty(myData)) {
              let status = myData.status;

              switch(status) {
                  case "success":
                    this.$message({
                      showClose: true,
                      message: '添加信息成功',
                      duration: 1500,
                      type: "success"
                    })

                    this.dialogFormVisible2 = false;

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
                      message: '添加信息失败',
                      duration: 0,
                      type: "error"
                    })
                    break;
                }
            }else {
              this.$message({
                showClose: true,
                message: '返回信息错误',
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
        } else {
          this.$message({
            showClose: true,
            message: "输入有误，请检查您的输入信息！",
            duration: 3000,
            type: "warning"
          })
          return false;
        }
      });

    }, 200, {
      "maxWait": 500
    }),
    handleDialog: debounce(function(val) { // 打开修改dialog
      this.dialogFormVisible = true;
      console.log(val)
      this.form = {
        "agencyID": val.row.agencyID,
        "agencyName": val.row.agencyName,
        "address": val.row.address,
        "agencyTel": val.row.agencyTel,
        "cityID": val.row.cityID,
        "boroughID": val.row.boroughID,
        "plateID": val.row.plateID,
        "linkName": val.row.linkName,
        "index": val.$index
      }
    }, 200, {
    "maxWait": 500
    }),
    handleConfirmEdit: debounce(function() { // 确定修改信息
      this.$http.post("agency/update", {
        "agencyID": this.form.agencyID,
        "agencyName": this.form.agencyName,
        "address": this.form.address,
        "telephone": this.form.agencyTel,
        "cityID": this.form.cityID,
        "boroughID": this.form.boroughID,
        "plateID": this.form.plateID,
        "linkName": this.form.linkName
      }).then(data => {
        let myData = data.data;
        if(!this.$isEmpty(myData)) {
          let status = myData.status;

          switch(status) {
              case "success":
                this.$message({
                  showClose: true,
                  message: '修改信息成功',
                  duration: 1500,
                  type: "success"
                })

                this.dialogFormVisible = false;
                
                // 更新数组，页面不用请求刷新
                let oldObj = this.tableData1[this.form.index];
                oldObj.address = this.form.address;
                oldObj.linkName = this.form.linkName;
                oldObj.agencyTel = this.form.agencyTel;

                this.tableData1.splice(this.form.index, 1, oldObj);

                break;
              case "failure":
                this.$message({
                  showClose: true,
                  message: '修改信息失败',
                  duration: 0,
                  type: "error"
                })
                break;
              default:
                this.$message({
                  showClose: true,
                  message: '修改信息失败',
                  duration: 0,
                  type: "error"
                })
                break;
            }
        }else {
          this.$message({
            showClose: true,
            message: '返回信息错误',
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
    }, 200, {
      "maxWait": 500
    }),
    handleDeleteAgendy: debounce(function(val) { // 删除信息
      this.$message({
        showClose: true,
        message: "此功能暂不可用",
        duration: 1500,
        type: "warning"
      })
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