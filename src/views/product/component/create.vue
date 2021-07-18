<template>
  <div>
    <el-dialog
      title="新增产品"
      :visible.sync="show"
      :modal="false"
      :close-on-click-modal="false"
      :show-close="false"
      :close-on-press-escape="false"
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
              <el-button type="primary" @click="onSubmit">确认</el-button>
              <el-button @click="cancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { productCreateApi, protocolListApi } from '../../../api/product'

export default {
  name: 'Baseform',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      protocols: [],
      form: {
        productName: '',
        protocolCode: '',
        nodeType: '',
        productDesc: '',
        transportList: ['MQTT']

      },
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
    this.getData()
  },
  methods: {
    getData() {
      protocolListApi({}).then(data => {
        const retValue = data.data
        // const { msg, code } = data.data
        console.log(retValue)
        this.protocols = retValue
      })
    },
    cancel() {
      this.$emit('hidden')
    },
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$notify.error({
            title: '错误',
            message: '请检查必要参数'
          })
          console.log('error submit!!')
          return false
        }
        const para = this.form
        productCreateApi(para).then(data => {
          const retValue = data.data
          console.log(retValue)
          this.$message.success('提交成功！')
          /** 调用父组件绑定方法关闭dialog*/
          this.$emit('hidden')
          this.$emit('refresh')
          this.$refs['form'].resetFields()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
