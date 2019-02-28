<template>
  <aside class="link-topo-aside">
    <svg class="link-topo-aside-btn icon cp lg" @click="show = !show" :style="`left:${show?290:0}px;transform: rotate(${show?0 : 180}deg);`">
      <use xlink:href="#chevron-left"></use>
    </svg>
    <div class="link-topo-aside-box"  v-if="!stateTopo.currentNode.name && show">
      <div class="mb-20">
        <span class="b dib mr-20">All Services</span>
      </div>
      <div class="mb-10" v-for="(val, key, index) in types" :key="index">
        <span class="r">{{val}}</span>
        <span class="grey">{{key}}</span>
      </div>
    </div>
    <div class="link-topo-aside-box" v-else-if="show">
      <div class="mb-20">
        <span class="b dib mr-20">Service Detail</span>
      </div>
      <div class="mb-10">
        <span class="label grey">Name</span>
        <span class="content">{{stateTopo.currentNode.name}}</span>
      </div>
      <div class="mb-10">
        <span class="label grey">Type</span>
        <span class="content">{{stateTopo.currentNode.type}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.cpm">
        <span class="label grey">Cpm</span>
        <span class="content">{{stateTopo.currentNode.cpm}}</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.sla">
        <span class="label grey">SLA</span>
        <span class="content">{{stateTopo.currentNode.sla || ''}}%</span>
      </div>
      <div class="mb-10" v-if="stateTopo.currentNode.latency">
        <span class="label grey">Latency</span>
        <span class="content">{{stateTopo.currentNode.latency}} ms</span>
      </div>
    </div>
  </aside>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import topo, { State as topoState} from '@/store/modules/topo';
import { State } from 'vuex-class';

@Component
export default class Topology extends Vue {
  @State('rocketTopo') public stateTopo!: topoState;
  get types() {
    const result: any = {};
    this.stateTopo.nodes.forEach((i: any) => {
      if (result[i.type]) {
        result[i.type] += 1;
      } else {
        result[i.type] = 1;
      }
    });
    return result;
  }
  private show: boolean = true;
}
</script>
<style lang="scss">
.link-topo-aside{
  width: 280px;
  position: absolute;
  z-index: 2;
  left: 20px;
  top: 30px;
  .to-apm{
    padding-top: 10px;
    border-top: 1px solid #d8d8d866;
  }
}
.link-topo-aside-btn{
  display:block;
  position:absolute;
  background: #252a2f9a;
  color: #ddd;
  border-radius: 4px 4px 4px 4px;
  text-align: center;
  padding: 10px;
}
.link-topo-aside-box{
  border-radius: 4px;
  color: #ddd;
  background-color: #252a2f9a;
  padding: 15px 20px 10px;
  .label{
    display: inline-block;
    width: 40%;
  }
  .content{
    vertical-align: top;
    display: inline-block;
    width: 60%;
  }
  .circle{
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #EE5B5B;
    margin-top: 6px;
  }
}
</style>
