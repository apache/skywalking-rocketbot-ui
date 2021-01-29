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
  <div class="rk-search-conditions flex-v">
    <div class="flex-h">
      <div class="mr-15">
        <span class="sm b grey mr-10">{{ this.$t('traceID') }}:</span>
        <input
          type="text"
          class="rk-trace-search-input dib"
          @change="changeConditions($event, LogConditionsOpt.TraceID)"
        />
      </div>
      <div class="mr-15">
        <span class="sm b grey mr-10">{{ this.$t('keywordsOfContent') }}:</span>
        <input
          type="text"
          class="rk-trace-search-input dib"
          @change="changeConditions($event, LogConditionsOpt.KeywordsOfContent)"
        />
      </div>
      <div class="mr-15">
        <span class="sm b grey mr-10">{{ this.$t('excludingKeywordsOfContent') }}:</span>
        <input
          type="text"
          class="rk-trace-search-input dib"
          @change="changeConditions($event, LogConditionsOpt.ExcludingKeywordsOfContent)"
        />
      </div>
    </div>
    <div class="mr-10" style="padding-top: 10px">
      <span class="sm grey">{{ this.$t('tags') }}: </span>
      <span class="rk-trace-tags">
        <span class="selected" v-for="(item, index) in rocketLog.tagsList" :key="index">
          <span>{{ item }}</span>
          <span class="remove-icon" @click="removeTags(index)">×</span>
        </span>
      </span>
      <input type="text" :placeholder="this.$t('addTag')" v-model="tags" class="rk-trace-new-tag" @keyup="addLabels" />
      <span class="trace-tips" v-tooltip:bottom="{ content: this.$t('logsTagsTip') }">
        <a
          target="blank"
          href="https://github.com/apache/skywalking/blob/master/docs/en/setup/backend/configuration-vocabulary.md"
        >
          {{ this.$t('tagsLink') }}
        </a>
        <rk-icon icon="help" class="mr-5" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Vue } from 'vue-property-decorator';
  import { Mutation, State } from 'vuex-class';

  @Component({
    components: {},
  })
  export default class LogConditions extends Vue {
    @State('rocketLog') private rocketLog: any;
    @Mutation('SET_LOG_CONDITIONS') private SET_LOG_CONDITIONS: any;
    @Mutation('SET_TAG_LIST') private SET_TAG_LIST: any;

    private tags: string = '';
    private LogConditionsOpt = {
      TraceID: 'traceId',
      Tags: 'tags',
      KeywordsOfContent: 'keywordsOfContent',
      ExcludingKeywordsOfContent: 'excludingKeywordsOfContent',
    };
    private created() {
      this.updateTags();
    }
    private changeConditions(item: any, type: string) {
      item = {
        label: type,
        key: item.target.value,
      };
      this.SET_LOG_CONDITIONS(item);
    }
    private addLabels(event: KeyboardEvent) {
      if (event.keyCode !== 13 || !this.tags) {
        return;
      }
      const tagsList = this.rocketLog.tagsList;
      tagsList.push(this.tags);
      this.SET_TAG_LIST(tagsList);
      this.tags = '';
      this.updateTags();
    }
    private removeTags(index: number) {
      const tagsList = this.rocketLog.tagsList;
      tagsList.splice(index, 1);
      this.SET_TAG_LIST(tagsList);
      this.updateTags();
    }
    private updateTags() {
      const tagsMap = this.rocketLog.tagsList.map((item: string) => {
        const key = item.substring(0, item.indexOf('='));

        return {
          key,
          value: item.substring(item.indexOf('=') + 1, item.length),
        };
      });
      this.SET_LOG_CONDITIONS({
        label: this.LogConditionsOpt.Tags,
        key: tagsMap,
      });
      localStorage.setItem('logTags', JSON.stringify(this.rocketLog.tagsList));
    }
  }
</script>

<style scoped lang="scss">
  .rk-search-conditions {
    width: 100%;
    background-color: #484b55;
    padding: 10px;
    border-radius: 3px;
    margin-top: 4px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);

    &:after {
      bottom: 100%;
      right: 370px;
      border: solid transparent;
      content: ' ';
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(0, 0, 0, 0);
      border-bottom-color: #484b55;
      border-width: 8px;
      margin-right: 0px;
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
      padding: 0 3px;
      border-radius: 3px;
      overflow: hidden;
      color: #eee;
      border: 1px dashed #aaa;
      font-size: 12px;
      margin: 0 2px;
    }
    .trace-tips {
      color: #eee;
    }
  }
</style>
