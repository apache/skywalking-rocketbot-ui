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
  <div class="flex-h">
    <div class="mr-10 pt-5">
      <span class="sm grey">{{ $t('tags') }}: </span>
      <span class="rk-trace-tags">
        <span class="selected" v-for="(item, index) in tagsList" :key="index">
          <span>{{ item }}</span>
          <span class="remove-icon" @click="removeTags(index)">×</span>
        </span>
      </span>
      <input type="text" :placeholder="$t('addTag')" v-model="tags" class="rk-trace-new-tag" @keyup="addLabels" />
      <span class="tags-tip" v-tooltip:bottom="{ content: $t('traceTagsTip') }">
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
  import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
  @Component
  export default class ConditionTags extends Vue {
    @Prop() private type!: string;
    @Prop() private clearTags!: boolean;
    private tagsList: string[] = [];
    private tags: string = '';

    private created() {
      if (this.type === 'LOG') {
        this.tagsList = localStorage.getItem('logTags') ? JSON.parse(localStorage.getItem('logTags') || '') : [];
      } else if (this.type === 'TRACE') {
        this.tagsList = localStorage.getItem('traceTags') ? JSON.parse(localStorage.getItem('traceTags') || '') : [];
      }
      // else { // ALARM
      //   this.tagsList = localStorage.getItem('alarmTags') ? JSON.parse(localStorage.getItem('alarmTags') || '') : [];
      // }

      this.updateTags();
    }
    private removeTags(index: number) {
      this.tagsList.splice(index, 1);
      this.updateTags();
      localStorage.setItem('traceTags', JSON.stringify(this.tagsList));
    }
    private addLabels(event: KeyboardEvent) {
      if (event.keyCode !== 13 || !this.tags) {
        return;
      }
      this.tagsList.push(this.tags);
      this.tags = '';
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
      this.$emit('updateTags', { tagsMap, tagsList: this.tagsList });
    }
    @Watch('clearTags')
    private clearTagsWatch() {
      if (this.clearTags) {
        this.tagsList = [];
      }
    }
  }
</script>
<style lang="scss" scoped>
  .rk-trace-tags {
    padding: 1px 5px 0 0;
    border-radius: 3px;
    height: 24px;
    display: inline-block;
    vertical-align: top;
  }
  .selected {
    display: inline-block;
    padding: 0 3px;
    border-radius: 3px;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.65);
    border: 1px dashed #aaa;
    color: #eee;
    font-size: 12px;
    margin: 0 2px;
  }
  .rk-trace-tags {
    padding: 1px 5px 0 0;
    border-radius: 3px;
    height: 24px;
    display: inline-block;
    vertical-align: top;
  }
  .rk-trace-new-tag {
    border-style: unset;
    outline: 0;
    padding: 2px 5px;
    border-radius: 3px;
    width: 175px;
    margin-right: 3px;
  }
  .remove-icon {
    display: inline-block;
    margin-left: 3px;
    cursor: pointer;
  }
  .tags-tip {
    color: #a7aebb;
  }
</style>
