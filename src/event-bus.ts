import { Vue } from 'vue-property-decorator';
import { VueConfiguration } from 'vue/types/vue';

type VueComponentVM = Vue & { _uid: string; };

export class EventBus {
  private readonly Vue: any;
  private readonly eventMapUid: any;
  private handles: any;

  constructor(vue: Vue) {
    if (!this.handles) {
      Object.defineProperty(this, 'handles', {
        value: {},
        enumerable: false,
      });
    }
    this.Vue = vue;
    // _uid和EventName的映射
    this.eventMapUid = {};
  }

  public setEventMapUid(uid: string, eventName: string) {
    if (!this.eventMapUid[uid]) {
      this.eventMapUid[uid] = [];
    }
    // 把每个_uid订阅的事件名字push到各自uid所属的数组里
    this.eventMapUid[uid].push(eventName);
  }

  // vm是在组件内部使用时组件当前的this用于取_uid
  public $on(eventName: string, vm: Vue, callback: (cb: any) => void) {
    if (!this.handles[eventName]) {
      this.handles[eventName] = [];
    }
    this.handles[eventName].push(callback);
    if (vm instanceof this.Vue) {
      const vueComponentVM = vm as VueComponentVM;
      this.setEventMapUid(vueComponentVM._uid, eventName);
    }
  }

  public $emit() {
    const args = [...arguments];
    const eventName = args[0];
    const params = args.slice(1);
    if (this.handles[eventName]) {
      const len = this.handles[eventName].length;
      for (let i = 0; i < len; i++) {
        this.handles[eventName][i](...params);
      }
    }
  }

  public $offVmEvent(uid: string) {
    const currentEvents = this.eventMapUid[uid] || [];
    currentEvents.forEach((event: any) => {
      this.$off(event);
    });
  }

  public $off(eventName: string) {
    delete this.handles[eventName];
  }
}

// 下面写成Vue插件形式，直接引入然后Vue.use($EventBus)进行使用
const $EventBus = {
  install: (vue: any, option: VueConfiguration) => {
    vue.prototype.$eventBus = new EventBus(vue);
    vue.mixin({
      beforeDestroy() {
        // 拦截beforeDestroy钩子自动销毁自身所有订阅的事件
        this.$eventBus.$offVmEvent(this._uid);
      },
    });
  },
};


export default $EventBus;
