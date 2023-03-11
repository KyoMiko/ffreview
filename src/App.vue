<script setup>
import ReviewPlayer from './components/ReviewPlayer.vue'
import StreamList from "@/components/StreamList.vue";
import LogList from "@/components/LogList.vue";
</script>

<template>
  <div class="app_container">
    <div class="common_layout">
      <el-container class="el_container">
        <el-aside width="25%" class="aside-area">
          <div class="logo-area">
            <img src="/favicon.ico">
            <div class="logo-text">狒狒回放</div>
          </div>

          <el-divider class="aside-divider"/>

          <div class="stream-list"> 
              <stream-list/>
          </div>

          <!-- <el-divider class="aside-divider"/> -->

          <div class="log-list">
            <log-list/>
          </div>

        </el-aside>
        <el-main>
          <review-player style="height: 95%;width: 100%"/>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<style scoped>
html,
body,
#app,
.el_container,
.app_container,
.common_layout{
  height: 100vh;
}
.stream-list{
  height: 400px;
  padding: 2px;
  margin-bottom: 1em;
}
.aside-area{
  background-color: #202020;
  padding-right: 0.5em;
  padding-left: 0.5em;
}
.aside-divider{
  margin: 12px 0;
}
.logo-area{
  height: 30px;
  line-height: 40px;
  padding: 2px;
  display: flex;
  flex-direction: row;
  padding-top: 10px;
}

.logo-text{
  line-height: 30px;
  padding-left: 6px;
}

.log-list{
  height:auto;
  max-height: calc(90% - 450px);
  padding: 2px;
  margin-bottom: 2em;
}
</style>
