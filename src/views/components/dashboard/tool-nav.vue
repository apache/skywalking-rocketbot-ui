<template>
  <nav class="rk-dashboard-nav">
    <span v-for="(i, index) in rocketComps.tree[rocketComps.group].children" :key="index" class="mr-20">
      <a class="rk-dashboard-nav-i b" @click="SET_CURRENT_COMPS(index)" :class="{'active': rocketComps.current == index}">{{i.name}}</a>
      <svg v-if="rocketGlobal.edit" class="ml-5 icon cp red vm"  @click="DELETE_COMPS_TREE(index)">
        <use xlink:href="#file-deletion"></use>
      </svg>
    </span>
    <a class="rk-dashboard-nav-add" v-clickout="handleHide" v-if="rocketGlobal.edit">
      <svg class="icon vm" @click="show=!show">
        <use xlink:href="#todo-add"></use>
      </svg>
      <div class="rk-dashboard-nav-add-box" v-if="show">
        <div class="mb-10 vm">Create Tab</div>
        <div class="sm grey mb-5 mr-10">Tab Name</div>
        <input class="mb-10 rk-dashboard-nav-input" type="text" v-model="name">
        <a class="rk-btn r vm long tc" @click="handleCreate">Confirm</a>
      </div>
    </a>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop, Model } from 'vue-property-decorator';
import { State, Mutation } from 'vuex-class';

@Component
export default class ToolNav extends Vue {
  @Prop() private rocketGlobal: any;
  @Prop() private rocketComps: any;
  @Mutation('SET_CURRENT_COMPS') private SET_CURRENT_COMPS: any;
  @Mutation('DELETE_COMPS_TREE') private DELETE_COMPS_TREE: any;
  @Mutation('ADD_COMPS_TREE') private ADD_COMPS_TREE: any;
  private name: string = '';
  private show: boolean = false;
  private handleHide() {
    this.name = '';
    this.show = false;
  }
  private handleCreate() {
    this.ADD_COMPS_TREE({name: this.name});
    this.handleHide();
  }
}
</script>

<style lang="scss" scoped>
.rk-dashboard-nav{
  border-bottom:1px solid #c1c5ca00;
  box-shadow: 0 1px 0px rgba(0, 0, 0, 0.08);
  height: 40px;
  background-color: rgba(196, 200, 225, .2);
  padding: 0 15px;
}
.rk-dashboard-nav-sel{
  outline: none;
  border: 0;
}
.rk-dashboard-nav-add{
  position: relative;
}
.rk-dashboard-nav-add-box{
  position: absolute;
  left: -10px;
  top: 35px;
  padding: 10px 5px;
  z-index: 1;
  border-radius: 4px;
  color: #eee;
  background-color: #252a2f;
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.1), 0 1px 3px 0 rgba(0,0,0,.08);
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
  padding: 1px 8px;
  border-radius: 4px;
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
    color: #448dfe;
  }
  &.active{
    color: #448dfe;
    border-color: #448dfe;
  }
}
</style>
