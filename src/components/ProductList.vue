<template>
  <div>
  <div class="top clearfix">
      <div>
        <el-button  type="primary" @click="dialogFormVisible2 = true">添加产品</el-button>
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button 
              type="primary" 
              size="small"
              plain
              @click="handleDialog(scope)">
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="产品名称" :label-width="formLabelWidth">
            <el-input v-model="form.materialName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品价格" :label-width="formLabelWidth">
            <el-input v-model="form.materialPrice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品类别" :label-width="formLabelWidth">
            <el-input v-model="form.materialType" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="在售状态" :label-width="formLabelWidth">
            <el-input v-model="form.flag === 0 ? '关闭' : '开售'" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="父级产品" :label-width="formLabelWidth">
            <!-- <el-input v-model="form.parentID" auto-complete="off"></el-input> -->
            <el-select v-model="value4" :disabled="disabledFlag" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleConfirmEdit">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="添加产品" :visible.sync="dialogFormVisible2">
        <el-form :model="form2" :rules="rules" ref="ruleForm">
          <el-form-item label="产品名称" prop="materialName" :label-width="formLabelWidth">
            <el-input v-model="form2.materialName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品价格" prop="materialPrice" :label-width="formLabelWidth">
            <el-input v-model="form2.materialPrice" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="产品类别" :label-width="formLabelWidth">
            <el-select v-model="value5" placeholder="请选择">
              <el-option
                v-for="item in options2"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="父级产品" :label-width="formLabelWidth">
            <el-input v-model="form2.parentID" disabled auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="handleAddPro('ruleForm')">确 定</el-button>
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
  data () {
    return {
      tableData3: [],
      pageSize: 20, // 每页大小
      currentPage: 1, // 当前页
      pageCount: 0, // 总条数
      dialogFormVisible: false, // 修改dialog 
      formLabelWidth: "100px",
      form: {
        "materialName": "",
        "materialPrice": "",
        "parentID": "",
        "materialID": "",
        "flag": "",
        "materialType": "",
        "materialTypeName": ""
      },
      form2: {
        "materialName": "",
        "materialPrice": "",
        "parentID": "0"
      },
      options: [], // 下拉框数据
      options2: [
        {id: 1, name: "虾类"},
        {id: 2, name: "料类"},
        {id: 3, name: "卤品类"},
        {id: 4, name: "打包盒类"}
      ],
      value4: '', // 下拉框默认数据
      value5: "", // 添加产品下拉框
      disabledFlag: false, // 禁用下拉框
      dialogFormVisible2: false,
      materialTypeArr: ["虾类", "料类", "卤品类", "打包盒类"],
      rules: {
        materialName: [
          { required: true, message: '请输入产品名称', trigger: 'blur' }
        ],
        materialPrice: [
          { required: true, message: '请输入产品价格', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getData() { // 获取表格数据
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
    getSelectData(materialType, parentID) { // 获取下拉数据
      this.$http.post("material/materialDropDown", {
        "materialType": materialType
      }).then(data => {
        console.log(data)
        let myData = data.data;

        if(!this.$isEmpty(myData)) {
          let status = myData.status;

          switch(status) {
            case "success":
              let obj = myData.data;
              if(!this.$isEmpty(obj)) { 
                this.options = obj;
                this.value4 = parentID;
              }else {
                this.$message({
                  showClose: true,
                  message: '父级产品下拉查询错误',
                  duration: 0,
                  type: "error"
                })
                this.options = [];
              }
              break;
            case "failure":
              this.$message({
                showClose: true,
                message: '父级产品下拉查询错误',
                duration: 0,
                type: "error"
              })
              this.options = [];
              break;
            default:
              this.$message({
                showClose: true,
                message: '父级产品下拉查询错误',
                duration: 0,
                type: "error"
              })
              this.options = [];
              break;
          }
        }else {
          this.$message({
            showClose: true,
            message: '父级产品下拉查询错误',
            duration: 0,
            type: "error"
          })
          this.options = [];
        }
      }).catch(error => {
        console.log(error)
        this.$message({
          showClose: true,
          message: error.message,
          duration: 0,
          type: "error"
        })
        this.options = [];
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
    handleDialog: debounce(function(val) { // 修改按钮打开dialog
      this.dialogFormVisible = true;
      
      this.form = {
        "materialName": val.row.materialName,
        "materialPrice": val.row.materialPrice,
        "parentID": val.row.parentID,
        "materialID": val.row.materialID,
        "flag": val.row.flag,
        "materialType": this.materialTypeArr[val.row.materialType - 1],
        "index": val.$index
      }

      if(parseInt(val.row.parentID)) { // 父级产品ID 为0时 无父级
        this.getSelectData(val.row.materialType, val.row.parentID);
        this.disabledFlag = false;
      }else {
        this.options = [];
        this.value4 = "";
        this.disabledFlag = true;
      }
      
    }, 200, {
      "maxWait": 500
    }),
    handleConfirmEdit: debounce(function() { // 确定修改
      this.$http.post("material/update", {
        "materialName": this.form.materialName,
        "materialPrice": this.form.materialPrice,
        "parentID": this.form.parentID,
        "materialID": this.form.materialID,
        "flag": this.form.flag,
        "materialType": this.form.materialTypeArr
      }).then(data => {
        console.log(data)
      }).catch(error => {
        console.log(error)
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
    handleAddPro: debounce(function(formName) { // 添加产品
    console.log(formName)
      this.$refs[formName].validate((valid) => {
        if(valid) {
          this.$http.post("agency/creat", {
            "materialName": this.form2.materialName,
            "materialPrice": this.form2.materialPrice,
            "parentID": this.form2.parentID,
            "materialType": this.value5
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
        }else {
          this.$message({
            showClose: true,
            message: "输入有误，请检查您的输入信息！",
            duration: 3000,
            type: "warning"
          })
          return false;
        }
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