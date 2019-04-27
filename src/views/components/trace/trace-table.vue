/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

<template>
    <div class="rk-trace-t flex-v">
      <div class="rk-trace-t-tool flex-h">
        <RkPage :currentSize="15" :currentPage="rocketTrace.traceForm.paging.pageNum" @changePage="page" :total="rocketTrace.traceTotal"/>
        <select class='grey' @change="changeSort" :value="rocketTrace.traceForm.queryOrder">
          <option value="BY_START_TIME">{{this.$t('startTime')}}</option>
          <option value="BY_DURATION">{{this.$t('duration')}}</option>
        </select>
      </div>
      <div class="rk-trace-t-loading" v-show="loading">
        <svg class="icon loading">
          <use xlink:href="#spinner"></use>
        </svg>
      </div>
      <div class="rk-trace-t-wrapper scroll_hide">
        <table class="rk-trace-t">
          <tr class="rk-trace-tr cp" v-for="i in rocketTrace.traceList" @click="selectTrace(i)">
            <td class="rk-trace-td" :class="{
                'rk-trace-success':!i.isError,
                'rk-trace-error':i.isError,
                }">
              <div class="ell mb-5" :class="{
                'blue':!i.isError,
                'red':i.isError,
                }"><span class="b">{{i.endpointNames[0]}}</span></div>
                <div class="grey ell sm"><span class="rk-tag mr-10 sm">{{i.duration}} ms</span>{{parseInt(i.start) | dateformat('YYYY-MM-DD HH:mm:ss')}}</div>
            </td>
          </tr>
        </table>
      </div>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Action, Getter, Mutation, State } from 'vuex-class';
@Component
export default class Home extends Vue {
  @State('rocketTrace') private rocketTrace: any;
  @Mutation('rocketTrace/SET_TRACE_FORM_ITEM') private SET_TRACE_FORM_ITEM: any;
  @Mutation('rocketTrace/SET_CURRENT_TRACE') private SET_CURRENT_TRACE: any;
  @Action('rocketTrace/GET_TRACELIST') private GET_TRACELIST: any;
  @Action('rocketTrace/GET_TRACE_SPANS') private GET_TRACE_SPANS: any;
  private loading: boolean = false;
  private selectTrace(i: any) {
    this.SET_CURRENT_TRACE(i);
    if (i.traceIds.length) {
      this.GET_TRACE_SPANS({traceId: i.traceIds[0]});
    }
  }
  private changeSort(e: any) {
    this.SET_TRACE_FORM_ITEM({type: 'queryOrder', data: e.target.options[e.target.selectedIndex].value});
    this.SET_TRACE_FORM_ITEM({type: 'paging', data: { pageNum: 1, pageSize: 15, needTotal: true}});
    this.GET_TRACELIST();
  }
  private page(p: number) {
    this.loading = true;
    this.SET_TRACE_FORM_ITEM({type: 'paging', data: { pageNum: p, pageSize: 15, needTotal: true}});
    this.GET_TRACELIST().then(() => {
      this.loading = false;
    });
  }
}
</script>
<style lang="scss">
.rk-trace-t{
  flex-grow: 1;
  height: 100%;
  position: relative;
}
.rk-trace-t-tool{
  flex-shrink: 0;
  background-color: rgba(196, 200, 225, 0.2);
  justify-content: space-between;
  padding-right: 5px;
  select{
    background-color: rgba(0, 0, 0, 0);
    outline: 0;
    border-style: unset;
  }
  padding-top: 1px;
  border-bottom: 1px solid #c1c5ca41;
  border-right: 1px solid #c1c5ca41;
  height: 35px;
}
.rk-trace-t-wrapper{
  overflow: auto;
  flex-grow: 1;
  border-right: 1px solid rgba(0,0,0,0.1);
}
.rk-trace-t-loading{
  text-align: center;
  position: absolute;
  width: 100%;
  height: 70px;
  margin-top: 40px;
  line-height: 88px;
  overflow: hidden;
  .icon{
    width: 30px;
    height: 30px;
  }
}
.rk-trace-t {
  width: 100%;
  border-spacing: 0;
  table-layout: fixed;
}
.rk-trace-tr{
  &:hover{
    background-color: rgba(0,0,0,.04)
  }
}
.rk-trace-td {
  padding: 8px 10px;
  border-bottom: 1px solid rgba(0,0,0,.07);
}
.rk-trace-success{
  border-left: 4px solid rgba(46, 47, 51, 0.1);
}
.rk-trace-warning{
  border-left: 4px solid #FBB03B;
}
.rk-trace-error{
  border-left: 4px solid #E54C17;
}
.rk-tag{
  border-radius: 4px;
  padding-right: 5px;
  padding-left: 5px;
  background-color: #40454e;
  color: #eee;
}
</style>
