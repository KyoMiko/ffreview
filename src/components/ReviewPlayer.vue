<template>
  <easy-player :live="live" :videoUrl="url" style="height: 100%;width: 100%">
  </easy-player>
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