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
  <div class="rk-search-conditions">
    <div class="search-time">
      <span class="sm b grey mr-5">{{ $t('timeRange') }}:</span>
      <RkDate class="sm" v-model="searchTime" position="left" format="YYYY-MM-DD HH:mm:ss" />
    </div>
    <div class="condition-notice">
      <b>{{ $t('conditionNotice') }}</b>
    </div>
    <div class="flex-h">
      <div class="mr-20" v-show="rocketLog.type.key === cateGoryService">
        <span class="sm b grey traceID">{{ $t('traceID') }}:</span>
        <input
          type="text"
          class="rk-log-search-input dib"
          :placeholder="$t('addTraceID')"
          v-model="traceId"
          @change="changeConditions($event, LogConditionsOpt.TraceID)"
        />
      </div>
      <ConditionTags :type="'LOG'" :clearTags="clearAllTags" @updateTags="updateTags" />
    </div>
    <div class="flex-h">
      <div class="mr-15" v-show="rocketLog.type.key === cateGoryService">
        <span class="sm b grey mr-10">{{ $t('keywordsOfContent') }}:</span>
        <span class="rk-log-tags" v-show="rocketLog.supportQueryLogsByKeywords">
          <span
            class="selected"
            v-for="(item, index) in rocketLog.conditions.keywordsOfContent"
            :key="`keywordsOfContent${index}`"
          >
            <span>{{ item }}</span>
            <span class="remove-icon" @click="removeContent(index)">×</span>
          </span>
        </span>
        <input
          type="text"
          :disabled="!rocketLog.supportQueryLogsByKeywords"
          class="rk-log-search-input dib mr-5"
          :placeholder="$t('addKeywordsOfContent')"
          v-model="keywordsOfContent"
          @keyup="addLabels($event, LogConditionsOpt.KeywordsOfContent)"
        />
        <span
          class="log-tips"
          v-show="!rocketLog.supportQueryLogsByKeywords"
          v-tooltip:bottom="{ content: $t('keywordsOfContentLogTips') }"
        >
          <rk-icon icon="help" class="mr-5" />
        </span>
      </div>
      <div class="mr-15" v-show="rocketLog.type.key === cateGoryService">
        <span class="sm b grey mr-10">{{ $t('excludingKeywordsOfContent') }}:</span>
        <span class="rk-log-tags" v-show="rocketLog.supportQueryLogsByKeywords">
          <span
            class="selected"
            v-for="(item, index) in rocketLog.conditions.excludingKeywordsOfContent"
            :key="`excludingKeywordsOfContent${index}`"
          >
            <span>{{ item }}</span>
            <span class="remove-icon" @click="removeExcludeContent(index)">×</span>
          </span>
        </span>
        <input
          type="text"
          :disabled="!rocketLog.supportQueryLogsByKeywords"
          class="rk-log-search-input dib mr-5"
          :placeholder="$t('addExcludingKeywordsOfContent')"
          v-model="excludingKeywordsOfContent"
          @keyup="addLabels($event, LogConditionsOpt.ExcludingKeywordsOfContent)"
        />
        <span
          class="log-tips"
          v-show="!rocketLog.supportQueryLogsByKeywords"
          v-tooltip:bottom="{ content: $t('keywordsOfContentLogTips') }"
        >
          <rk-icon icon="help" class="mr-5" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { Mutation, State } from 'vuex-class';
  import { State as globalState } from '@/store/modules/global/index';
  import { State as logState } from '@/store/modules/log/index';
  import dateFormatStep from '@/utils/dateFormat';
  import { ConditionTags } from '../common/index';
  import getLocalTime from '@/utils/localtime';

  @Component({
    components: { ConditionTags },
  })
  export default class LogConditions extends Vue {
    @State('rocketbot') private rocketbotGlobal!: globalState;
    @State('rocketLog') private rocketLog!: logState;
    @Mutation('SET_LOG_CONDITIONS') private SET_LOG_CONDITIONS: any;
    @Mutation('SET_TAG_LIST') private SET_TAG_LIST: any;
    @Mutation('SET_KEYWORDS_CONTENT') private SET_KEYWORDS_CONTENT: any;
    @Mutation('SET_EXCLUDING_KEYWORDS_CONTENT') private SET_EXCLUDING_KEYWORDS_CONTENT: any;
    private keywordsOfContent: string = '';
    private excludingKeywordsOfContent: string = '';
    private searchTime: Date[] = [];
    private traceId: string = '';
    private LogConditionsOpt = {
      TraceID: 'traceId',
      Tags: 'tags',
      KeywordsOfContent: 'keywordsOfContent',
      ExcludingKeywordsOfContent: 'excludingKeywordsOfContent',
      Date: 'date',
    };
    private cateGoryService = 'service';
    private clearAllTags: boolean = false;
    private created() {
      this.searchTime = [this.rocketbotGlobal.durationRow.start, this.rocketbotGlobal.durationRow.end];
      this.traceId = localStorage.getItem('logTraceId') || '';
    }
    private changeConditions(item: any, type: string) {
      item = {
        label: type,
        key: item.target.value,
      };
      this.SET_LOG_CONDITIONS(item);
      localStorage.setItem('logTraceId', this.traceId);
    }
    private addLabels(event: KeyboardEvent, type: string) {
      if (event.keyCode !== 13) {
        return;
      }
      if (type === this.LogConditionsOpt.KeywordsOfContent && !this.keywordsOfContent) {
        return;
      }
      if (type === this.LogConditionsOpt.ExcludingKeywordsOfContent && !this.excludingKeywordsOfContent) {
        return;
      }
      if (type === this.LogConditionsOpt.KeywordsOfContent) {
        const keywordsOfContentList = this.rocketLog.conditions.keywordsOfContent || [];
        keywordsOfContentList.push(this.keywordsOfContent);
        this.SET_LOG_CONDITIONS({
          label: type,
          key: keywordsOfContentList,
        });
        this.keywordsOfContent = '';
        this.updateContent(type);
      } else if (type === this.LogConditionsOpt.ExcludingKeywordsOfContent) {
        const excludingKeywordsOfContentList = this.rocketLog.conditions.excludingKeywordsOfContent || [];
        excludingKeywordsOfContentList.push(this.excludingKeywordsOfContent);
        this.SET_LOG_CONDITIONS({
          label: type,
          key: excludingKeywordsOfContentList,
        });
        this.excludingKeywordsOfContent = '';
        this.updateContent(type);
      }
    }
    private removeContent(index: number) {
      const keywordsOfContentList = this.rocketLog.conditions.keywordsOfContent || [];
      keywordsOfContentList.splice(index, 1);
      this.SET_LOG_CONDITIONS({
        label: this.LogConditionsOpt.KeywordsOfContent,
        key: keywordsOfContentList,
      });
      this.keywordsOfContent = '';
      this.updateContent(this.LogConditionsOpt.KeywordsOfContent);
    }
    private removeExcludeContent(index: number) {
      const excludingKeywordsOfContentList = this.rocketLog.conditions.excludingKeywordsOfContent || [];
      excludingKeywordsOfContentList.splice(index, 1);
      this.SET_LOG_CONDITIONS({
        label: this.LogConditionsOpt.ExcludingKeywordsOfContent,
        key: excludingKeywordsOfContentList,
      });
      this.excludingKeywordsOfContent = '';
      this.updateContent(this.LogConditionsOpt.ExcludingKeywordsOfContent);
    }
    private updateTags(data: { tagsMap: Array<{ key: string; value: string }>; tagsList: string[] }) {
      this.SET_LOG_CONDITIONS({
        label: this.LogConditionsOpt.Tags,
        key: data.tagsMap,
      });
      localStorage.setItem('logTags', JSON.stringify(data.tagsList));
    }
    private updateContent(type: string) {
      let list = [];
      let storageContent = '';
      if (type === this.LogConditionsOpt.KeywordsOfContent) {
        list = this.rocketLog.conditions.keywordsOfContent;
        storageContent = 'logKeywordsOfContent';
      } else if (type === this.LogConditionsOpt.ExcludingKeywordsOfContent) {
        list = this.rocketLog.conditions.excludingKeywordsOfContent;
        storageContent = 'logExcludingKeywordsOfContent';
      }

      localStorage.setItem(storageContent, JSON.stringify(list));
    }
    private globalTimeFormat(time: Date[]) {
      const step = 'SECOND';

      return {
        start: dateFormatStep(time[0], step, true),
        end: dateFormatStep(time[1], step, true),
        step,
      };
    }
    @Watch('rocketLog.conditions')
    private clearTags() {
      if (!this.rocketLog.conditions.tags) {
        localStorage.removeItem('logTags');
        this.clearAllTags = true;
      }
      if (!this.rocketLog.conditions.traceId) {
        this.traceId = '';
      }
    }
    @Watch('searchTime')
    private updateDate() {
      this.SET_LOG_CONDITIONS({
        label: this.LogConditionsOpt.Date,
        key: this.globalTimeFormat([
          getLocalTime(this.rocketbotGlobal.utc, this.searchTime[0]),
          getLocalTime(this.rocketbotGlobal.utc, this.searchTime[1]),
        ]),
      });
    }
  }
</script>

<style lang="scss" scoped>
  .rk-search-conditions {
    width: 100%;
    background-color: #484b55;
    border-radius: 3px;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
    padding: 10px;
    > div {
      margin-top: 5px;
    }

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
    .log-tips {
      color: #eee;
    }
    .search-time {
      color: #eee;
    }

    .rk-log-search-input {
      border-style: unset;
      outline: 0;
      padding: 2px 5px;
      border-radius: 3px;
      width: 280px;
    }

    .rk-log-tags {
      padding: 1px 5px 0 0;
      border-radius: 3px;
      height: 24px;
      display: inline-block;
      vertical-align: top;
    }

    .rk-log-new-tag {
      border-style: unset;
      outline: 0;
      padding: 2px 5px;
      border-radius: 3px;
      width: 175px;
      margin-right: 3px;
    }
    .condition-notice {
      color: #fff;
    }
    .traceID {
      padding-right: 62px;
    }
  }
</style>
