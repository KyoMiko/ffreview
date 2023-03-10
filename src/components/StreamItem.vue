<template>
<el-container>
  <el-main>
    <div>{{streamName}}</div>
  </el-main>
  <el-aside style="display: flex;flex-wrap: wrap;align-content: center;justify-content: center">
    <el-icon @click="onStreamSelect"><VideoPlay /></el-icon>
    <el-icon @click="onSettingClicked"><Setting /></el-icon>
    <el-icon @click="onDeleteClicked"><Delete /></el-icon>
  </el-aside>
</el-container>
</template>

<script>
import {ElMessage} from "element-plus";
export default {
  name: "StreamItem",
  data() {
    return {
      streamName: "",
      baseUrl: "",
      privateKey: "",
      latency: 0
    }
  },
  props: {
    id: Number
  },
  methods: {
    saveStream() {
      return {
        id: this.id,
        streamName: this.streamName,
        baseUrl: this.baseUrl,
        privateKey: this.privateKey,
        latency: this.latency
      }
    },
    loadStream(data) {
      for (let i = 0; i < data.length; i++) {
        let dataKey = data[i];
        if (dataKey.id == this.id) {
          this.streamName = dataKey.streamName;
          this.baseUrl = dataKey.baseUrl;
          this.privateKey = dataKey.privateKey;
          this.latency = dataKey.latency;
        }
      }
    },
    onSettingClicked() {
      this.$EventBus.emit('changeSetting',
          {
            id: this.id,
            streamName: this.streamName,
            baseUrl: this.baseUrl,
            privateKey: this.privateKey,
            latency: this.latency
          });
    },
    onDeleteClicked() {
      this.$EventBus.emit('deleteStream', this.id);
    },
    onStreamSelect() {
      this.$store.commit('setting/setBaseUrl', this.baseUrl);
      this.$store.commit('setting/setPrivateKey', this.privateKey);
      this.$store.commit('setting/setLatency', this.latency);
      this.$EventBus.emit('updateUrl');
      ElMessage('已选择\''+this.streamName+'\'直播源');
    },
    setStreamName(streamName) {
      this.streamName = streamName;
    },
    setBaseUrl(baseUrl){
      this.baseUrl = baseUrl;
    },
    setPrivateKey(privateKey){
      this.privateKey = privateKey;
    },
    setLatency(latency) {
      this.latency = latency;
    }
  }
}
</script>

<style scoped>

</style>