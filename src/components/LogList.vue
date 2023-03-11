<template>
  <el-card class="log-list">
    <template #header>
      <div class="header-text">日志列表</div>
    </template>
    <div style="width: 100%">
      <el-date-picker
          v-model="dateTime"
          type="datetimerange"
          range-separator="到"
          start-placeholder="直播开始时间"
          end-placeholder="直播结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
          style="width: auto; margin-bottom: 10px;"
      />
      <el-input v-model="inputValue"  placeholder="获取指定logs，输入如7a2WG3nk9Dyx8q6V">
        <template #append>
          <el-button @click="updateCode"><el-icon><Search /></el-icon></el-button>
        </template>
      </el-input>

      <el-divider class="aside-divider"/>
      
      <el-scrollbar>
        <ul style="padding-inline-start: 0px; height: 220px;">
          <li v-for="fight in fights" :key="fight.startTime" style="list-style: none;padding-right: 1em;">
            <log-item ref="logList" :fight-name="fight.name" :start-time-unix="parseInt(fight.startTime) + startTime"
            :end-time-unix="parseInt(fight.endTime) + startTime" :difficulty="fight.difficulty"
            :is-playing="fight.id == selected" :id="fight.id"></log-item>
          </li>
        </ul>
      </el-scrollbar>
    </div>
  </el-card>
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
      inputValue:"",
      code:"",
      fights: [],
      startTime: 0,
      selected: -1
    }
  },
  methods: {
    updateCode: function () {
      this.selected = -1;
      if(this.code == this.inputValue) {
        this.$apollo.queries.logs.refetch();
      } else {
        this.code = this.inputValue;
      }
    },
    selectFightCallBack: function (data) {
      this.dateTime = data.time;
      this.selected = data.id;
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
        let allFights = [...newValue.report.fights];
        let fights = allFights.filter((a) => {
          return a.difficulty;
        })
        fights = fights.sort((a,b) => {
          return b.startTime - a.startTime
        });
        let trash = allFights.filter((a) => {
          return !a.difficulty;
        })
        trash = trash.sort((a,b) => {
          return b.startTime - a.startTime
        });
        this.fights = [...fights,...trash]
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
            fights{
              id,
              startTime,
              endTime,
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
.header-text{
  margin-bottom: 10px;
}

.aside-divider{
  margin: 12px 0;
}
</style>