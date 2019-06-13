<template>
<div class="dashboard-container">
  <div style="position: relative;">
    <DashboardItem :rocketGlobal="rocketGlobal" v-for="(i, index) in this.rocketComps.tree[this.rocketComps.group]
    .children[this.rocketComps.current].children" :key="index" :index="index"  :i="i"/>
  </div>
</div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import DashboardItem from './dashboard-item.vue';
@Component({
  components: { DashboardItem },
})
export default class Dashboard extends Vue {
  @Prop() private rocketComps!: any;
  @Prop() private rocketGlobal!: any;
}

</script>
<style lang="scss">
</style>
