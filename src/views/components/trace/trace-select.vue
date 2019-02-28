<template>
  <div class="rk-trace-bar-select cp flex-h" v-clickout="() => { visible = false;search = '';}" :class="{'active':visible}">
    <div class="rk-trace-bar-i flex-h" @click="visible = !visible">
      <div class="mr-15 rk-trace-bar-i-text">
        <div class="sm grey">{{title}}</div>
        <div class="ell" v-tooltip:right.ellipsis="value.label || ''">{{value.label  || ''}}</div>
      </div>
      <svg class="icon lg trans" :style="`transform: rotate(${visible?180:0}deg)`">
        <use xlink:href="#arrow-down"></use>
      </svg>
    </div>
    <div class="rk-trace-sel" v-if="visible">
      <div v-if="hasSearch">
        <input type="text" class="rk-trace-sel-search" v-model="search" placeholder="Search...">
        <svg class="icon sm close" @click="search = ''" v-if="search">
          <use xlink:href="#clear"></use>
        </svg>
      </div>
      <div class="rk-trace-opt-wrapper scroll_content">
        <div class="rk-trace-opt ell" @click="handleSelect(i)" :class="{'active':i.key === value.key}" v-for="i in filterData" :key="i.key">{{i.label}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class ToolBarSelect extends Vue {
  @Prop() public data!: any;
  @Prop() public value!: any;
  @Prop() public title!: string;
  @Prop({default: false}) public hasSearch!: boolean;
  public search: string = '';
  public visible: boolean = false;
  get filterData() {
    return this.data.filter((i: any) => i.label.toUpperCase().indexOf(this.search.toUpperCase()) !== -1);
  }
  public handleOpen() {
    this.visible = true;
  }
  public handleSelect(i: any) {
    this.$emit('input', i);
    this.visible = false;
  }
}
</script>

<style lang="scss" scoped>
.rk-trace-bar-select {
  position: relative;
  z-index: 1;
  height: 100%;
  justify-content: space-between;
  .sm{ line-height: 12px;}
  .icon { flex-shrink: 0};
}
.rk-trace-bar-i-text{
  max-width: 150px;
  min-width: 80px;
}
.rk-trace-bar-i {
  height: 100%;
  padding: 0 15px;
  border-right: 2px solid #252a2f;
}
.rk-trace-sel{
  position: absolute;
  top: 44px;
  box-shadow: 0 1px 6px rgba(99, 99, 99, 0.2);
  background-color: #252a2f;
  width: 100%;
  border-radius: 3px;
  overflow: hidden;
  .close{
    position: absolute;
    right: 10px;
    top: 12px;
    opacity: 0.6;
    &:hover{opacity: 1;}
  }
}
.rk-trace-opt{
  padding: 7px 15px;
  &.active,&:hover{
    background-color: #40454e;
  }
}
.rk-trace-sel-search{
  width: calc(100% - 4px);
  border:0;
  background-color: #333840;
  color: #eee;
  outline: 0;
  padding: 7px 25px 7px 10px;
  margin: 2px;
}
.rk-trace-opt-wrapper{
  overflow: auto;
  max-height: 200px;
  padding-bottom: 2px;
}
</style>
