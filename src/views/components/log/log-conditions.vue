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
  <div class="rk-log-condition">
    <label>{{ this.$t('metricName') }}</label>
    <input type="text" class="rk-log-input" @change="changeConditions($event, updateLogOpt.metricName)" />
    <label>{{ this.$t('endpointName') }}</label>
    <input type="text" class="rk-log-input" @change="changeConditions($event, updateLogOpt.EndpointName)" />
    <label>{{ this.$t('traceID') }}</label>
    <input type="text" class="rk-log-input" @change="changeConditions($event, updateLogOpt.EndpointName)" />
    <label>
      {{ this.$t('tags') }}
      <span class="tags-tips" v-tooltip:bottom="{ content: this.$t('tagsTip') }">
        (<a
          target="blank"
          href="https://github.com/apache/skywalking/blob/master/docs/en/setup/backend/configuration-vocabulary.md"
        >
          {{ this.$t('tagsLink') }}
        </a>
        <rk-icon icon="help" class="mr-5" />)
      </span>
    </label>
    <div class="mr-10">
      <span class="rk-log-tags">
        <span class="selected" v-for="(item, index) in tagsList" :key="index">
          <span>{{ item }}</span>
          <span class="remove-icon" @click="removeTags(index)">×</span>
        </span>
      </span>
      <input type="text" :placeholder="this.$t('addTag')" v-model="tags" class="rk-log-tag" @keyup="addLabels" />
    </div>
    <label>{{ this.$t('keywordsOfContent') }}</label>
    <input type="text" class="rk-log-input" @change="changeConditions($event, updateLogOpt.EndpointName)" />
    <label>{{ this.$t('excludingKeywordsOfContent') }}</label>
    <input type="text" class="rk-log-input" @change="changeConditions($event, updateLogOpt.EndpointName)" />
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';

  @Component({
    components: {},
  })
  export default class LogConditions extends Vue {
    private updateLogOpt = {};
    private tagsList: string[] = [];
    private tags: string = '';
    private changeConditions(item: any, type: string) {
      // console.log(item);
    }
    private addLabels(event: KeyboardEvent) {
      if (event.keyCode !== 13 || !this.tags) {
        return;
      }
      this.tagsList.push(this.tags);
      this.tags = '';
    }
    private removeTags(index: number) {
      this.tagsList.splice(index, 1);
      localStorage.setItem('logTags', JSON.stringify(this.tagsList));
    }
  }
</script>

<style scoped lang="scss">
  .rk-log-condition {
    margin: 20px 0 0 0;
    label {
      display: inline-block;
      margin: 10px 0;
      font-size: 12px;
    }
    .rk-log-input {
      border-style: unset;
      outline: 0;
      padding: 2px 5px;
      border-radius: 3px;
      border: 1px solid #ccc;
      height: 30px;
      line-height: 30px;
      display: block;
      width: 100%;
    }
    .rk-log-tag {
      width: 30%;
      border-style: unset;
      outline: 0;
      border: 1px solid #ccc;
      height: 30px;
      padding: 0 5px;
    }
    .tags-tips {
      font-weight: normal;
    }
    .remove-icon {
      display: inline-block;
      margin-left: 3px;
      cursor: pointer;
    }
    .selected {
      display: inline-block;
      padding: 4px 5px;
      border-radius: 3px;
      overflow: hidden;
      color: rgba(0, 0, 0, 0.65);
      border: 1px dashed #aaa;
      font-size: 12px;
      margin: 0 2px;
    }
    .rk-log-tags {
      padding: 1px 5px 0 0;
      border-radius: 3px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
    }
  }
</style>
