<template>
  <div class="container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="基本信息"  name="baseInfo">
        <detail-page ref="detailPage" :firmwareId="firmwareId" />
      </el-tab-pane>
      <el-tab-pane label="任务" name="task">
        <task-page ref="taskPage" :firmwareId="firmwareId" />
      </el-tab-pane>
      <el-tab-pane label="记录" name="history">
        <history-page ref="historyPage"  />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DetailPage from "./component/detailPage.vue";
import HistoryPage from "./component/historyPage.vue";
import TaskPage from "./component/taskPage.vue";
import { firmwareSearchApi, firmwareInfoApi, firmwareCreateApi, firmwareUpdateApi, firmwareDeleteApi } from '../../api/firmware'

export default {
  components: { DetailPage,TaskPage,HistoryPage},
  data() {
    return {
      activeName: "baseInfo",
      firmwareId: this.$route.query.firmid
    };
  },
  watch: {
    $route: {
      handler() {
        this.firmwareId =  this.$route.query.firmid;
        // 深度监听，同时也可监听到param参数变化
      },
      deep: true,
    },
  } /** ends watch*/,
  created(){ 
     this.getDetail()
      
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name === "baseInfo") {
        //this.$message.success("task " + this.firmwareId);
        this.getDetail()
      } else if (tab.name === "task") {
         this.$nextTick(() => {
          this.$refs.taskPage.getData()
       })
      } else if (tab.name === "history") {
        this.$nextTick(() => {
          this.$refs.historyPage.getData()
       })
      }
    },/**ends handleClick*/
    getDetail(){
       this.$nextTick(() => {
          this.$refs.detailPage.getData()
       })
    
    },
  },
};
</script>

<style>
</style>