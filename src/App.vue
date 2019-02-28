<template>
  <div id="app">
    <RkHeader/>
    <router-view/>
    <RkFooter/>
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
export default class App extends Vue {
}
</script>
<style>
@import './assets/styles/reset.scss';
@import './assets/styles/lib.scss';
@import './assets/styles/style.scss';
@import './assets/styles/grid.scss';
#app,.container{
  height: 100%;
}
#app{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
