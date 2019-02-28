<template>
  <footer class="rk-footer trans" :class="{'rk-footer-edit':rocketbotGlobal.edit, 'rk-footer-dark': $route.path === '/topology'}">
    <div class="rk-footer-time">
      <div class="flex-h cp" :class="rocketbotGlobal.edit?'':'link-hover'" @click="setEdit">
        <svg class="icon mr-5">
          <use xlink:href="#settings"></use>
        </svg>
        <span>{{rocketbotGlobal.edit?'Edit Mode':'User Mode'}}</span>
      </div>
      <div class="sm flex-h">
        <RkDate v-model="time" position="top" format="YYYY-MM-DD HH:mm:ss"/>
        <span>UTC {{utc >= 0 ? '+' : ''}}</span><input v-model="utc" min='-12' max="12" style="color:inherit;background: 0;border: 0;outline: none; width:27px" type="number">
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { State, Action } from 'vuex-class';
import timeFormat from '@/utils/timeFormat';

@Component
export default class Footer extends Vue {
  @State('rocketbot') private rocketbotGlobal: any;
  @Action('SET_DURATION') private SET_DURATION: any;
  @Action('SET_EDIT') private SET_EDIT: any;

  private time: Date[] = [new Date(), new Date()];
  private utc: any = window.localStorage.getItem('utc') || -(new Date().getTimezoneOffset() / 60);
  private utcCopy: any = window.localStorage.getItem('utc') || -(new Date().getTimezoneOffset() / 60);
  @Watch('time')
  private onTimeUpdate() {
    this.SET_DURATION(timeFormat(this.time));
  }
  @Watch('utc')
  private onUtcUpdate() {
    if (this.utc < -12) { this.utc = -12; }
    if (this.utc > 12) { this.utc = 12; }
    if (this.utc === '') { this.utc = 0; }
    window.localStorage.setItem('utc', this.utc.toString());
    this.time = [
      new Date(this.rocketbotGlobal.duration.start.getTime() + ((this.utc - this.utcCopy) * 3600000)),
      new Date(this.rocketbotGlobal.duration.end.getTime() + ((this.utc - this.utcCopy) * 3600000))];
    this.utcCopy = this.utc;
  }
  private setEdit() {
    this.SET_EDIT(this.rocketbotGlobal.edit ? false : true);
  }
  private beforeMount() {
    this.time = [this.rocketbotGlobal.duration.start, this.rocketbotGlobal.duration.end];
  }
}
</script>

<style scoped>
.rk-footer {
  color: #515a6e;
  flex-shrink: 0;
  padding-right: 15px;
  padding-left: 15px;
  padding-bottom: 1px;
  border-top: 1px solid #c1c5ca41;
}
.rk-footer-dark {
  color: #ddd;
  background:#252a2f;
  border-top: 1px solid #252a2f;
}
.rk-footer-edit {
  color: #eee;
  background:#458eff;
  border-top: 1px solid #458eff;
}

.rk-footer-time{
  justify-content: space-between;
  display: flex;
}
</style>
