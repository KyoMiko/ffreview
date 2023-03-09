<template>
<el-card>
  <template #header>
    <div class="card-header">
      <span>直播列表</span>
      <el-button class="button" @click="addStream"><el-icon><Plus /></el-icon></el-button>
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
      this.setting.baseUrl = data.baseUrl?data.baseUrl:localStorage.getItem("baseUrl");
      this.setting.privateKey = data.privateKey?data.privateKey:localStorage.getItem("privateKey");
    },
    updateSetting() {
      const streamList = this.$refs.streamList;
      const index = this.list.indexOf(this.setting.id);
      const streamItem = streamList[index];
      streamItem.setStreamName(this.setting.streamName);
      streamItem.setBaseUrl(this.setting.baseUrl);
      streamItem.setPrivateKey(this.setting.privateKey);
      this.isSetting = false;
      localStorage.setItem("baseUrl",this.setting.baseUrl);
      localStorage.setItem("privateKey",this.setting.privateKey);
    },
    deleteStreamCallBack(data) {
      this.list.splice(this.list.indexOf(data),1);
    },
    addStream() {
      this.list.push(this.count);
      nextTick(() => {
        const streamList = this.$refs.streamList;
        const streamItem = streamList[streamList.length - 1];
        streamItem.setStreamName('请设置直播信息');
        this.count++;
      })
    }
  },mounted() {
    this.$EventBus.on('changeSetting',this.changeSettingCallBack)
    this.$EventBus.on('deleteStream',this.deleteStreamCallBack)
  }
}
</script>

<style scoped>
::-webkit-scrollbar{
  display: none;
}
</style>