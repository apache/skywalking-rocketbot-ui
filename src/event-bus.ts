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

import Vue, { VueConstructor } from 'vue';

type VueComponentVM = Vue & { _uid: string };

interface Handles {
  [key: string]: any[];
}

export class EventBus {
  private readonly Vue: any;
  private readonly eventMapUid: any;
  private handles!: Handles;

  constructor(vue: VueConstructor) {
    if (!this.handles) {
      Object.defineProperty(this, 'handles', {
        value: {},
        enumerable: false,
      });
    }
    this.Vue = Vue;
    // _uid and event name map
    this.eventMapUid = {};
  }

  /**
   * Map events and component relationships while listening for events.
   * @param eventName
   * @param vm vue component object or undefined, if is undefined, event not auto destroy.
   * @param callback event callback
   */
  public $on(
    eventName: string,
    vm: Vue | undefined,
    callback: (cb: any) => void,
  ) {
    if (!this.handles[eventName]) {
      this.handles[eventName] = [];
    }
    this.handles[eventName].push(callback);
    if (vm instanceof this.Vue) {
      const vueComponentVM = vm as VueComponentVM;
      this.setEventMapUid(vueComponentVM._uid, eventName);
    }
  }

  /**
   * eventBus.$emit.
   * @param eventName
   * @param params
   */
  public $emit(eventName: string, ...params: any) {
    if (this.handles[eventName]) {
      const len = this.handles[eventName].length;
      for (let i = 0; i < len; i++) {
        this.handles[eventName][i](...params);
      }
    }
  }

  /**
   * eventBus.$off.
   * @param eventName
   */
  public $off(eventName: string) {
    delete this.handles[eventName];
  }

  /**
   * eventBus.$offVmEvent.
   * @param uid uid of VueComponentVM
   */
  public $offVmEvent(uid: string) {
    const currentEvents = this.eventMapUid[uid] || [];
    currentEvents.forEach((event: any) => {
      this.$off(event);
    });
  }

  private setEventMapUid(uid: string, eventName: string) {
    if (!this.eventMapUid[uid]) {
      this.eventMapUid[uid] = [];
    }
    // Push the name of each _uid subscription to the array to which the respective uid belongs.
    this.eventMapUid[uid].push(eventName);
  }
}

const $EventBus = {
  install: (vue: VueConstructor) => {
    vue.prototype.$eventBus = new EventBus(vue);
    vue.mixin({
      deactivated() {
        (this as VueComponentVM).$eventBus.$offVmEvent(
          (this as VueComponentVM)._uid,
        );
      },
      beforeDestroy() {
        (this as VueComponentVM).$eventBus.$offVmEvent(
          (this as VueComponentVM)._uid,
        );
      },
    });
  },
};

export default $EventBus;
