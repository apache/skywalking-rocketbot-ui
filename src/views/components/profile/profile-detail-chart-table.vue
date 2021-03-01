<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->

<template>
  <div class="profile-detail-chart-table">
    <ProfileContainer :highlightTop="highlightTop" :tableData="tableData">
      <div class="profile-tips" v-if="!tableData.length">{{ $t('noData') }}</div>
    </ProfileContainer>
  </div>
</template>
<script lang="js">
  import copy from '@/utils/copy';
  import ProfileContainer from './profile-container';

  export default {
    components: {
      ProfileContainer,
    },
    props: ['data', 'highlightTop'],
    watch: {
      data() {
        if (!this.data.length) {
          this.tableData = [];
          return;
        }
        this.tableData = this.processTree();
      },
      highlightTop() {
        if (!this.data.length) {
          this.tableData = [];
          return;
        }
        this.tableData = this.processTree();
      },
    },
    data() {
      return {
        tableData: [],
      };
    },
    methods: {
      copy,
      processTree() {
        if (!this.data.length) {
          return [];
        }

        const durationChildExcluded = this.data.map((d) => {
          return d.elements.map((item) => item.durationChildExcluded);
        }).flat(1);
        function compare(val, val1) {
          return val1 - val;
        }
        const topDur = durationChildExcluded.sort(compare).filter((item, index) => index < 10 && item !== 0);
        const trees = [];

        for (const item of this.data) {
          const newArr = this.sortArr(item.elements, topDur);
          trees.push(...newArr);
        }

        return trees;
      },
      sortArr(arr, topDur) {
        const copyArr = JSON.parse(JSON.stringify(arr));
        const obj = {};
        const res = [];
        for (const item of copyArr) {
          obj[item.id] = item;
        }
        for (const item of copyArr) {
          item.topDur = topDur.includes(item.durationChildExcluded) && this.highlightTop;
          if (item.parentId === '0') {
            res.push(item);
          }
          for (const key in obj) {
            if (item.id === obj[key].parentId) {
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
    },
    mounted() {
      this.tableData = this.processTree();
    },
  };
</script>
<style>
  .dialog-c-text {
    white-space: pre;
    overflow: auto;
    font-family: monospace;
  }
  .profile-tips {
    width: 100%;
    text-align: center;
    margin-top: 10px;
  }
  .rk-tooltip-popper.trace-table-tooltip .rk-tooltip-inner {
    max-width: 600px;
  }
  .profile-detail-chart-table {
    position: relative;
    min-height: 150px;
    margin-top: 20px;
    overflow-x: scroll;
  }
</style>
