<template>
  <nav class="rk-dashboard-nav">
    <span v-for="(i, index) in rocketComps.tree" :key="index" class="mr-20">
      <a class="rk-dashboard-nav-i b" @click="SET_CURRENTCOMP(index)" :class="{'active': rocketComps.current == index}">{{i.name}}</a>
      <svg v-if="rocketGlobal.edit" class="ml-5 icon cp vm"  @click="DELETE_COMPTREE(index)">
        <use xlink:href="#file-deletion"></use>
      </svg>
    </span>
    <a class="rk-dashboard-nav-add" v-clickout="handleHide" v-if="rocketGlobal.edit">
      <svg class="icon vm" @click="show=!show">
        <use xlink:href="#todo-add"></use>
      </svg>
      <div class="rk-dashboard-nav-add-box" v-if="show">
        <div class="mb-5">New Tab</div>
        <input @keydown.enter="ADD_COMPTREE(name);handleHide()" class="rk-dashboard-nav-input" type="text" v-model="name">
      </div>
    </a>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component({})
export default class DashboardNav extends Vue {
  @State('rocketbot') private rocketGlobal: any;
  @State('rocketComps') private rocketComps: any;
  @Mutation('SET_CURRENTCOMP') private SET_CURRENTCOMP: any;
  @Mutation('DELETE_COMPTREE') private DELETE_COMPTREE: any;
  @Mutation('ADD_COMPTREE') private ADD_COMPTREE: any;
  private name: string = '';
  private show: boolean = false;
  private handleHide() {
    this.name = '';
    this.show = false;
  }
}
</script>

<style lang="scss" scoped>
.rk-dashboard-nav{
  border-bottom:1px solid #c1c5ca41;
  height: 40px;
  background-color: rgba(196, 200, 225, .2);
  padding: 0 15px;
}
.rk-dashboard-nav-add{
  position: relative;
}
.rk-dashboard-nav-add-box{
  position: absolute;
  left: -10px;
  top: 35px;
  padding: 4px;
  z-index: 1;
  border-radius: 3px;
  color: #eee;
  background-color: #333840;
}
.rk-dashboard-nav-add-box:after {
	bottom: 100%;
	left: 10px;
	border: solid transparent;
	content: " ";
	height: 0;
	width: 0;
	position: absolute;
	pointer-events: none;
	border-color: rgba(136, 183, 213, 0);
	border-bottom-color: #333840;
	border-width: 8px;
	margin-left: 0px;
}
.rk-dashboard-nav-input{
  border: 0;
  outline: 0;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #40454e;
  color: #eee;
}
.rk-dashboard-nav-i{
  display: inline-block;
  height: 41px;
  line-height: 40px;
  border-bottom: 2px;
  border-bottom-style: solid;
  color: rgba(61, 68, 79, .6);
  border-color: rgba(0, 0, 0, 0);
  will-change: border-color,color;
  transition: border-color .3s, color .3s;
  &:hover{
    color: #458eff;
  }
  &.active{
    color: #458eff;
    border-color: #458eff;
  }
}
</style>
