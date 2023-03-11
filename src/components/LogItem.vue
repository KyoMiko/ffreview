<template>
<el-card class="card" shadow="hover">
  <div class="log-item">
    <span class="log-name">{{fightNameWithTrash}}</span>
    <el-button-group>
      <el-button @click="onFightSelect" :class="isPlaying ? 'is-loading' : ''" round>
        {{fightLength}}&nbsp;
        <el-icon v-show="isPlaying"><Select /></el-icon>
        <el-icon v-show="!isPlaying"><CaretRight /></el-icon>
      </el-button>
    </el-button-group>
  </div>
</el-card>
</template>

<script>
export default {
  name: "LogItem",
  data() {
    return {

    }
  },
  props: {
    id: Number,
    fightName: String,
    startTimeUnix: Number,
    endTimeUnix: Number,
    difficulty: String,
    isPlaying: Boolean
  },methods: {
    onFightSelect: function () {
      this.$EventBus.emit('selectFight',{time:[this.startTimeHuman,this.endTimeHuman],id: this.id});
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
      return `${year}-${month}-${day} ${hour}:${min}:${second}`
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
      return this.unixToHuman(new Date(this.startTimeUnix - 30000));
    },
    endTimeHuman () {
      return this.unixToHuman(new Date(this.endTimeUnix + 10000));
    },
    fightNameWithTrash () {
      return this.difficulty ? this.fightName : this.fightName + ' (Trash)'
    }
  }
}
</script>

<style scoped>
.log-item{
  display: flex;
  justify-content: space-between;
}
.log-name{
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
</style>