<template>
  <div class="container">
    <el-row :gutter="24" style="margin-top: 5px; margin-bottom: 5px">
      <el-col :span="24">
        <el-card shadow="always">
          <el-select
            v-model="search.productCode"
            class="search"
            clearable
            placeholder="请选择产品"
          >
            <el-option
              v-for="item in productList"
              :key="item.productCode"
              :label="item.productName"
              :value="item.productCode"
            />
          </el-select>
          <el-input
            v-model="search.firmwareName"
            style="width:230px"
            clearable
            placeholder="固件名称"
          />
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="showCreateDlg">新建</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :title="dlgTitle" :visible.sync="createVisible" width="40%">
      <el-form ref="createForm" :model="createForm" :rules="rules" label-width="100px">
        <el-form-item v-if="false" label="ID">
          <el-input v-model="createForm.id" disabled />
        </el-form-item>
        <el-form-item label="固件名称" prop="firmwareName">
          <el-input v-model="createForm.firmwareName" />
        </el-form-item>
        <el-form-item label="产品列表" prop="productCode">
          <el-select
            v-model="createForm.productCode"
            clearable
            placeholder="请选择"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in productList"
              :key="item.productCode"
              :label="item.productName"
              :value="item.productCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="固件版本" prop="firmwareVersion">
          <el-input v-model="createForm.firmwareVersion" placeholder="例:1.0.1" />
        </el-form-item>
        <el-form-item label="固件序号" prop="seqNo">
          <el-input v-model="createForm.seqNo" type="number" placeholder="客户端可根据此值大小对比决定是否升级" />
        </el-form-item>
        <el-form-item label="文件URL" prop="url">
          <el-input v-model="createForm.url" disabled placeholder="上传附件地址回显" />
        </el-form-item>
        <el-form-item>
          <el-upload
            class="upload-demo"
            drag
            action="/admin/file/upload"
            :headers="importHeaders"
            :on-success="handleUploadSuccess"
            :limit="1"
            :file-list="fileList"
            :on-exceed="exceed"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip" />
          </el-upload>
        </el-form-item>
        <el-form-item label="文件签名" prop="signCode">
          <el-input v-model="createForm.signCode" placeholder="文件的md5散列值" />
        </el-form-item>
        <el-form-item label="推送方式" prop="pushType">
          <el-select
            v-model="createForm.pushType"
            clearable
            placeholder="请选择"
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in pushTypeList"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveFirmware">确 定</el-button>
      </span>
    </el-dialog>
    <el-table
      :data="tableData"
      border
      class="table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="firmwareName" label="固件名称" align="center" />
      <el-table-column prop="productName" label="所属产品" align="center" />
      <el-table-column prop="firmwareVersion" label="固件版本" align="center" />
      <el-table-column v-if="false" prop="productCode" label="所属产品编码" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="updateTime" label="更新时间" align="center" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="viewInfo(scope.row)">查看</el-button>
          <el-button type="text" @click="showEditDlg(scope.row)">编辑</el-button>
          <el-button type="text" @click="delDlgShow(scope.row)">删除</el-button>
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
  </div>
</template>

<script>

import { productSearchApi } from '../../api/product'
import { getToken } from '@/utils/auth'
import { firmwareSearchApi, firmwareInfoApi, firmwareCreateApi, firmwareUpdateApi, firmwareDeleteApi } from '../../api/firmware'
export default {
  name: 'FirmwareIndex',
  data() {
    return {
      fileList: [],
      importHeaders: {},
      dlgTitle: '',
      dlgType: undefined,
      pushTypeList: [
        { type: 1, name: 'URL升级' },
        { type: 2, name: 'Base64升级(文件)' },
        { type: 3, name: '混合升级' }
      ],
      createVisible: false,
      tableData: [],
      query: {
        limit: 10,
        pageNo: 1,
        paramData: {
          productCode: undefined,
          firmwareName: undefined
        }
      },
      search: {
        productCode: undefined,
        firmwareName: undefined
      },
      total: 0,
      productList: [],
      pageSizes: [10, 20, 30, 50, 60, 100],
      createForm: {
        firmwareVersion: null,
        seqNo: null,
        productCode: null,
        signCode: null,
        firmwareName: null,
        pushType: null,
        url: null
      },
      rules: {
        productCode: [
          { required: true, message: '请选择产品', trigger: 'blur' }
        ],
        firmwareName: [{ required: true, message: '固件名称', trigger: 'blur' }],
        firmwareVersion: [{ required: true, message: '请输入版本', trigger: 'blur' }],
        seqNo: [{ required: true, message: '序列号不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '未上传附件', trigger: 'blur' }],
        signCode: [{ required: true, message: '签名不能为空', trigger: 'blur' }],
        pushType: [{ required: true, message: '升级模式不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    const token = getToken()
    this.importHeaders = { token: token }
    this.getProductList()
    this.getData()
  },
  methods: {
    /** 文件上传成功*/
    handleUploadSuccess(res, file, fileList) {
      if (res.code !== 200) {
        this.$message.warning('上传文件失败:' + res.msg)
        return
      }
      this.createForm.url = res.data
      this.$forceUpdate()
    },
    /** 文件上传数目超出限制*/
    exceed(files, fileList) {
      this.$message.warning('已经上传过文件了')
    },
    viewInfo(row){
      const param = {
        firmid: row.id
      }
      this.$router.push({ name: 'dev-firmware-info', query: param })
    },
    showEditDlg(row) {
      this.createVisible = true
      this.dlgTitle = '编辑固件'
      // 1:新增 2:更新
      this.dlgType = 2
      this.resetCreate()

      firmwareInfoApi(row.id).then(data => {
        this.createForm = data.data
      })
    },
    showCreateDlg() {
      this.createVisible = true
      this.dlgTitle = '添加固件'
      // 1:新增 2:更新
      this.dlgType = 1
      this.resetCreate()
    },
    resetCreate() {
      this.createForm = {
        firmwareVersion: null,
        seqNo: null,
        productCode: null,
        signCode: null,
        firmwareName: null,
        pushType: null,
        url: null
      }

      this.fileList = []
    },
    delDlgShow(row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        firmwareDeleteApi(row.id).then(res => {
          this.$message.success('删除成功')
          this.getData()
        })
      }).catch(() => {})
    },
    sizeChange(val) {
      this.$set(this.query, 'limit', val)
      this.getData()
    },
    getData() {
      this.query.paramData = this.search
      firmwareSearchApi(this.query).then(data => {
        const retValue = data.data
        this.tableData = retValue.resultData
        this.total = retValue.total
      })
    },
    saveFirmware() {
      console.log(JSON.stringify(this.createForm))
      if (this.dlgType === 1) {
        this.createFirmware()
      } else if (this.dlgType === 2) {
        this.updateFirmware()
      } else {
        this.$message.warning('类型异常')
      }
      this.getData()
    },
    createFirmware() {
      this.$refs.createForm.validate(valid => {
        if (!valid) {
          this.$message.warning('参数非法')
          return false
        }
        const para = this.createForm
        firmwareCreateApi(para).then(data => {
          const retValue = data.data
          console.log(retValue)
          this.$message.success('提交成功！')
          this.resetCreate()
          this.createVisible = false
        })
      })
    },
    updateFirmware() {
      firmwareUpdateApi(this.createForm).then(data => {
        this.$message.success('更新固件成功')
        this.getData()
        this.createVisible = false
      })
    },
    getProductList() {
      const para = {
        paramData: null,
        pageNo: 1,
        limit: 1000
      }
      productSearchApi(para).then((data) => {
        const retValue = data.data
        this.productList = retValue.resultData
      })
    },
    handlePageChange(val) {
      this.$set(this.query, 'pageNo', val)
      this.getData()
    },
    handleSearch() {
      this.getData()
    }
  } /** ends methods*/
}
</script>

<style scoped>
.el-select s .search {
  width: 210px;
}

.el-input .search{
  width: 130px;
}
</style>
