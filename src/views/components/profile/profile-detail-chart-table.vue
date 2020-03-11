/** * Licensed to the Apache Software Foundation (ASF) under one or more * contributor license agreements. See the
NOTICE file distributed with * this work for additional information regarding copyright ownership. * The ASF licenses
this file to You under the Apache License, Version 2.0 * (the "License"); you may not use this file except in compliance
with * the License. You may obtain a copy of the License at * * http://www.apache.org/licenses/LICENSE-2.0 * * Unless
required by applicable law or agreed to in writing, software * distributed under the License is distributed on an "AS
IS" BASIS, * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. * See the License for the specific
language governing permissions and * limitations under the License. */

<template>
  <div class="profile-detail-chart-table">
    <div class="rk-trace-t-loading" v-show="loading">
      <svg class="icon loading">
        <use xlink:href="#spinner"></use>
      </svg>
    </div>
    <ProfileContainer>
      <Item v-for="(item, index) in tableData" :data="item" :key="'key' + index" />
    </ProfileContainer>
  </div>
</template>
<style lang="scss">
  .rk-tooltip-popper.trace-table-tooltip .rk-tooltip-inner {
    max-width: 600px;
  }
  .profile-detail-chart-table {
    position: relative;
    min-height: 150px;
    margin-top: 20px;
  }
</style>

<script lang="js">
  import copy from '@/utils/copy';
  import Item from './profile-item';
  import ProfileContainer from './profile-container';
  import _ from 'lodash';
  /* eslint-disable */
  /* tslint:disable */
  export default {
    components: {
      Item,
      ProfileContainer,
    },
    props: ['data'],
    watch: {
      data(val, oldVal) {
        if (!this.data.length) {
          return;
        }
        this.tableData = this.formatData(this.processTree());
        this.loading = false;
      },
    },
    data() {
      return {
        tableData: [],
        currentSpan: [],
        loading: true,
      };
    },
    methods: {
      copy,
      // 给增加层级关系
      formatData(arr, level = 1, totalExec = null) {
        for (const item of arr) {
          item.level = level;
          totalExec = totalExec || (item.endTime - item.startTime);
          item.totalExec = totalExec;
          if (item.children && item.children.length) {
            this.formatData(item.children, level + 1, totalExec);
          }
        }
        return arr;
      },
      processTree() {
        if (!this.data.length) {
          return [];
        }
        const trees = [];
        for (const item of this.data) {
          const newArr = this.sortArr(item.elements);
          trees.push(...newArr);
        }
        return trees;
      },
      sortArr(arr) {
        const copyArr = JSON.parse(JSON.stringify(arr));
        const obj = {};
        const res = [];
        for (const item of copyArr) {
          obj[item.id] = item;
        }
        for (const item of copyArr) {
          if (item.parentId === '0') {
            res.push(item);
          }
          for (const key in obj) {
            if (item.id === obj[key].parentId) {
              item.endpointName = item.codeSignature || 'no operation name';
              if (item.children) {
                item.children.push(obj[key]);
              } else {
                item.children = [obj[key]];
              }
            }
          }
        }

        return res;
      },
      collapse(d) {
        if (d.children) {
          let dur = d.endTime - d.startTime;
          d.children.forEach((i) => {
            dur -= (i.endTime - i.startTime);
          });
          d.dur = dur < 0 ? 0 : dur;
          d.children.forEach((i) => this.collapse(i));
        }
      },
      handleSelectSpan(data) {
        this.currentSpan = data;
      },
    },
    created() {
      this.loading = true;
    },
    mounted() {
      this.tableData = this.formatData(this.processTree());
      this.loading = false;
      this.$eventBus.$on('HANDLE-SELECT-SPAN', this, this.handleSelectSpan);
      this.$eventBus.$on('TRACE-TABLE-LOADING', this, ()=>{ this.loading = true });

    },
  };
</script>
<style>
  .dialog-c-text {
    white-space: pre;
    overflow: auto;
    font-family: monospace;
  }
</style>
