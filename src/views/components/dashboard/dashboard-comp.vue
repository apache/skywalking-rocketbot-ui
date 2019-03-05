<template>
  <div class="rk-dashboard-comp">
    <nav class="rk-dashboard-comp-nav mb-10">
      <a class="rk-dashboard-comp-nav-i b mr-20" v-if="value.length" @click="current = key" :class="{'active': key === current}" v-for="(value, key) in tree" :key="key">{{key}}</a>
    </nav>
    <div class="rk-dashboard-comp-wrapper">
      <div class="rk-dashboard-comp-i mr-5 mb-15" v-for="(i, index) in tree[current]" :key="index">
        <span class="b mr-5">{{i.o}}</span>
        <svg class="icon blue cp lg r" @click="ADD_COMP(i)">
          <use xlink:href="#file-addition"></use>
        </svg>
        <div class="mr-5">{{i.name}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class Comps extends Vue {
  @State('rocketComps') private rocketComps: any;
  @Mutation('ADD_COMP') private ADD_COMP: any;
  private current: string = 'Global';
  private get compType() {
    return this.rocketComps.tree[this.rocketComps.group].type;
  }
  private get tree() {
    const temp: any = {
      Global: [],
      Service: [],
      ServiceEndpoint: [],
      ServiceInstance: [],
      Proxy: [],
      ProxyEndpoint: [],
      ProxyInstance: [],
      Database: [],
    };
    this.rocketComps.data[this.compType].forEach((i: any) => {
      temp[i.o].push(i);
    });
    return temp;
  }
}
</script>

<style lang="scss" scoped>
.rk-dashboard-comp-nav{
  padding: 0 15px;
}
.rk-dashboard-comp-nav-i{
  display: inline-block;
  line-height: 30px;
  border-top: 2px;
  border-top-style: solid;
  color: rgba(61, 68, 79, .6);
  border-color: rgba(0, 0, 0, 0);
  will-change: border-color,color;
  transition: border-color .3s, color .3s;
  &:hover{
    color: inherit;
  }
  &.active{
    color: inherit;
    border-color: inherit;
  }
}
.rk-dashboard-comp {
  flex-shrink: 0;
  border-top: 1px solid #c1c5ca41;
  color: #515a6e;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  background-color: rgba(196, 200, 225, 0.2);
  .title{
    padding: 0 15px;
  }
}
.rk-dashboard-comp-wrapper{
  white-space: nowrap;
  overflow: auto;
  padding: 0 15px;
}
.rk-dashboard-comp-i{
  padding: 6px 10px;
  min-width: 100px;
  display: inline-block;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
}
</style>
