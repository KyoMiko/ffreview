<template>
  <el-container>
    <el-main>
      <div>{{fightName}}</div>
    </el-main>
    <el-aside style="display: flex;flex-wrap: wrap;align-content: center;justify-content: center">
      {{fightLength}}
      <el-icon @click="onFightSelect"><VideoPlay /></el-icon>
    </el-aside>
  </el-container>
</template>

<script>
export default {
  name: "LogItem",
  data() {
    return {

    }
  },
  props: {
    fightName: String,
    startTimeUnix: Number,
    endTimeUnix: Number
  },methods: {
    onFightSelect: function () {
      this.$EventBus.emit('selectFight',[this.startTimeHuman,this.endTimeHuman]);
    },
    unixToHuman: function (date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let day = date.getDate();
      day = day < 10 ? "0" + day : day;
      let hour = date.getHours();
      hour = hour < 10 ? "0" + hour : hour;
      let min = date.getMinutes();
      min = min < 10 ? "0" + min : min;
      let second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return `${year}${month}${day}${hour}${min}${second}`
    }
  },
  computed: {
    fightLength () {
      let ms = this.endTimeUnix - this.startTimeUnix;
      let m = parseInt(ms / 1000 / 60 % 60);
      let s = parseInt(ms / 1000  % 60);
      m = m < 10 ? "0" + m : m;
      s = s < 10 ? "0" + s : s;
      return `${m}:${s}`
    },
    startTimeHuman () {
      return this.unixToHuman(new Date(this.startTimeUnix));
    },
    endTimeHuman () {
      return this.unixToHuman(new Date(this.endTimeUnix));
    }
  }
}
</script>

<style scoped>

</style>