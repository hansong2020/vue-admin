<template>
  <div class="">

    <div class="container">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="设备信息" name="deviceInfo">
          <device-detail-page :show="detailInfoShow" :device-code="deviceCode" />
        </el-tab-pane>
        <el-tab-pane label="物模型数据" name="modelData">
          <el-tabs v-model="activeModelName" type="card" @tab-click="handleModelClick">
            <el-tab-pane label="运行状态" name="runtime">
              <device-runtime-page ref="runtimePage" :product-code="productCode" :show="showRuntimePage" :device-code="deviceCode" />
            </el-tab-pane>
            <el-tab-pane label="事件管理" name="eventState">
              <device-event-page ref="eventPage" :product-code="productCode" :show="showEventStatePage" :device-code="deviceCode" />
            </el-tab-pane>
            <el-tab-pane label="服务调用记录" name="serviceState" :product-code="productCode" :device-code="deviceCode">
              <device-service-page ref="servicePage" :product-code="productCode" :show="showServicePage" :device-code="deviceCode" />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="服务调用" name="serviceInvoke">
          <device-service-invoke ref="serviceInvoke" :show="showServiceInvoke" :product-code="productCode" :device-code="deviceCode" />
        </el-tab-pane>
        <el-tab-pane label="TOPIC" name="topicPage">
          <device-topic-page ref="topicPage" :show="showTopicPage" :product-code="productCode" :device-code="deviceCode" />
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>

</template>

<script>
import deviceDetailPage from './component/DeviceDetailPage'
import deviceRuntimePage from './component/DeviceRuntimePage'
import deviceEventPage from './component/DeviceEventPage'
import deviceServiceInvoke from './component/DeviceServiceInvoke'
import deviceServicePage from './component/DeviceServicePage'
import deviceTopicPage from './component/DeviceTopicPage'
export default {
  name: 'DeviceDetail',
  components: {
    deviceDetailPage, deviceRuntimePage, deviceEventPage,
    deviceServiceInvoke, deviceServicePage, deviceTopicPage
  },
  data() {
    return {
      activeName: 'deviceInfo',
      detailInfoShow: true,
      deviceCode: this.$route.query.deviceCode,
      productCode: this.$route.query.productCode,
      activeModelName: 'runtime',
      showRuntimePage: true,
      showEventStatePage: true,
      showServiceInvoke: true,
      showServicePage: true,
      showTopicPage: true
    }
  },
  watch: {
    $route: {
      handler() {
        this.productCode = this.$route.query.productCode
        this.deviceCode = this.$route.query.deviceCode
        // 深度监听，同时也可监听到param参数变化
      },
      deep: true
    }
  }, /** ends method*/
  mounted() {
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === 'serviceInvoke') {
        this.$refs.serviceInvoke.initData()
      }
    },
    handleModelClick(tab, event) {
      if (tab.name === 'runtime') {
        this.$refs.runtimePage.initData()
      } else if (tab.name === 'eventState') {
        this.$refs.eventPage.initData()
      } else if (tab.name === 'serviceState') {
        this.$refs.servicePage.initData()
      }
    }
  }/** ends watch*/
}
</script>

<style scoped>

</style>
