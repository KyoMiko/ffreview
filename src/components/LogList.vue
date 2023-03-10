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
    <el-input v-model="inputValue"></el-input>
    <el-button @click="updateCode">查询</el-button>
    <ul style="overflow: auto;height: 250px;padding-inline-start: 5px">
      <li v-for="fight in fights" :key="fight.startTime" style="list-style: none;box-shadow: -2px 2px 5px gray;margin-bottom: 5px">
        <log-item ref="logList" :fight-name="fight.name" :start-time-unix="parseInt(fight.startTime) + startTime"
        :end-time-unix="parseInt(fight.endTime) + startTime"></log-item>
      </li>
    </ul>
  </div>
</template>

<script>
import gql from "graphql-tag";
import LogItem from "@/components/LogItem.vue";
import {nextTick} from "vue";
export default {
  name: "LogList",
  components: {LogItem},
  data() {
    return {
      dateTime:[],
      inputValue:"7a2WG3nk9Dyx8q6V",
      code:"",
      fights: [],
      startTime: 0
    }
  },
  methods: {
    updateCode: function () {
      this.code = this.inputValue;
    },
    selectFightCallBack: function (data) {
      this.dateTime = data
    }
  },
  watch: {
    dateTime(newValue) {
      this.$store.commit('setting/setStartTime',newValue[0]);
      this.$store.commit('setting/setEndTime',newValue[1]);
      this.$EventBus.emit('updateUrl');
    },
    logs(newValue) {
      if (newValue) {
        let fights = [...newValue.report.fights];
        fights = fights.filter((a) => {
          return a.difficulty != null;
        })
        this.fights = fights.sort((a,b) => {
          return b.startTime - a.startTime
        });
        this.startTime = newValue.report.startTime;
      }
    }
  },
  apollo: {
    logs: {
      query: gql`query logs($code: String!) {
        reportData {
          report(code: $code) {
            startTime,
            endTime,
            fights{
              startTime,
              endTime,
              bossPercentage,
              fightPercentage,
              name,
              difficulty
            }
          }
        }
      }`,
      variables () {
        return {
          code: this.code
        }
      },
      update: data => data.reportData
    }
  },mounted() {
    this.$EventBus.on('selectFight',this.selectFightCallBack);
  }
}
</script>

<style scoped>
.date_picker {
  width: calc(100% - 20px)
}
</style>