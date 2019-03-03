<template>
  <nav class="rk-dashboard-group">
    <span v-for="(i, index) in rocketComps.tree" :key="index" class="mr-15">
      <a class="rk-dashboard-group-i" @click="SET_CURRENTCOMP(index)" :class="{'active': rocketComps.current == index}">{{i.name}}</a>
      <svg v-if="rocketGlobal.edit" class="ml-5 icon cp red vm"  @click="DELETE_COMPTREE(index)">
        <use xlink:href="#file-deletion"></use>
      </svg>
    </span>
    <a class="rk-dashboard-group-add" v-clickout="handleHide" v-if="rocketGlobal.edit">
      <svg class="icon vm" @click="show=!show">
        <use xlink:href="#todo-add"></use>
      </svg>
      <div class="rk-dashboard-group-add-box" v-if="show">
        <div class="mb-10">
          <span class="vm">Create Tab</span>
          <a class="rk-btn r vm" @click="handleCreate">Confirm</a>
        </div>
        <div class="sm grey mb-5 mr-10">Tab Type</div>
        <select v-model="type" class="rk-dashboard-group-sel mb-5 long">
          <option value="Service">Service</option>
          <option value="Database">Database</option>
        </select>
        <div class="sm grey mb-5 mr-10">Tab Name</div>
        <input class="mb-10 rk-dashboard-group-input" type="text" v-model="name">
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
  private type: string = 'Service';
  private show: boolean = false;
  private handleHide() {
    this.name = '';
    this.show = false;
  }
  private handleCreate() {
    this.ADD_COMPTREE({name: this.name, type: this.type});
    this.handleHide();
  }
}
</script>

<style lang="scss" scoped>
.rk-dashboard-group{
  border-bottom:1px solid #252a2f;
  background-color: #333840;
  padding: 8px 15px;
  color: #eee;
}
.rk-dashboard-group-sel{
  outline: none;
  border: 0;
}
.rk-dashboard-group-add{
  position: relative;
}
.rk-dashboard-group-add-box{
  position: absolute;
  left: -10px;
  top: 35px;
  padding: 4px;
  z-index: 1;
  border-radius: 3px;
  color: #eee;
  background-color: #333840;
}
.rk-dashboard-group-add-box:after {
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
.rk-dashboard-group-input{
  border: 0;
  outline: 0;
  padding: 1px 8px;
  border-radius: 4px;
}
.rk-dashboard-group-i{
  display: inline-block;
  padding: 4px 12px 4px 14px;
  border-radius: 4px;
  position: relative;
  background-color: #484b55;
  font-size: 12.5px;
  will-change: border-color,color;
  transition: border-color .3s, color .3s;
  &.active::before{
    content: '';
    position: absolute;
    display: inline-block;
    width: 5px;
    height: 12px;
    border-radius: 3px;
    background-color: #458eff;
    top: 7px;
    left: 5px;
  }
}
</style>
