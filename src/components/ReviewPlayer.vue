<template>
  <div id="video" style="height: 100%;width: 100%"></div>
</template>

<script>
import Player, { Events } from 'xgplayer';
import HlsPlugin from 'xgplayer-hls'
import FlvPlugin from 'xgplayer-flv'
import 'xgplayer/dist/index.min.css';

export default {
  name: "ReviewPlayer",
  data() {
    return {
      player: null,
      isPip: false
    }
  },
  methods: {
    updateUrl: function () {
      debugger
      const url = this.$store.getters['setting/streamUrl'];
      const isLive = this.$store.getters['setting/isLive'];
      const type = this.$store.getters['setting/type'];
      let plugins = [];
      switch (type) {
        case 'hls':
          plugins = [HlsPlugin];
          break;
        case 'http-flv':
          plugins = [FlvPlugin];
          break;
        default:
          plugins = [];
          break;
      }
      if(this.player) {
        this.player.destroy();
      }
      this.player = new Player({
        id: 'video',
        height: '100%',
        width: '100%',
        lang: 'zh-cn',
        autoplay: true,
        pip: true,
        keyShortcut: "on",
        url: url,
        isLive: isLive,
        plugins: plugins
      })
      this.player.on(Events.LOADED_DATA, () => {
        if (!this.player.config.isLive) {
          const duration = this.player.duration
          const progress = this.player.getPlugin('progresspreview');
          progress.deleteAllDots();
          progress.createDot({
            id: 1,
            time: 30,
            text: '战斗开始'
          });
          progress.createDot({
            id: 2,
            time: parseInt((duration - 10) + ""),
            text: '战斗结束'
          });
        }
      })
      this.player.on(Events.PIP_CHANGE, (isPip)=> {
        this.isPip = isPip;
      })
    }
  },
  mounted() {
    this.$EventBus.on('updateUrl', this.updateUrl);
    document.addEventListener("visibilitychange", () => {
      if (this.isPip) {
        return;
      }
      if (document.hidden) {
        this.player.pause();
      } else {
        this.player.play();
      }
    })
  }
}
</script>

<style scoped>

</style>
