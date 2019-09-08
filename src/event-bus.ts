import Vue from 'Vue';

type VueComponentVM = Vue & { _uid: string; };

interface Handles {
  [key: string]: any[];
}

export class EventBus {
  private readonly Vue: any;
  private readonly eventMapUid: any;
  private handles!: Handles;

  constructor(vue: Vue) {
    if (!this.handles) {
      Object.defineProperty(this, 'handles', {
        value: {},
        enumerable: false,
      });
    }
    this.Vue = vue;
    // _uid and event name map
    this.eventMapUid = {};
  }

  /**
   * Map events and component relationships while listening for events.
   * @param eventName
   * @param vm vue component object or undefined, if is undefined, event not auto destroy.
   * @param callback event callback
   */
  public $on(eventName: string, vm: Vue | undefined, callback: (cb: any) => void) {
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

  private setEventMapUid(uid: string, eventName: string) {
    if (!this.eventMapUid[uid]) {
      this.eventMapUid[uid] = [];
    }
    // Push the name of each _uid subscription to the array to which the respective uid belongs.
    this.eventMapUid[uid].push(eventName);
  }

  private $offVmEvent(uid: string) {
    const currentEvents = this.eventMapUid[uid] || [];
    currentEvents.forEach((event: any) => {
      this.$off(event);
    });
  }
}

const $EventBus = {
  install: (vue: any) => {
    vue.prototype.$eventBus = new EventBus(vue);
    vue.mixin({
      deactivated() {
        this.$eventBus.$offVmEvent(this._uid);
      },
      beforeDestroy() {
        this.$eventBus.$offVmEvent(this._uid);
      },
    });
  },
};


export default $EventBus;
