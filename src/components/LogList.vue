<template>
  <div style="width: 100%">
    <el-date-picker
        v-model="dateTime"
        type="datetimerange"
        range-separator="到"
        start-placeholder="直播开始时间"
        end-placeholder="直播结束时间"
        value-format="YYYYMMDDHHmmss"
    />
  </div>
</template>

<script>
export default {
  name: "LogList",
  data() {
    return {
      dateTime:[]
    }
  },
  watch: {
    dateTime(newValue) {
      this.$store.commit('setting/setStartTime',newValue[0]);
      this.$store.commit('setting/setEndTime',newValue[1]);
      this.$EventBus.emit('updateUrl');
    }
  }
}
</script>

<style scoped>
.date_picker {
  width: calc(100% - 20px)
}
</style>