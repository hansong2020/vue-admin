<template>
  <div v-if="show">
    <el-button type="primary" @click="updateVisible = true">编辑</el-button>
    <el-button type="primary" @click="genSign">生成签名</el-button>
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
      <a-descriptions-item label="设备编码">
        {{ detail.deviceCode }}
      </a-descriptions-item>
      <a-descriptions-item label="备注名称">
        {{ detail.deviceName }}
      </a-descriptions-item>
      <a-descriptions-item label="固件版本">
        {{ detail.firmwareVersion }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ detail.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="最后上线时间" :span="1">
        {{ detail.lastOnlineTime }}
      </a-descriptions-item>
      <a-descriptions-item label="当前状态" :span="1">
        {{ detail.enableStatusMsg }}
      </a-descriptions-item>
      <a-descriptions-item label="设备密钥" :span="1">
        {{ secret }}
        <el-button type="text" @click="showSecret">查看 </el-button>
        <el-button v-clipboard:copy="secret" v-clipboard:success="clipboardSuccess" type="text">
          复制
        </el-button>
      </a-descriptions-item>
      <a-descriptions-item label="最新上线网络地址" :span="1">
        {{ detail.devHost }}:{{ detail.devPort }}
      </a-descriptions-item>
      <a-descriptions-item label="是否在线" :span="1">
        {{ detail.activeStatusMsg }}
      </a-descriptions-item>
    </a-descriptions>
    <el-dialog title="编辑设备" :visible.sync="updateVisible" width="30%">
      <el-form ref="form" :rules="rules" :model="form" label-width="90px">
        <el-form-item label="设备编码" prop="deviceCode" label-width="90px">
          <el-input v-model="form.deviceCode" disabled />
        </el-form-item>
        <el-form-item label="设备名称" prop="deviceName" label-width="90px">
          <el-input v-model="form.deviceName" />
        </el-form-item>
        <el-form-item label="设备密钥" prop="deviceSecret" label-width="90px">
          <el-input v-model="form.deviceSecret" />
        </el-form-item>
        <el-form-item label="所属产品" prop="productCode" label-width="90px">
          <el-select v-model="form.productCode" prop="productCode" clearable placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.productCode"
              :label="item.productName"
              :value="item.productCode"
            />
          </el-select>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { deviceUpdateApi, deviceInfoApi } from '../../../api/device'
import { productSearchApi } from '../../../api/product'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

export default {
  name: 'DevDetailPage',
  directives: {
    clipboard
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    deviceCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      detail: {

      },
      secret: '************',
      form: {},
      productList: [],
      updateVisible: false,
      rules: {
        productCode: [{ required: true, max: 60, message: '请选择产品', trigger: 'blur' }],
        deviceCode: [{ required: true, max: 60, message: '请输入设备编码', trigger: 'blur' }],
        deviceName: [{ required: true, max: 60, message: '请输入设备名称', trigger: 'blur' }],
        deviceSecret: [{ required: true, max: 60, message: '请输入设备密钥', trigger: 'blur' }]
      }
    }
  },
  watch: {
    $route: {
      handler() {
        this.deviceCode = this.$route.params.code
        this.initDetail()
        // 深度监听，同时也可监听到param参数变化
      },
      deep: true
    }
  },
  mounted() {
    this.initDetail()
    this.getProductList()
  },
  methods: {
    genSign() {
      const userName = this.deviceCode + '|' + new Date().getTime()
      const password = this.$md5(userName + '|' + this.detail.deviceSecret)

      let msg = 'clientId:' + this.deviceCode
      msg = msg + '<br/>userName:' + userName
      msg = msg + '<br/>password:' + password
      this.$alert(msg, 'MQTT登录信息', {
        dangerouslyUseHTMLString: true
      })
    },
    showSecret() {
      this.secret = this.detail.deviceSecret
    },
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success',
        duration: 1500
      })
    },
    getProductList() {
      const para = {
        paramData: null,
        pageNo: 1,
        limit: 1000
      }
      productSearchApi(para).then(data => {
        const retValue = data.data
        this.productList = retValue.resultData
      })
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          deviceUpdateApi(this.form).then(data => {
            this.$message.success('成功')
            this.updateVisible = false
            this.$refs['form'].resetFields()
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
    initDetail() {
      deviceInfoApi(this.deviceCode).then(data => {
        const retValue = data.data
        this.detail = retValue
        this.form = retValue
        const row = {
          nodeType: this.detail.nodeType
        }
        this.detail.nodeName = this.formatNodeType(row)
        this.detail.lastOnlineTime = this.formatTimeBC('', '', this.detail.lastOnlineTime)
        this.detail.enableStatusMsg = this.detail.enableStatus === 0 ? '未激活' : '激活'
        this.detail.activeStatusMsg = this.detail.activeStatus === 1 ? '在线' : '离线'
        this.writeGwDeviceCode(retValue.gwDevCode)
        this.writeNodeType(retValue.nodeType)
      })
    }
  }
}
</script>

<style scoped>

</style>
