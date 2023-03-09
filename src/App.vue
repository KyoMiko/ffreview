<script setup>
import ReviewPlayer from './components/ReviewPlayer.vue'
import StreamList from "@/components/StreamList.vue";
import LogList from "@/components/LogList.vue";
</script>

<template>
  <div class="app_container">
    <div class="common_layout">
      <el-container class="el_container">
        <el-aside width="25%">
          <el-container>
            <el-header height="400px" style="padding: 2px">
              <stream-list style="height: 95%;width: 100%"/>
            </el-header>
            <el-footer height="calc(95% - 400px)" style="padding: 2px">
              <log-list style="height: 95%;width: 100%"/>
            </el-footer>
          </el-container>
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
</style>
