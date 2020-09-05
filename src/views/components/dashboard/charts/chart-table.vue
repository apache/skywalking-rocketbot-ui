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
  <div class="rk-chart-table">
    <RkPage
      :currentSize="10"
      :currentPage="pageNum"
      @changePage="(pageNum) => handleRefresh(pageNum)"
      :total="data.total"
    />
    <table width="100%">
      <thead>
        <tr>
          <td width="30%">error info</td>
          <td width="30%">error type</td>
          <td width="40%">error page</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in data.logs">
          <td>{{ i.message }}</td>
          <td>{{ i.category }}</td>
          <td>{{ i.pagePath }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';

  @Component
  export default class ChartNum extends Vue {
    @Prop() private data!: any;
    @Prop() private item!: any;

    private pageNum: number = 1;
    private handleRefresh(pageNum: number) {
      this.pageNum = pageNum;
      this.$emit('updateStatus', 'paging', {
        pageNum,
        pageSize: 10,
        needTotal: true,
      });
    }
  }
</script>
<style lang="scss" scoped>
  .rk-chart-table {
    height: 100%;
    overflow: scroll;
  }
  table {
    height: 100%;
    color: #666666;
    border-collapse: collapse;
    border-spacing: 0;
    thead {
      border-top: 1px dashed #e5ebef;
      background-color: rgba(196, 200, 225, 0.1);
      td {
        padding: 3px 0;
      }
    }
    tbody {
      font-size: 12px;
      td {
        line-height: 12px;
      }
    }
    td {
      border-bottom: 1px dashed #e5ebef;
      box-sizing: border-box;
      vertical-align: middle;
    }
    tr {
      &:hover {
        background-color: rgba(196, 200, 225, 0.08);
      }
    }
  }
</style>
