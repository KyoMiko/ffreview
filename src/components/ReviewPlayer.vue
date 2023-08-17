<template>
  <video controls ref="video" style="height: 100%;width: 100%"></video>
</template>

<script>
import Hls from 'hls.js/dist/hls.min';

export default {
  name: "ReviewPlayer",
  data() {
    return {
      hls: new Hls()
    }
  },
  methods: {
    updateUrl: function () {
      this.hls.destroy();
      this.hls = new Hls();
      const url = this.$store.getters['setting/streamUrl'];
      console.log(url)
      this.hls.loadSource(url);
      this.hls.attachMedia(this.$refs.video);
    }
  },
  mounted() {
    this.$EventBus.on('updateUrl',this.updateUrl);
    document.addEventListener("visibilitychange",()=>{
      if (document.hidden) {
        this.$refs.video.pause();
      }
    })
  }
}
</script>

<style scoped>

</style>