<template>
<el-card class="card" shadow="hover">
  <div class="stream-item">
    <span class="stream-name">{{streamName}}</span>
    <el-button-group>
      <el-button @click="onStreamSelect" :loading="isPlaying" loading-icon="Select" icon="VideoPlay" round></el-button>
      <el-button @click="onSettingClicked"  round><el-icon><Setting /></el-icon></el-button>
      <el-button @click="onDeleteClicked" round><el-icon><Delete /></el-icon></el-button>
    </el-button-group>
  </div>
</el-card>
</template>

<script>
import {ElMessage} from "element-plus";
export default {
  name: "StreamItem",
  data() {
    return {

    }
  },
  props: {
    id: Number,
    streamName: String,
    baseUrl: String,
    privateKey: String,
    latency: Number,
    isPlaying: Boolean
  },
  methods: {
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
      this.$EventBus.emit('streamSelected', this.id);
      this.$EventBus.emit('updateUrl');
      ElMessage('已选择\''+this.streamName+'\'直播源');
    }
  }
}
</script>

<style scoped>
.stream-item{
  display: flex;
  justify-content: space-between;
}
.stream-name{
  line-height: 30px;
}

.card{
  margin-bottom: 1em;
}
</style>

<style>
.card > .el-card__body{
  padding: 0.5em 1em 0.5em 1em !important;
}
.is-loading {
  -webkit-animation: none !important;
  animation: none !important;
}
</style>