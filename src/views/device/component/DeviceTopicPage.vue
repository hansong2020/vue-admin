<template>
  <div v-if="show">

    <el-table
      :data="tableData"
      border
      class="table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="name" width="170px" label="名称" align="left" />
      <el-table-column prop="topic" label="topic" align="left" />
      <el-table-column prop="desc" label="描述" align="left" />

    </el-table>

  </div>

</template>

<script>
import { deviceInfoApi } from '../../../api/device'
export default {
  name: 'DeviceTopicPage',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    deviceCode: {
      type: String,
      default: ''
    },
    // eslint-disable-next-line vue/require-default-prop
    productCode: String
  },
  data() {
    return {
      gwDeviceCode: '',
      tableData: [
        { name: '↑属性上报', topic: 'bcup/' + this.productCode + '/' + this.deviceCode + '/prop', desc: '设备上报属性' },
        { name: '↑事件上报', topic: 'bcup/' + this.productCode + '/' + this.deviceCode + '/event', desc: '设备上报事件' },
        { name: '↑服务调用返回结果上报', topic: 'bcup/' + this.productCode + '/' + this.deviceCode + '/message/reply', desc: '设备上报服务调用结果' },
        { name: '↑设备属性读取响应', topic: 'bcup/' + this.productCode + '/' + this.deviceCode + '/property/getreply', desc: '系统读取设备属性后，设备向该topic发送数据响应' },
        { name: '↑设备升级状态响应', topic: 'bcup/' + this.productCode + '/' + this.deviceCode + '/upgrade/reply', desc: '设备升级状态响应' },
        { name: '↓调用设备服务', topic: 'bcdown/' + this.productCode + '/' + this.deviceCode + '/service/invoke', desc: '下行发送指令到设备' },
        { name: '↓设备属性设置', topic: 'bcdown/' + this.productCode + '/' + this.deviceCode + '/property/set', desc: '下行发送指令到设备' },
        { name: '↓设备属性读取', topic: 'bcdown/' + this.productCode + '/' + this.deviceCode + '/property/get', desc: '读取设备属性时向该topic发送消息' },
        { name: '↓下发升级指令', topic: 'bcdown/' + this.productCode + '/' + this.deviceCode + '/upgrade/set', desc: '下发升级指令' }
      ]
    }
  },
  watch: {

  }, /** ends method*/
  mounted() {
    this.init()
  },
  methods: {
    init() {
      deviceInfoApi(this.deviceCode).then(data => {
        const retValue = data.data
        const nodeType = retValue.nodeType
        if (nodeType === 'SUB') {
          const gwDeviceCode = retValue.gwDevCode
          const subTable = [
            { name: '↑属性上报', topic: 'bcup/' + gwDeviceCode + '/' + this.deviceCode + '/prop', desc: '设备上报属性' },
            { name: '↑事件上报', topic: 'bcup/' + gwDeviceCode + '/' + this.deviceCode + '/event', desc: '设备上报事件' },
            { name: '↑服务调用返回结果上报', topic: 'bcup/' + gwDeviceCode + '/' + this.deviceCode + '/message/reply', desc: '设备上报服务调用结果(设备属性设置也上报到这里)' },
            { name: '↑设备属性读取响应', topic: 'bcup/' + gwDeviceCode + '/' + this.deviceCode + '/property/getreply', desc: '系统读取设备属性后，设备向该topic发送数据响应' },
            { name: '↑设备升级状态响应', topic: 'bcdown/' + gwDeviceCode + '/' + this.deviceCode + '/upgrade/reply', desc: '设备升级状态响应' },
            { name: '↓调用设备服务', topic: 'bcdown/' + gwDeviceCode + '/' + this.deviceCode + '/service/invoke', desc: '下行发送指令到设备' },
            { name: '↓设备属性设置', topic: 'bcdown/' + gwDeviceCode + '/' + this.deviceCode + '/property/set', desc: '下行发送指令到设备' },
            { name: '↓设备属性读取', topic: 'bcdown/' + gwDeviceCode + '/' + this.deviceCode + '/property/get', desc: '读取设备属性时向该topic发送消息' },
            { name: '↓下发升级指令', topic: 'bcdown/' + gwDeviceCode + '/' + this.deviceCode + '/upgrade/set', desc: '下发升级指令' }
          
          ]
          this.tableData = subTable
        } else if (nodeType === 'GATEWAY') {
          const gwTable = [
            { name: '↑子设备上线', topic: 'bcup/' + this.productCode + '/' + this.deviceCode + '/online', desc: '网关子设备上线' },
            { name: '↑子设备下线', topic: 'bcup/' + this.productCode + '/' + this.deviceCode + '/offline', desc: '网关子设备下线' }
          ]
          this.tableData = this.tableData.concat(gwTable)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
