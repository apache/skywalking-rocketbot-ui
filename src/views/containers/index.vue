<template>
<div id="app">
  <RkHeader/>
  <router-view></router-view>
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
export default class RouterIndex extends Vue {
}
</script>
