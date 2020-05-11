<template>
  <div class="flex-h">
    <template v-if="compType === 'service' || compType === 'database'">
      <div class="rk-dashboard-bar-btn">
        <svg
          class="icon lg vm cp rk-btn ghost"
          :style="`color:${!rocketGlobal.edit ? '' : '#ffc107'}`"
          @click="handleSetEdit"
        >
          <use :xlink:href="!rocketGlobal.edit ? '#lock' : '#lock-open'"></use>
        </svg>
      </div>
      <div v-if="rocketGlobal.edit" class="rk-dashboard-bar-btn">
        <input id="tool-bar-file" type="file" name="file" title="" accept=".json" @change="importData" />
        <label class="rk-btn ghost input-label" for="tool-bar-file">
          <svg class="icon lg vm cp " :style="`color: #ffc107; marginTop: 0px`">
            <use :xlink:href="'#folder_open'"></use>
          </svg>
        </label>
      </div>
      <div v-if="rocketGlobal.edit" class="rk-dashboard-bar-btn">
        <svg class="icon lg vm cp rk-btn ghost" :style="`color: #ffc107`" @click="exportData">
          <use :xlink:href="'#save_alt'"></use>
        </svg>
      </div>
    </template>

    <div class="rk-dashboard-bar-btn">
      <svg class="icon lg vm cp rk-btn ghost" @click="handleOption">
        <use xlink:href="#retry"></use>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
  import { Vue, Component, Prop } from 'vue-property-decorator';
  import { Action, Mutation } from 'vuex-class';
  import { readFile } from '@/utils/readFile';
  import { saveFile } from '@/utils/saveFile';
  @Component({})
  export default class ToolBarBtns extends Vue {
    @Prop() private compType!: any;
    @Prop() private rocketGlobal!: any;
    @Prop() private rocketComps!: any;
    @Prop() private durationTime!: any;
    @Mutation('SET_COMPS_TREE') private SET_COMPS_TREE: any;
    @Action('SET_EDIT') private SET_EDIT: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;

    private handleOption() {
      return this.MIXHANDLE_GET_OPTION({
        compType: this.compType,
        duration: this.durationTime,
      });
    }
    private handleSetEdit() {
      this.SET_EDIT(!this.rocketGlobal.edit);
    }
    private async importData(event: any) {
      try {
        const data: any = await readFile(event);
        if (!Array.isArray(data)) {
          throw new Error();
        }
        const { children, name, query, type } = data[0];
        if (children && name && query && type) {
          this.SET_COMPS_TREE(data);
          window.localStorage.setItem('dashboard', JSON.stringify(data));
        } else {
          throw new Error('error');
        }
        const el: any = document.getElementById('tool-bar-file');
        el!.value = '';
      } catch (e) {
        this.$modal.show('dialog', { text: 'ERROR' });
      }
    }
    private exportData() {
      const data = this.rocketComps.tree;
      const name = 'dashboard.json';
      saveFile(data, name);
    }
  }
</script>

<style lang="scss" scoped>
  .rk-dashboard-bar-btn {
    padding: 0 5px;
    border-right: 2px solid #252a2f;
    height: 19px;
  }
  #tool-bar-file {
    display: none;
  }
  .input-label {
    display: inline;
    line-height: inherit;
  }
</style>
