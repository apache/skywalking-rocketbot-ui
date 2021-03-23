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
      <div class="mr-15" v-show="rocketLog.type.key === cateGoryService">
        <span class="sm b grey mr-10">{{ $t('traceID') }}:</span>
        <input
          type="text"
          class="rk-log-search-input dib"
          v-model="traceId"
          @change="changeConditions($event, LogConditionsOpt.TraceID)"
        />
      </div>
      <div class="search-time">
        <span class="sm b grey mr-5">{{ $t('timeRange') }}:</span>
        <RkDate class="sm" v-model="searchTime" position="bottom" format="YYYY-MM-DD HH:mm:ss" />
      </div>
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
    <div class="mr-10" style="padding-top: 10px" v-show="rocketLog.type.key === cateGoryService">
      <span class="sm grey">{{ $t('tags') }}: </span>
      <span class="rk-log-tags">
        <span class="selected" v-for="(item, index) in tagsList" :key="index">
          <span>{{ item }}</span>
          <span class="remove-icon" @click="removeTags(index)">×</span>
        </span>
      </span>
      <input
        type="text"
        :placeholder="$t('addTag')"
        v-model="tags"
        class="rk-log-new-tag"
        @keyup="addLabels($event, LogConditionsOpt.Tags)"
      />
      <span class="log-tips" v-tooltip:bottom="{ content: $t('logsTagsTip') }">
        <a
          target="blank"
          href="https://github.com/apache/skywalking/blob/master/docs/en/setup/backend/configuration-vocabulary.md"
        >
          {{ $t('tagsLink') }}
        </a>
        <rk-icon icon="help" class="mr-5" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
  import { Mutation, State } from 'vuex-class';
  import { State as globalState } from '@/store/modules/global/index';
  import { State as logState } from '@/store/modules/log/index';
  import dateFormatStep from '@/utils/dateFormat';

  @Component({
    components: {},
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
    private tagsList: string[] = [];
    private tags: string = '';
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
    private created() {
      this.searchTime = [this.rocketbotGlobal.durationRow.start, this.rocketbotGlobal.durationRow.end];
      (this.tagsList = localStorage.getItem('logTags') ? JSON.parse(localStorage.getItem('logTags') || '') : []),
        this.updateTags();
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
      if (type === this.LogConditionsOpt.Tags && !this.tags) {
        return;
      }
      if (type === this.LogConditionsOpt.KeywordsOfContent && !this.keywordsOfContent) {
        return;
      }
      if (type === this.LogConditionsOpt.ExcludingKeywordsOfContent && !this.excludingKeywordsOfContent) {
        return;
      }
      if (type === this.LogConditionsOpt.Tags) {
        this.tagsList.push(this.tags);
        this.tags = '';
        this.updateTags();
      } else if (type === this.LogConditionsOpt.KeywordsOfContent) {
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
    private removeTags(index: number) {
      this.tagsList.splice(index, 1);
      this.updateTags();
    }
    private updateTags() {
      const tagsMap = this.tagsList.map((item: string) => {
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
      localStorage.setItem('logTags', JSON.stringify(this.tagsList));
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
      let step = 'MINUTE';
      const unix = Math.round(time[1].getTime()) - Math.round(time[0].getTime());
      if (unix <= 60 * 60 * 1000) {
        step = 'MINUTE';
      } else if (unix <= 24 * 60 * 60 * 1000) {
        step = 'HOUR';
      } else {
        step = 'DAY';
      }
      return {
        start: dateFormatStep(time[0], step, true),
        end: dateFormatStep(time[1], step, true),
        step,
      };
    }
    @Watch('rocketLog.conditions')
    private clearTags() {
      if (!this.rocketLog.conditions.tags) {
        this.tagsList = [];
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
          new Date(
            this.searchTime[0].getTime() +
              (parseInt(String(this.rocketbotGlobal.utc), 10) + new Date().getTimezoneOffset() / 60) * 3600000,
          ),
          new Date(
            this.searchTime[1].getTime() +
              (parseInt(String(this.rocketbotGlobal.utc), 10) + new Date().getTimezoneOffset() / 60) * 3600000,
          ),
        ]),
      });
    }
  }
</script>

<style lang="scss" scoped>
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
  }
</style>
