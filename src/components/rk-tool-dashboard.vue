<template>
  <rk-toolbar :style="`transform: translate(-50%, ${show?0:150}%);`">
    <Icon class="r cp" type="md-close" @click="$emit('update:show', false);"/>
    <div class="rk-tool-dashboard">
      <div class="flex-c">
        <div class="long mr10">
          <h6 class="mt0 mb10" style="margin-left: 7px;">Service</h6>
          <select :value="stateOptions.currentApplication.key" style="background: 0;border: 0;color: #efefef;outline: none;width: 100%;" @change="appChange($event)">
            <option style="background-color: #25292f;" v-for="i in stateOptions.applications" :key="i.key" :value="i.key" >{{i.label}}</option>
          </select>
        </div>
        <div class="long mr10">
          <h6 class="mt0 mb10" style="margin-left: 7px;">Endpoint</h6>
          <select style="
            background: 0;
            border: 0;
            color: #efefef;
            outline: none;
            width: 100%;"
            :value="stateOptions.currentEndpoint? stateOptions.currentEndpoint.key: ''"
            @change="endpointChange($event)">
            <option style="background-color: #25292f;" v-for="i in stateOptions.endpoints" :key="i.key" :value="i.key">{{i.label}}</option>
          </select>
        </div>
        <div class="long">
          <h6 class="mt0 mb10" style="margin-left: 7px;">Service Instance</h6>
          <select style="
            background: 0;
            border: 0;
            color: #efefef;
            outline: none;
            width: 100%;"  @change="serverChange($event)">
            <option  style="background-color: #25292f;" v-for="i in stateOptions.servers" :key="i.key" :value="i">{{i.name}}</option>
          </select>
        </div>
      </div>
    </div>
  </rk-toolbar>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from '@/store/modules/options.ts';
import { Component, Prop } from 'vue-property-decorator';
import { appChange, endpointChange, serverChange } from '@/store/dispatch/dashboard.ts';

@Component({})
export default class RkToolDashBoard extends Vue {
  @Prop() stateOptions: State;
  @Prop({ type: Boolean, default: false })show:Boolean;
  appChange(e) {
    appChange(this.stateOptions.applications[e.target.selectedIndex]);
  }
  endpointChange(e) {
    endpointChange(this.stateOptions.endpoints[e.target.selectedIndex]);
  }
  serverChange(e) {
    serverChange(this.stateOptions.servers[e.target.selectedIndex]);
  }
}
</script>

<style lang="scss" scoped>
</style>
