<template>
<div id="app">
  <RkHeader @reloadFooter="reloadFooter"/>
  <router-view></router-view>
  <RkFooter ref="footer"/>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import RkHeader from '@/components/rk-header.vue';
import RkFooter from '@/components/rk-footer.vue';

@Component({
  components: {
    RkHeader, RkFooter,
  },
})
export default class RouterIndex extends Vue {
  private isRouterAlive: boolean = true;
   public reloadFooter(timeArray: Date[]): void {
     const footer: any = this.$refs.footer;
     footer.time = timeArray;
  }
}
</script>
