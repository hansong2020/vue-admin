<template>
  <div>
    <router-view />
    <div class="container">
      <el-row :gutter="24" style="margin-top:5px; margin-bottom:5px">
        <el-col :span="24">
          <el-card shadow="always">
            <el-button
              type="primary"
              icon="el-icon-roundadd"
              class="handle-del mr10"
              @click="createProduct"
            >创建产品</el-button>
            <el-input v-model="query.paramData" placeholder="请输入产品名称" class="handle-input mr10" />
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
          </el-card>
        </el-col>
      </el-row>

      <el-table
        :data="tableData"
        border
        class="table"
        header-cell-class-name="table-header"
      >
        <el-table-column prop="productName" label="产品名称" width="200" align="center" />
        <el-table-column prop="productCode" label="产品编码" align="center" />
        <el-table-column prop="protocolCode" label="协议编码" align="center" />
        <el-table-column
          prop="nodeType"
          label="节点类型"
          align="center"
          :formatter="formatNodeType"
        />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="viewDetail(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              type="text"
              @click="goDevicePage(scope.$index, scope.row)"
            >管理设备</el-button>
            <el-button
              type="text"
              class="red"
              @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageNo"
          :page-size="query.limit"
          :total="total"
          @current-change="handlePageChange"
        />
      </div>
    </div>
    <product-create :show="createShow" @hidden="hiddenCreate" @refresh="getData" />
  </div>
</template>

<script>
import { productListApi, productDelApi } from '../../api/product'
import productCreate from './component/create'
export default {
  components: { productCreate },
  data() {
    return {
      createShow: false,
      query: {
        paramData: '',
        pageNo: 1,
        limit: 10
      },
      tableData: [],
      total: 0,
      form: {},
      idx: -1,
      id: -1
    }
  },
  created() {
    this.getData()
  },
  methods: {
    hiddenCreate() {
      this.createShow = false
    },
    createProduct() {
      this.createShow = true
    },
    getData() {
      const para = this.query
      productListApi(para).then(response => {
        console.log(response)
        this.tableData = response.data.resultData
        this.total = response.data.total
      })
    },
    // 触发搜索按钮
    handleSearch() {
      this.$set(this.query, 'pageNo', 1)
      this.getData()
    },
    // 删除操作
    handleDelete(index, row) {
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const id = row.id
        productDelApi(id).then(response => {
          console.log(response)
          this.$message.success('删除成功')
          this.getData()
        })
      })
        .catch(() => {})
    },
    viewDetail(index, row) {
      this.$router.push({ name: 'dev-product-info', query: { code: row.productCode }})
    },
    // 编辑操作
    handleEdit(index, row) {
      this.idx = index
      this.form = row
      this.editVisible = true
    },
    // 保存编辑
    saveEdit() {
      this.editVisible = false
      this.$message.success(`修改第 ${this.idx + 1} 行成功`)
      this.$set(this.tableData, this.idx, this.form)
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, 'pageNo', val)
      this.getData()
    },
    goDevicePage(index, row) {
      this.$router.push({ name: 'dev-device-index', query: { code: row.productCode }})
    }
  }
}
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
