<template>
  <div v-if="show">
    <el-button type="primary" @click="showEdit">编辑产品</el-button>
    <a-descriptions title="" bordered>
      <a-descriptions-item label="产品名称">
        {{ detail.productName }}
      </a-descriptions-item>
      <a-descriptions-item label="产品编码">
        {{ detail.productCode }}
      </a-descriptions-item>
      <a-descriptions-item label="节点类型">
        {{ detail.nodeName }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ detail.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="下行网络协议" :span="1">
        {{ detail.transportList }}
      </a-descriptions-item>
      <a-descriptions-item label="数据协议" :span="1">
        {{ detail.protocolName }}
      </a-descriptions-item>
      <a-descriptions-item label="产品描述" :span="3">
        {{ detail.productDesc }}
      </a-descriptions-item>
    </a-descriptions>

    <el-dialog
      title="编辑产品"
      :visible.sync="editShow"
    >
      <div class="container">
        <div class="form-box">
          <el-form ref="form" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="产品名称" prop="productName">
              <el-input v-model="form.productName" placeholder="请输入产品名称" />
            </el-form-item>
            <el-form-item label="数据协议" prop="protocolCode">
              <el-select v-model="form.protocolCode" placeholder="请选择">
                <el-option
                  v-for="item in protocols"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="下行网络协议" prop="transportList">
              <el-radio-group v-model="form.transportList">
                <el-radio label="MQTT" />
                <!-- <el-checkbox label="TCP" /> -->
                <el-radio label="UDP" />
                <!-- <el-checkbox label="HTTP" /> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="节点类型" prop="nodeType">
              <el-radio-group v-model="form.nodeType">
                <el-radio label="DIRECT">直连设备</el-radio>
                <el-radio label="SUB">网关子设备</el-radio>
                <el-radio label="GATEWAY">网关设备</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="产品描述" prop="productDesc">
              <el-input v-model="form.productDesc" placeholder="请输入产品描述" type="textarea" rows="5" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="editSave">确认</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { productDetailApi, protocolListApi, productUpdateApi } from '../../../api/product'

export default {
  name: 'ProductDetailPage',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    productCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editShow: false,
      detail: {
        'productName': '',
        'productCode': '',
        'nodeName': '',
        'createTime': '',
        'transportList': 'MQTT',
        'protocolName': '',
        'productDesc': ''
      },
      form: {},
      protocols: [],
      rules: {
        productName: [{ required: true, max: 60, message: '请输入产品名称', trigger: 'blur' }],
        protocolCode: [{ required: true, message: '请选择数据协议', trigger: 'change' }],
        transportList: [{ required: true, message: '请选择网络协议', trigger: 'change' }],
        nodeType: [{ required: true, message: '请选择节点类型', trigger: 'change' }],
        productDesc: [{ required: true, max: 160, message: '请输入产品描述', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initDetail()
    this.getProtocols()
  },
  methods: {
    initDetail() {
      productDetailApi(this.productCode).then(data => {
        const retValue = data.data
        this.detail = retValue
        this.form = retValue
        this.form.transportList = retValue.transportList
      })
    },

    getProtocols() {
      protocolListApi({}).then(data => {
        const retValue = data.data
        this.protocols = retValue
      })
    },
    showEdit() {
      this.editShow = true
    },
    editSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          productUpdateApi(this.form).then(data => {
            this.editShow = false
            this.initDetail()
          })
        } else {
          this.$notify.error({
            title: '错误',
            message: '请检查必要参数'
          })
        }
      })
    },
    cancel() {
      this.editShow = false
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
