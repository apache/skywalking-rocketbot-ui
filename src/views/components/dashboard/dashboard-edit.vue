<template>
  <rk-sidebox :show.sync="rocketGlobal.edit">
    <h5 class="rk-dashboard-edit-title mb-5 mt-0">Preview</h5>
    <component style="height:140px" :is="currentItem.c"></component>
    <h5 class="rk-dashboard-edit-title mb-5">Title</h5>
    <input type="text" 
    :value="currentItem.t" 
    @change="EDIT_COMP({index:rocketComps.index,type:'t',value:$event.target.value})"
    class="rk-dashboard-edit-input">
    <h5 class="rk-dashboard-edit-title mb-5">Charts</h5>
    <div>
      <img class="rk-dashboard-edit-chart" @click="EDIT_COMP({index:rocketComps.index,type:'c',value:key})" :class="{'active':currentItem.c === key}" v-for="(i, key, index) in chartImgs" :key="index" :src="i">
    </div>
    <h5 class="rk-dashboard-edit-title mb-5">Sources</h5>
    <nav class="mb-15">
      <a class="rk-dashboard-edit-nav-i b mr-20" v-if="value.length" 
      @click="current = key;configMode = false" :class="{'active': key === current}" 
      v-for="(value, key) in tree" :key="key">{{$t(key.toLowerCase())}}</a>
    </nav>
    <div>
      <div @click="EDIT_COMP({index:rocketComps.index,type:'d',value:i});handleRefresh()" 
      class="rk-dashboard-edit-i cp mr-10 mb-10"
      :class="{active: currentItem.d === i }"
      v-for="(i, index) in tree[current]" :key="index">{{i}}</div>
    </div>
  </rk-sidebox>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import data from '@/store/modules/dashboard/fragments';
import { State as RocketOptionState } from '@/store/modules/dashboard/modules/dashboard-option';
import { Mutation, Action, State, Getter } from 'vuex-class';
import charts from './charts';

@Component({
  components: { ...charts },
})
export default class DashboardEdit extends Vue {
  @Prop() private rocketGlobal!: any;
  @Prop() private rocketComps!: any;
  @Getter('durationTime') private durationTime: any;
  @State('rocketOption') private stateDashboardOption!: RocketOptionState;
  @Mutation('EDIT_COMP') private EDIT_COMP: any;
  @Action('GET_QUERY') private GET_QUERY: any;
  private showDetail = true;
  private chartImgs: any = {
    ChartNum: require('@/assets/img/num.png'),
    ChartLine: require('@/assets/img/line.png'),
    ChartBar: require('@/assets/img/bar.png'),
    ChartHeatmap: require('@/assets/img/heatmap.png'),
    ChartSankey: require('@/assets/img/sankey.png'),
    ChartSlow: require('@/assets/img/slow.png'),
    ChartTrace: require('@/assets/img/trace.png'),
  };
  private dataSource = Object.keys(data);
  private current: string = 'global';
  private configMode: boolean = false;
  private get currentItem() {
    return this.rocketComps.tree[this.rocketComps.group]
    .children[this.rocketComps.current].children[this.rocketComps.index];
  }
  private get tree() {
    const temp: any = {
      global: [],
      service: [],
      endpoint: [],
      instance: [],
      database: [],
    };
    this.dataSource.forEach((i: any) => {
      if (i.indexOf('global') === 0) {
        temp.global.push(i);
      } else if (i.indexOf('service') === 0) {
        temp.service.push(i);
      } else if (i.indexOf('endpoint') === 0) {
        temp.endpoint.push(i);
      } else if (i.indexOf('instance') === 0) {
        temp.instance.push(i);
      } else {
        temp.database.push(i);
      }
    });
    return temp;
  }
    private handleRefresh() {
    this.GET_QUERY({
      serviceId: this.stateDashboardOption.currentService.key,
      endpointId: this.stateDashboardOption.currentEndpoint.key,
      endpointName: this.stateDashboardOption.currentEndpoint.label,
      instanceId: this.stateDashboardOption.currentInstance.key,
      databaseId: this.stateDashboardOption.currentDatabase.key,
      duration: this.durationTime,
    });
  }
}

</script>
<style lang="scss">
.rk-dashboard-edit-title::before{
  content: '•';
  color: #448dfe;
  margin-right: 5px;
  margin-top: 15px;
}
.rk-dashboard-edit-nav-i{
  display: inline-block;
  line-height: 30px;
  border-bottom: 2px;
  border-bottom-style: solid;
  color: rgba(61, 68, 79, .6);
  border-color: rgba(0, 0, 0, 0);
  will-change: border-color,color;
  transition: border-color .3s, color .3s;
  &:hover{
    color: #448dfe;
  }
  &.active{
    color: #448dfe;
    border-color: #448dfe;
  }
}
.rk-dashboard-edit-chart{
  height: 50px;
  padding: 5px;
  margin-right: 8px;
  border-radius: 4px;
  border: 2px solid #fff;
  cursor: pointer;
  &.active{
    border-color: #448dfe;
  }
}
.rk-dashboard-edit {
  flex-shrink: 0;
  border-top: 1px solid #c1c5ca41;
  color: #515a6e;
  box-shadow: 0 2px 2px 0 rgba(26, 24, 29, 0.15), 0 1px 4px 0 rgba(26, 24, 29, 0.1);
  background-color: rgba(196, 200, 225, 0.2);
  .title{
    padding: 0 15px;
  }
}
.rk-dashboard-edit-i{
  padding: 6px 10px;
  min-width: 100px;
  display: inline-block;
  border-radius: 3px;
  background-color: rgba(196,200,225,.2);
  &.active{
    color: #fff;
    background-color: #515a6e;
  }
}
.rk-dashboard-edit-input{
  border-radius: 4px;
  border: 1px solid rgba(196, 200, 225, 0.6);
  outline: 0;
  width: 100%;
  padding: 3px 5px;
}
</style>
