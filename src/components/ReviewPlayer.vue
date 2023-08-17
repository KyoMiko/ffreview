<template>
  <easy-player :live="live" :stretch="true" :videoUrl="url" alt="请选择直播源"></easy-player>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  name: "ReviewPlayer",
  data() {
    return {}
  },
  computed: {
    ...mapState({
      live: state => state.setting.aliyunols
    }),
    ...mapGetters({
      url: 'setting/streamUrl'
    })
  },
  mounted() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.$refs.video.pause();
      }
    })
  }
}
</script>

<style scoped>

</style>