<template>
  <router-view></router-view>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
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
