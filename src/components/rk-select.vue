<template>
  <Dropdown trigger="click" style="margin-left: 20px">
    <a href="javascript:void(0)">
      click 触发
      <Icon type="arrow-down-b"></Icon>
    </a>
    <DropdownMenu slot="list">
        <DropdownItem v-for="i in data" :key="i.label">{{i.label}}</DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Model } from 'vue-property-decorator';

export default class Nav extends Vue {
  @Prop({
    type: Array,
    default: () => [],
  }) data;
  @Model('input', { type: String }) test: String;
  changed(ev) {
    this.$emit('input', ev.target.value);
  }

  @Prop({
    type: String,
    default: 'OK',
  }) name: String;

  message: String = 'Name';

  say(): String {
    return this.message;
  }
}
</script>

<style lang="scss" scoped>
.rk-nav{
  border-bottom:1px solid rgba(0,0,0,.05);
  height: 40px;
  background-color: #f6f7fb;
  padding: 0 30px;
}
.rk-nav-i{
  display: inline-block;
  height: 41px;
  margin-right: 20px;
  line-height: 39px;
  font-weight: 600;
  border-bottom: 2px;
  border-bottom-style: solid;
  color: rgba(61, 68, 79, .6);
  border-color: rgba(0, 0, 0, 0);
  will-change: border-color,color;
  transition: border-color .3s, color .3s;
  &:hover, &.active{
    border-color: #3880ff;
    color: #3880ff;
  }
}
</style>
