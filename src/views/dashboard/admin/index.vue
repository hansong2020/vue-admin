<template>
  <div class="dashboard-editor-container">

    <panel-group :device-count="deviceCount" :device-active="deviceActive" :device-enable="deviceEnable" :msg-count="msgCount" />
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import { dashBoardIndexApi } from '../../../api/dashboard'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart
  },
  data() {
    return {
      lineChartData: {
        dates: ['', '', '', '', '', '', ''],
        actualData: [0, 0, 0, 0, 0, 0, 0]
      },
      deviceCount: 0,
      deviceActive: 0,
      deviceEnable: 0,
      msgCount: 0
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const timestamp = new Date().getTime()
      dashBoardIndexApi(timestamp).then(data => {
        const response = {
          dates: data.data.line.dates,
          actualData: data.data.line.count
        }
        this.lineChartData = response
        this.deviceCount = data.data.header.deviceCount
        this.deviceActive = data.data.header.deviceActive
        this.deviceEnable = data.data.header.deviceEnable
        this.msgCount = data.data.header.msgCount
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
