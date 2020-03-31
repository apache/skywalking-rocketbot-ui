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
  <div
    class="datepicker"
    :class="{
      'datepicker-range': range,
      datepicker__clearable: clearable && text && !disabled,
    }"
  >
    <!-- <svg class="icon datepicker-icon">
    <use xlink:href="#timer"></use>
  </svg> -->
    <input
      class="cp"
      readonly
      :value="text"
      :class="[show ? 'focus' : '', inputClass]"
      :disabled="disabled"
      :placeholder="placeholder"
      :name="name"
      v-if="type !== 'inline'"
    />
    <a class="datepicker-close" @click.stop="cls"></a>
    <transition name="datepicker-anim">
      <div
        class="datepicker-popup"
        :class="[popupClass, { 'datepicker-inline': type === 'inline' }, position === 'top' ? 'top' : 'bottom']"
        tabindex="-1"
        v-if="show || type === 'inline'"
      >
        <template v-if="range">
          <div class="datepicker-popup__sidebar">
            <button type="button" class="datepicker-popup__shortcut" @click="quickPick('quarter')">
              {{ this.local.quarterHourCutTip }}
            </button>
            <button type="button" class="datepicker-popup__shortcut" @click="quickPick('half')">
              {{ this.local.halfHourCutTip }}
            </button>
            <button type="button" class="datepicker-popup__shortcut" @click="quickPick('hour')">
              {{ this.local.hourCutTip }}
            </button>
            <button type="button" class="datepicker-popup__shortcut" @click="quickPick('day')">
              {{ this.local.dayCutTip }}
            </button>
            <button type="button" class="datepicker-popup__shortcut" @click="quickPick('week')">
              {{ this.local.weekCutTip }}
            </button>
            <button type="button" class="datepicker-popup__shortcut" @click="quickPick('month')">
              {{ this.local.monthCutTip }}
            </button>
          </div>
          <div class="datepicker-popup__body">
            <rk-calendar v-model="dates[0]" :left="true"></rk-calendar>
            <rk-calendar v-model="dates[1]" :right="true"></rk-calendar>
          </div>
        </template>
        <template v-else>
          <rk-calendar v-model="dates[0]"></rk-calendar>
        </template>
        <div v-if="showButtons" class="datepicker__buttons">
          <button @click.prevent.stop="cancel" class="datepicker__button-cancel">
            {{ this.local.cancelTip }}
          </button>
          <button @click.prevent.stop="submit" class="datepicker__button-select">
            {{ this.local.submitTip }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="js">
  import RkCalendar from './rk-date-calendar.vue';
  import getLocalTime from '@/utils/localtime';
  /* eslint-disable */
  /* tslint:disable */
  export default {
    name: 'VueDatepickerLocal',
    components: { RkCalendar },
    props: {
      position: { type:String, default:'bottom' },
      name: [String],
      inputClass: [String],
      popupClass: [String],
      value: [Date, Array, String],
      disabled: [Boolean],
      type: {
        type: String,
        default: 'normal',
      },
      rangeSeparator: {
        type: String,
        default: '~',
      },
      clearable: {
        type: Boolean,
        default: false,
      },
      placeholder: [String],
      disabledDate: {
        type: Function,
        default: () => false,
      },
      format: {
        type: String,
        default: 'YYYY-MM-DD',
      },
      showButtons: {
        type: Boolean,
        default: false,
      },
      dateRangeSelect: [Function],
    },
    data() {
      return {
        show: false,
        dates: [],
      };
    },
    computed: {
      local() {
        return {
          dow: 1, // Monday is the first day of the week
          hourTip: this.$t('hourTip'), // tip of select hour
          minuteTip: this.$t('minuteTip'), // tip of select minute
          secondTip: this.$t('secondTip'), // tip of select second
          yearSuffix: this.$t('yearSuffix'), // format of head
          monthsHead: this.$t('monthsHead').split(
            '_',
          ), // months of head
          months: this.$t('months').split(
            '_',
          ), // months of panel
          weeks: this.$t('weeks').split('_'), // weeks
          cancelTip: this.$t('cancel'), // default text for cancel button
          submitTip: this.$t('confirm'), // default text for submit button
          quarterHourCutTip: this.$t('quarterHourCutTip'),
          halfHourCutTip: this.$t('halfHourCutTip'),
          hourCutTip: this.$t('hourCutTip'),
          dayCutTip: this.$t('dayCutTip'),
          weekCutTip: this.$t('weekCutTip'),
          monthCutTip: this.$t('monthCutTip'),
        };
      },
      range() {
        return this.dates.length === 2;
      },
      text() {
        const val = this.value;
        const txt = this.dates
          .map(date => this.tf(date))
          .join(` ${this.rangeSeparator} `);
        if (Array.isArray(val)) {
          return val.length > 1 ? txt : '';
        }
        return val ? txt : '';
      },
    },
    watch: {
      value() {
        this.dates = this.vi(this.value);
      },
    },
    methods: {
      get() {
        return Array.isArray(this.value) ? this.dates : this.dates[0];
      },
      cls() {
        this.$emit('clear');
        this.$emit('input', this.range ? [] : '');
      },
      vi(val) {
        if (Array.isArray(val)) {
          return val.length > 1
            ? val.map(item => new Date(item))
            : [new Date(), new Date()];
        }
        return val ? [new Date(val)] : [new Date()];
      },
      ok(leaveOpened) {
        this.$emit('input', this.get());
        !leaveOpened &&
          !this.showButtons &&
          setTimeout(() => {
            this.show = this.range;
          });
      },
      tf(time, format) {
        const year = time.getFullYear();
        const month = time.getMonth();
        const day = time.getDate();
        const hours24 = time.getHours();
        const hours = hours24 % 12 === 0 ? 12 : hours24 % 12;
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const milliseconds = time.getMilliseconds();
        const dd = t => (`0${t}`).slice(-2);
        const map = {
          YYYY: year,
          MM: dd(month + 1),
          MMM: this.local.months[month],
          MMMM: this.local.monthsHead[month],
          M: month + 1,
          DD: dd(day),
          D: day,
          HH: dd(hours24),
          H: hours24,
          hh: dd(hours),
          h: hours,
          mm: dd(minutes),
          m: minutes,
          ss: dd(seconds),
          s: seconds,
          S: milliseconds,
        };
        return (format || this.format).replace(
          /Y+|M+|D+|H+|h+|m+|s+|S+/g,
          str => map[str],
        );
      },
      dc(e) {
        this.show = this.$el.contains(e.target) && !this.disabled;
      },
      quickPick(type){
        const end = new Date();
        const start = new Date();
        switch (type) {
          case 'quarter':
            start.setTime(start.getTime() - 60 * 15 * 1000);//15 mins
            break;
          case 'half':
            start.setTime(start.getTime() - 60 * 30 * 1000);//30 mins
            break;
          case 'hour':
            start.setTime(start.getTime() - 3600 * 1000);//1 hour
            break;
          case 'day':
            start.setTime(start.getTime() - 3600 * 1000 * 24);//1 day
            break;
          case 'week':
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);//1 week
            break;
          case 'month':
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);//1 month
            break;
          default:
            break;
        }
        this.dates = [start, end];
        this.$emit('input', this.get());
      },
      submit() {
        this.$emit('confirm', this.get());
        this.show = false;
      },
      cancel() {
        this.$emit('cancel');
        this.show = false;
      },
    },
    mounted() {
      this.dates = this.vi(this.value);
      document.addEventListener('click', this.dc, true);
    },
    beforeDestroy() {
      document.removeEventListener('click', this.dc, true);
    },
  };
</script>

<style lang="scss" scoped>
  .datepicker {
    display: inline-block;
    position: relative;
    // color: #3d444f;
  }

  .datepicker-icon {
    display: block;
    position: absolute;
    top: 8px;
    left: 8px;
    color: #515a6ecc;
  }

  .datepicker-close {
    display: none;
    position: absolute;
    width: 34px;
    height: 100%;
    top: 0;
    right: 0;
    cursor: pointer;
  }

  .datepicker-close:before {
    display: block;
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    left: 50%;
    top: 50%;
    margin-left: -8px;
    margin-top: -8px;
    text-align: center;
    background: #ccc;
    color: #fff;
    border-radius: 50%;
    background: #ccc
      url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3IDciIHdpZHRoPSI3IiBoZWlnaHQ9IjciPjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik01LjU4LDVsMi44LTIuODFBLjQxLjQxLDAsMSwwLDcuOCwxLjZMNSw0LjQxLDIuMiwxLjZhLjQxLjQxLDAsMCwwLS41OC41OGgwTDQuNDIsNSwxLjYyLDcuOGEuNDEuNDEsMCwwLDAsLjU4LjU4TDUsNS41OCw3LjgsOC4zOWEuNDEuNDEsMCwwLDAsLjU4LS41OGgwWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuNSAtMS40OCkiIHN0eWxlPSJmaWxsOiNmZmYiLz48L3N2Zz4NCg==')
      no-repeat 50% 50%;
  }

  .datepicker__clearable:hover:before {
    display: none;
  }
  .datepicker__clearable:hover .datepicker-close {
    display: block;
  }

  .datepicker-close:hover:before {
    background-color: #afafaf;
  }

  .datepicker > input {
    color: inherit;
    // transition: all 200ms ease;
    border-radius: 4px;
    border: 0;
    background: none;
    height: 28px;
    box-sizing: border-box;
    outline: none;
    padding: 0 5px;
    width: 100%;
    user-select: none;
    font-family: Monaco;
    letter-spacing: -0.7px;
  }

  // .datepicker > input.focus {
  //   border-color: #3f97e3;
  //   -webkit-box-shadow: 0 0 5px rgba(59, 180, 242, 0.3);
  //   box-shadow: 0 0 5px rgba(59, 180, 242, 0.3);
  // }

  .datepicker > input:disabled {
    cursor: not-allowed;
    background-color: #ebebe4;
    border-color: #e5e5e5;
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  .datepicker-popup {
    right: 0px;
    border-radius: 4px;
    position: absolute;
    transition: all 200ms ease;
    opacity: 1;
    transform: scaleY(1);
    font-size: 12px;
    background: #fff;
    box-shadow: 0 1px 6px rgba(99, 99, 99, 0.2);
    margin-top: 2px;
    outline: 0;
    padding: 5px;
    overflow: hidden;
    z-index: 999;
    &.top {
      bottom: 35px;
      transform-origin: center bottom;
    }
    &.bottom {
      top: 35px;
      transform-origin: center top;
    }
    &__sidebar {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100px;
      height: 100%;
      padding: 5px;
      border-right: solid 1px #eaeaea;
    }
    &__shortcut {
      display: block;
      width: 100%;
      border: 0;
      background-color: transparent;
      line-height: 34px;
      font-size: 12px;
      color: #666;
      text-align: left;
      outline: none;
      cursor: pointer;
      white-space: nowrap;
      &:hover {
        color: #3f97e3;
      }
    }
    &__body {
      margin-left: 100px;
      padding-left: 5px;
    }
  }

  .datepicker-inline {
    position: relative;
    margin-top: 0;
  }

  .datepicker-range {
    min-width: 280px;
  }

  .datepicker-range .datepicker-popup {
    width: 520px;
  }

  .datepicker-bottom {
    float: left;
    width: 100%;
    text-align: right;
  }

  .datepicker-btn {
    padding: 5px 10px;
    background: #3f97e3;
    color: #fff;
    border-radius: 2px;
    display: inline-block;
    cursor: pointer;
  }
  .datepicker-anim-enter-active {
    transform-origin: 0 0;
    animation: datepicker-anim-in 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .datepicker-anim-leave-active {
    transform-origin: 0 0;
    animation: datepicker-anim-out 0.2s cubic-bezier(0.755, 0.05, 0.855, 0.06);
  }

  .datepicker__buttons {
    display: block;
    text-align: right;
  }

  .datepicker__buttons button {
    display: inline-block;
    font-size: 13px;
    border: none;
    cursor: pointer;
    margin: 10px 0 0 5px;
    padding: 5px 15px;
    color: #ffffff;
  }

  .datepicker__buttons .datepicker__button-select {
    background: #3f97e3;
  }

  .datepicker__buttons .datepicker__button-cancel {
    background: #666;
  }

  @keyframes datepicker-anim-in {
    0% {
      opacity: 0;
      transform: scaleY(0.8);
    }
    to {
      opacity: 1;
      transform: scaleY(1);
    }
  }

  @keyframes datepicker-anim-out {
    0% {
      opacity: 1;
      transform: scaleY(1);
    }
    to {
      opacity: 0;
      transform: scaleY(0.8);
    }
  }
</style>
