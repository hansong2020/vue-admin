<template>
  <div>
        <el-row :gutter="24" style="margin-top: 5px; margin-bottom: 5px">
      <el-col :span="24">
        <el-card shadow="always">
          <el-button type="primary" icon="el-icon-plus" @click="showCreateDlg">新建</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      class="table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="id" label="ID" align="center" />
      <el-table-column prop="taskName" label="任务名称" align="center" />
      <el-table-column prop="bookTime" label="预定升级" align="center" />
      <!-- <el-table-column prop="upgradeType" label="升级模式" align="center" />  -->
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="updateTime" label="更新时间" align="center" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="upgrade(scope.row)">全量升级</el-button>
         <el-button type="text" @click="upgradeSingle(scope.row)">逐个升级</el-button>
          <el-button type="text" @click="handleUpgradeBookShow(scope.row)">定时升级</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :current-page="query.pageNo"
        :page-size="query.limit"
        :total="total"
        :page-sizes="pageSizes"
        @current-change="handlePageChange"
        @size-change="sizeChange"
      />
    </div>
    <el-dialog title="选择定时升级时间" :visible.sync="boolShow" >
      <el-form ref="bookForm" :model="bookForm"  >
        <el-form-item v-if="false" label="id">
          <el-input v-model="bookForm.id" disabled />
        </el-form-item>
        <el-form-item label="预定时间" >
          <el-date-picker
            style="width:217px"
            v-model="bookForm.upgradeTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss" >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="boolShow = false">取 消</el-button>
        <el-button type="primary" @click="upgradeBook">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择要升级的设备" :visible.sync="devShow" >
       <el-row :gutter="24" style="margin-top: 5px; margin-bottom: 5px">
        <el-col :span="24">
          <el-card shadow="always">
            <el-input v-model="deviceSearch.deviceCode" clearable placeholder="设备编码" />
            <el-input v-model="deviceSearch.deviceName" clearable placeholder="设备名称" />
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleDeviceSearch"
            >搜索</el-button>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="handleDeviceUpgrade"
            >确认升级</el-button>
          </el-card>
        </el-col>
      </el-row>
    <el-table
        ref="multipleTable"
        :data="deviceTable"
        border
        class="table"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
    >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="deviceCode" label="设备编码" align="center" />
        <el-table-column prop="deviceName" label="设备名称" align="center" />
        <el-table-column prop="productName" label="所属产品" align="center" />
    </el-table>
    </el-dialog>
     <el-dialog :title="dlgTitle" :visible.sync="createVisible" width="40%">
      <el-form ref="createForm" :model="createForm"  label-width="100px">
        <el-form-item v-if="false" label="id">
          <el-input v-model="createForm.id" disabled />
        </el-form-item>
        <el-form-item label="任务名称" >
          <el-input v-model="createForm.taskName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTask">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { taskSearchApi, taskCreateApi, firmwareDeleteApi, taskUpgradeApi, taskDeviceSearch} from '../../../api/firmwaretask'

export default {
   props:{
    firmwareId: {
      type: String,
      default: '0'
    },
  },
  data(){
    return {
      devShow: false,
      boolShow:false,
      bookForm:{
        id:undefined,
        upgradeTime: undefined
      },
      tableData:[],
      deviceTable:[],
      createVisible:false,
      createForm:{
        taskName: ''
      },
      deviceSearch:{
        deviceName: undefined,
        deviceCode: undefined,
        firmwareId: this.firmwareId
      },
       total: 0,
       query: {
        limit: 10,
        pageNo: 1,
        paramData: {
          firmwareId :  this.firmwareId
        }
      },
      dlgTitle:'',
      multipleSelection: [],
      selectedRow: undefined,
      pageSizes: [10, 20, 30, 50, 60, 100],
    }
  },/**data ends*/
  methods:{
    getData(){
        taskSearchApi(this.query).then(res => {
          const retValue = res.data
          this.tableData = retValue.resultData
          this.total = retValue.total
        })
    },
    handleDeviceSearch(row){
      this.selectedRow = row
        taskDeviceSearch(this.deviceSearch).then(res =>{
          this.deviceTable = res.data
        })
    },
    handleDeviceUpgrade(){
        const list = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        list.push(this.multipleSelection[i].deviceCode)
      }
      const param = {
        deviceCode: list,
        taskId: this.selectedRow.id,
        firmId: this.selectedRow.firmwareId
      }
      this.$confirm('确定要对选中设备升级吗？', '提示', {
        type: 'warning'
      }).then(() => {
         taskUpgradeApi(param).then( res => {

         })
      })

    },
     handleSelectionChange(val) {
      this.multipleSelection = val
      if (this.multipleSelection.length > 0) {

      }
      // alert(this.multipleSelection.length);
    },
    /**逐个升级*/
    upgradeSingle(row){
        this.devShow = true
        this.handleDeviceSearch(row)
    },
    /**定时升级*/
    upgradeBook(row){
      this.$confirm('确定要对所有设备定时升级吗？', '提示', {
        type: 'warning'
      }).then(() => {
        if('' == this.bookForm.upgradeTime || undefined == this.bookForm.upgradeTime){
          this.$message.warning('请正确选择时间')
          return
        }
        taskUpgradeApi(this.bookForm).then( res => {
          this.$message.success('设置成功')
          this.boolShow = false
          this.getData()
        })
      })
    },
    handleUpgradeBookShow(row){
      this.boolShow = true
      this.bookForm = {
        taskId: row.id,
        upgradeTime: undefined,
        firmId: row.firmwareId
      }
    },
    /***/
     upgrade(row) {
      this.$confirm('确定要对所有设备吗？', '提示', {
        type: 'warning'
      }).then(() => {
        let param = {
          taskId: row.id,
          firmId: row.firmwareId
        }
         taskUpgradeApi(param).then( res => {

         })
      })
    },
    saveTask(){
      if(this.createForm.taskName == '' ){
       this.$message.warning('任务名不能为空')
       return
      }
      this.createForm.firmwareId = parseInt(this.firmwareId);
      taskCreateApi(this.createForm).then(res => {
        this.$message.success('添加任务成功')
        this.getData()
      })
    },
    handlePageChange(val) {
      this.$set(this.query, 'pageNo', val)
      this.getData()
    },
    sizeChange(val) {
      this.$set(this.query, 'limit', val)
      this.getData()
    },
    reset(){
      this.createForm = {
        taskName: ''
      }
    },
    showCreateDlg(){
      this.createVisible = true
      this.reset()
    },
  }
}
</script>

<style lang="scss" scoped>

  .el-input {
    width:130px
}
  .input-class{
    .el-input__inner{
      width: 300px;
    }
  }
</style>
