<template>
<el-card>
  <template #header>
    <div class="card-header">
      <span style="margin-right: 10px">直播列表</span>
      <el-button class="button" @click="addStream"><el-icon><Plus /></el-icon></el-button>
      <el-button class="button" @click="clearLocalStorage"><el-icon><Delete /></el-icon></el-button>
    </div>
  </template>
  <div v-show="!isSetting" style="height: 100%">
    <ul style="overflow: auto;height: 250px;padding-inline-start: 5px">
      <li v-for="id in list" :key="id" style="list-style: none;box-shadow: -2px 2px 5px gray;margin-bottom: 5px">
        <stream-item ref="streamList" :id="id"></stream-item>
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
      <el-button @click="updateSetting">提交</el-button>
      <el-button @click="isSetting=!isSetting">取消</el-button>
    </el-form>
  </div>
</el-card>
</template>

<script>
import StreamItem from "@/components/StreamItem.vue";
import {nextTick} from "vue";
export default {
  name: "StreamList",
  components: {StreamItem},
  data() {
    return {
      list: [],
      count: 0,
      isSetting: false,
      setting: {
        id:-1,
        streamName: "",
        baseUrl: "",
        privateKey: ""
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
    },
    updateSetting() {
      const streamList = this.$refs.streamList;
      const index = this.list.indexOf(this.setting.id);
      const streamItem = streamList[index];
      streamItem.setStreamName(this.setting.streamName);
      streamItem.setBaseUrl(this.setting.baseUrl);
      streamItem.setPrivateKey(this.setting.privateKey);
      this.isSetting = false;
      this.saveStreamList();
    },
    deleteStreamCallBack(data) {
      this.list.splice(this.list.indexOf(data),1);
      this.saveStreamList();
    },
    addStream() {
      this.list.push(this.count);
      nextTick(() => {
        const streamList = this.$refs.streamList;
        const streamItem = streamList[streamList.length - 1];
        streamItem.setStreamName('请设置直播信息');
        this.count++;
        this.saveStreamList();
      })
    },
    saveStreamList() {
      const streamList = this.$refs.streamList;
      let streamArray = [];
      console.log(streamList.length)
      for (let i = 0; i < streamList.length; i++) {
        const streamItem = streamList[i];
        streamArray.push(streamItem.saveStream());
      }
      localStorage.setItem("streamArray",JSON.stringify(streamArray));
      localStorage.setItem("count",this.count);
      localStorage.setItem("list",JSON.stringify(this.list));
    },
    clearLocalStorage() {
      localStorage.clear();
      location.reload();
    }
  },mounted() {
    this.$EventBus.on('changeSetting',this.changeSettingCallBack)
    this.$EventBus.on('deleteStream',this.deleteStreamCallBack)
    this.list = JSON.parse(localStorage.getItem("list"));
    this.list = this.list ? this.list : [];
    this.count = parseInt(localStorage.getItem("count"));
    this.count = this.count ? this.count : 0;
    let streamArray = JSON.parse(localStorage.getItem("streamArray"));
    if (streamArray) {
      nextTick(()=>{
        const streamList = this.$refs.streamList;
        for (let i = 0; i < streamList.length; i++) {
          const streamItem = streamList[i];
          streamItem.loadStream(streamArray);
        }
      })
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar{
  display: none;
}
</style>