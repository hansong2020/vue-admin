<template>
  <div>
      <a-descriptions title="固件信息" bordered>
      <a-descriptions-item label="固件名称">
        {{ firmwareInfo.firmwareName }}
      </a-descriptions-item>
      <a-descriptions-item label="所属产品">
        {{ firmwareInfo.productName }}
      </a-descriptions-item>
      <a-descriptions-item label="版本">
        {{ firmwareInfo.firmwareVersion }}
      </a-descriptions-item>
      <a-descriptions-item label="版本序号">
        {{ firmwareInfo.seqNo }}
      </a-descriptions-item>
      <a-descriptions-item label="签名">
        {{ firmwareInfo.signCode }}
      </a-descriptions-item>
      <a-descriptions-item label="升级方式">
        {{ firmwareInfo.pushTypeMsg }}
      </a-descriptions-item>
      </a-descriptions>
  </div>
</template>

<script>
import { firmwareSearchApi, firmwareInfoApi, firmwareCreateApi, firmwareUpdateApi, firmwareDeleteApi } from '../../../api/firmware'
export default {
  props:{
    firmwareId: {
      type: String,
      default: '0'
    },
  },
  data(){
    return {
      firmwareInfo: {}
    }
  },
  methods:{
    getData(){
       firmwareInfoApi(this.firmwareId).then(res => {
          this.firmwareInfo = res.data
           
          if(1 === this.firmwareInfo.pushType){
              this.firmwareInfo.pushTypeMsg = 'url升级'
          }else if(2 === this.firmwareInfo.pushType){
             this.firmwareInfo.pushTypeMsg = 'Base64升级'
          }else if(3 === this.firmwareInfo.pushType){
             this.firmwareInfo.pushTypeMsg = '混合升级'
          }
      })
    }/**ends getData*/
  }
}
</script>

<style>

</style>