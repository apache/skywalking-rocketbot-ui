import { Vue } from 'vue-property-decorator';
import { VueConfiguration } from 'vue/types/vue';

class EventHub {
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
    this.eventMapUid = {}; // _uid和EventName的映射
  }

  public setEventMapUid(uid: string, eventName: string) {
    if (!this.eventMapUid[uid]) {
      this.eventMapUid[uid] = [];
    }
    this.eventMapUid[uid].push(eventName); // 把每个_uid订阅的事件名字push到各自uid所属的数组里
  }

  public $on(eventName: string, callback: () => {}, vm: any) { // vm是在组件内部使用时组件当前的this用于取_uid
    if (!this.handles[eventName]) {
      this.handles[eventName] = [];
    }
    this.handles[eventName].push(callback);
    if (vm instanceof this.Vue) {
      this.setEventMapUid(vm._uid, eventName);
    }
  }

  public $emit() {
    // console.log('EventHub emit eventName===', eventName)
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

// 下面写成Vue插件形式，直接引入然后Vue.use($EventHub)进行使用
const $EventHub = {
  install: (vue: any, option: VueConfiguration) => {
    vue.prototype.$eventHub = new EventHub(vue);
    vue.mixin({
      beforeDestroy() {
        console.log('$offVmEvent: ', this._uid);

        this.$eventHub.$offVmEvent(this._uid); // 拦截beforeDestroy钩子自动销毁自身所有订阅的事件
      },
    });
  },
};


export default $EventHub;
