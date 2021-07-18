<template>
  <div class="">
    <div class="container">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="产品信息" name="first">
          <product-detail-page ref="productDetailPage" :show="showProductDetailPage" :product-code="productCode" />
        </el-tab-pane>
        <el-tab-pane label="物模型" name="second">
          <el-tabs v-model="activeModelName" type="card" @tab-click="handleModelClick">
            <el-tab-pane label="属性" name="propModel">
              <prop-mgr-page ref="propMgrPage" :show="showPropPage" :product-code="productCode" />
            </el-tab-pane>
            <el-tab-pane label="事件" name="eventModel">
              <event-mgr-page ref="eventMgrPage" :show="showEventPage" :product-code="productCode" />
            </el-tab-pane>
            <el-tab-pane label="服务" name="serviceModel">
              <service-page ref="serviceMgrPage" :show="showServicePage" :product-code="productCode" />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <el-tab-pane label="TOPIC" name="third">
          <topic-detail :product-code="productCode" />
        </el-tab-pane>

      </el-tabs>
    </div>

  </div>

</template>

<script>
import servicePage from './component/ServicePage.vue'
import propMgrPage from './component/PropMgrPage.vue'
import eventMgrPage from './component/EventMgrPage.vue'
import productDetailPage from './component/ProductDetailPage.vue'
import topicDetail from './component/TopicDetail'
export default {
  name: 'ProductMgrNew',
  components: {
    servicePage,
    propMgrPage,
    eventMgrPage,
    productDetailPage,
    topicDetail
  },
  data() {
    return {
      activeName: 'first',
      activeModelName: 'propModel',
      showPropPage: true,
      showEventPage: true,
      showServicePage: true,
      showProductDetailPage: true,
      productCode: this.$route.query.code
    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleModelClick(tab, event) {
      if (tab.name == 'eventModel') {
        this.$refs.eventMgrPage.initEvents()
      } else if (tab.name == 'serviceModel') {
        this.$refs.serviceMgrPage.initData()
      } else if (tab.name == 'propModel') {
        this.$refs.propMgrPage.initProps()
      }
    }

  }
}

</script>

<style>
  .message-title{
    cursor: pointer;
  }

</style>

