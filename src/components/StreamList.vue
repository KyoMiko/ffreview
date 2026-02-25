<template>
<el-card class="stream-list">
  <template #header>
    <div class="card-header">
      <span class="header-text">直播列表</span>
      <el-button-group class="button-group">
        <el-button class="button" @click="addStream"><el-icon><Plus /></el-icon></el-button>
        <el-button class="button" @click="clearLocalStorage"><el-icon><Delete /></el-icon></el-button>
      </el-button-group>
    </div>
  </template>
  <div class="card-body">
    <el-scrollbar>
      <div v-show="!isSetting" >
        <ul style="padding-inline-start: 0px">
          <li v-for="streamItem in streamList" :key="streamItem.id" style="list-style: none; padding-right: 1em;">
            <stream-item ref="streamList" :id="streamItem.id" :stream-name="streamItem.streamName"
            :base-url="streamItem.baseUrl" :latency="streamItem.latency" :private-key="streamItem.privateKey"
            :is-playing="streamItem.id == selected"></stream-item>
          </li>
        </ul>
      </div>
      <div v-show="isSetting">
        <el-form :model="setting">
          <el-form-item label="直播名称">
            <el-input v-model="setting.streamName"/>
          </el-form-item>
          <el-form-item label="直播地址">
            <el-input v-model="setting.baseUrl"/>
          </el-form-item>
          <el-form-item label="阿里云密钥">
            <el-input v-model="setting.privateKey"/>
          </el-form-item>
          <el-form-item label="直播延迟">
            <el-input v-model="setting.latency" placeholder="可用此调节战斗开始时间错位，正负皆可，单位为秒"/>
          </el-form-item>
          <el-button @click="updateSetting">提交</el-button>
          <el-button @click="isSetting=!isSetting">取消</el-button>
        </el-form>
      </div>
    </el-scrollbar>
  </div>
</el-card>
</template>

<script>
import StreamItem from "@/components/StreamItem.vue";
import {nextTick} from "vue";
import {decodeStreamFromUrl} from "@/utils/shareUtils";
export default {
  name: "StreamList",
  components: {StreamItem},
  data() {
    return {
      streamList: [],
      isSetting: false,
      selected: -1, //选中的直播流的id
      setting: {
        id:-1,
        streamName: "",
        baseUrl: "",
        privateKey: "",
        latency: 0
      }
    }
  },
  methods: {
    changeSettingCallBack(data) {
      this.isSetting = true;
      this.setting.id = data.id;
      this.setting.streamName = data.streamName;
      this.setting.baseUrl = data.baseUrl;
      this.setting.privateKey = data.privateKey;
      this.setting.latency = data.latency;
    },
    updateSetting() {
      if(this.selected == this.setting.id) {
        this.selected = -1;
      }
      for (let i = 0; i < this.streamList.length; i++) {
        const streamItem = this.streamList[i];
        if (streamItem.id == this.setting.id) {
          streamItem.streamName = this.setting.streamName;
          streamItem.baseUrl = this.setting.baseUrl;
          streamItem.privateKey = this.setting.privateKey;
          streamItem.latency = this.setting.latency;
        }
      }
      this.isSetting = false;
      this.saveStreamList();
    },
    deleteStreamCallBack(data) {
      if(this.selected == data) {
        this.selected = -1;
      }
      for (let i = 0; i < this.streamList.length; i++) {
        const streamItem = this.streamList[i];
        if (streamItem.id == data) {
          this.streamList.splice(i,1);
        }
      }
      this.saveStreamList();
    },
    streamSelectedCallBack(data) {
      this.selected = data;
    },
    addStream() {
      const id = this.streamList.length ? parseInt(this.streamList[this.streamList.length - 1].id) + 1 : 1;
      let streamItem = {
        id: id,
        streamName: "请设置直播名称",
        baseUrl: "",
        privateKey: "",
        latency: 0
      };
      this.streamList.push(streamItem);
      this.saveStreamList();
    },
    saveStreamList() {
      localStorage.setItem("streamList",JSON.stringify(this.streamList));
    },
    clearLocalStorage() {
      localStorage.clear();
      location.reload();
    }
  },
  async mounted() {
    this.$EventBus.on('changeSetting',this.changeSettingCallBack)
    this.$EventBus.on('deleteStream',this.deleteStreamCallBack)
    this.$EventBus.on('streamSelected', this.streamSelectedCallBack);
    this.streamList = JSON.parse(localStorage.getItem("streamList"));
    this.streamList = this.streamList ? this.streamList : [];

    // 解析 URL 中的分享参数，自动添加并播放
    const sharedStream = decodeStreamFromUrl();
    if (sharedStream && sharedStream.baseUrl) {
      const existing = this.streamList.find(s => s.baseUrl === sharedStream.baseUrl);
      let targetId;
      if (existing) {
        targetId = existing.id;
      } else {
        const maxId = this.streamList.length ? Math.max(...this.streamList.map(s => s.id)) : 0;
        targetId = maxId + 1;
        this.streamList.push({
          id: targetId,
          streamName: sharedStream.streamName || '来自分享的直播源',
          baseUrl: sharedStream.baseUrl,
          privateKey: sharedStream.privateKey || '',
          latency: sharedStream.latency || 0
        });
        this.saveStreamList();
      }
      this.$store.commit('setting/setBaseUrl', sharedStream.baseUrl);
      this.$store.commit('setting/setPrivateKey', sharedStream.privateKey || '');
      this.$store.commit('setting/setLatency', sharedStream.latency || 0);
      await nextTick();
      this.$EventBus.emit('streamSelected', targetId);
      this.$EventBus.emit('updateUrl');
      history.replaceState({}, '', window.location.pathname);
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar{
  display: none;
}
.card-header{
  height: 40px;
  display: flex;
  justify-content: space-between;
}
.button-group{
  margin-bottom: 10px;
}
.header-text{
  line-height: 30px;
}

.card-body{
  height: 320px;
}

</style>

<style>
.el-card__header{
  padding-bottom: 0.5em !important; 
}

</style>