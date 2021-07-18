<template>
  <div class="container">
    <el-row :gutter="24" style="margin-top: 5px; margin-bottom: 5px">
      <el-col :span="24">
        <el-card shadow="always">
          <el-input
            v-model="search.taskName"
            class="search"
            style="width: 230px"
            clearable
            placeholder="任务名称"
          />
          <el-input
            v-model="search.firmwareName"
            style="width: 230px"
            clearable
            placeholder="固件名称"
          />
          <el-input
            v-model="search.deviceCode"
            style="width: 230px"
            clearable
            placeholder="设备编码"
          />
          <el-button type="primary" icon="el-icon-search" @click="handleSearch"
            >搜索</el-button
          >
        </el-card>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      border
      class="table"
      header-cell-class-name="table-header"
    >
      <el-table-column prop="firmwareName" label="固件名称" align="center" />
      <el-table-column prop="messageId" label="消息ID" align="center" width="200px"/>
      <el-table-column
        prop="taskId"
        v-if="false"
        label="任务ID"
        align="center"
      />
      <el-table-column prop="taskName" label="任务" align="center" />
      <el-table-column prop="firmwareVersion" label="固件版本" align="center" />
      
      <el-table-column prop="deviceCode" label="设备编码" align="center" />
      <el-table-column
        prop="upgradeStatus"
        v-if="false"
        label="状态编码"
        align="center"
      />
      <el-table-column
        prop="upgradeStatusMsg"
        label="状态"
        align="center"
        :formatter="formatUpgrageStatus"
      />
      <el-table-column prop="detail_msg" label="描述" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
      <el-table-column prop="updateTime" label="更新时间" align="center" />
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
import { taskDetailSearchApi } from "../../../api/firmwaretask";

export default {
  data() {
    return {
      tableData: [],
      search: {
        firmwareName: undefined,
        taskName: undefined,
        deviceCode: undefined,
      },
      query: {
        limit: 10,
        pageNo: 1,
        paramData: {
          firmwareName: undefined,
          taskId: this.taskId,
          deviceCode: undefined,
        },
      },
      total: 0,
      pageSizes: [10, 20, 30, 50, 60, 100],
    };
  },
  created(){
    this.getData()
  },
  methods: {
    getData() {
      let param = this.query
      this.query.paramData = this.search
      taskDetailSearchApi(param).then((res) => {
        const retValue = res.data;
        this.tableData = retValue.resultData;
        this.total = retValue.total;
      });
    },
    handleSearch() {
      this.getData();
    },
    handlePageChange(val) {
      this.$set(this.query, "pageNo", val);
      this.getData();
    },
    sizeChange(val) {
      this.$set(this.query, "limit", val);
      this.getData();
    },
    formatUpgrageStatus(row) {
      if (row.upgradeStatus === 0) {
        return "等待升级";
      } else if (row.upgradeStatus === 1) {
        return "已发送设备";
      } else if (row.upgradeStatus === 2) {
        return "设备已接收";
      }else if (row.upgradeStatus === 3) {
        return "升级成功";
      }else if (row.upgradeStatus === 4) {
        return "升级失败";
      }else if (row.upgradeStatus === 5) {
        return "停止推送";
      }
      return "未知状态";
    },
  },
};
</script>

<style>
</style>