<template>
  <Dropdown @on-clickoutside="handleClose" placement="bottom-start" trigger="custom" :visible="visible" class="mr15">
    <div @click="handleOpen">
        <div class="flex-c">
          <span class="mr5">{{this.data.filter(i => i.key == this.value).length?this.data.filter(i => i.key == this.value)[0].label || this.data.filter(i => i.key == this.value)[0].name : ''}}</span><Icon type="md-arrow-dropdown" />
        </div>
    </div>
    <DropdownMenu slot="list">
      <div class="rk-select-search">
        <input class="rk-select-search-input" v-model="search">
      </div>
      <div class="rk-select-wrapper">
        <li class="ivu-dropdown-item" @click="handleSelect(i)" v-for="(i, index) in filterData" :key="index">{{i.label || i.name}}</li>
      </div>
    </DropdownMenu>
  </Dropdown>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class RkSelect extends Vue {
  @Prop() data: any;
  @Prop() value: any;
  @Prop({ default: '' }) callValue: string;
  search: string = '';
  visible: boolean = false;
  get filterData() {
    return this.data.filter((i: any) => i.toString().indexOf(this.search) !== -1);
  }
  handleOpen() {
    this.visible = true;
  }
  handleClose() {
    this.visible = false;
  }
  handleSelect(i: any) {
    const temp = this.callValue ? i[this.callValue] : i;
    this.$emit('input', temp);
    this.visible = false;
  }
}
</script>

<style lang="scss" scoped>
.rk-select-wrapper{
    overflow: auto;
    max-height: 200px;
  }
.rk-select-search {
  padding: 8px;
  position: relative;
  background-color: #eaeef1;
  top: -5px;
  border-bottom: 1px solid #ddd;
  border-radius: 4px 4px 0 0;
 &:before{
    width: 16px;
    height: 16px;
    display: block;
    content: '';
    position: absolute;
    top: 14px;
    left: 13px;
    background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTQ1MTQxNTU5NDY5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIwNDMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTkzOC4yIDgzMi42TDcyMy44IDYxOC4xYy0yLjUtMi41LTUuMy00LjQtNy45LTYuNCAzNi4yLTU1LjYgNTcuMy0xMjEuOCA1Ny4zLTE5My4xQzc3My4zIDIyMi44IDYxNC42IDY0IDQxOC43IDY0UzY0IDIyMi44IDY0IDQxOC42YzAgMTk1LjkgMTU4LjggMzU0LjYgMzU0LjYgMzU0LjYgNzEuMyAwIDEzNy41LTIxLjIgMTkzLjItNTcuNCAyIDIuNyAzLjkgNS40IDYuMyA3LjhMODMyLjUgOTM4YzE0LjYgMTQuNiAzMy43IDIxLjkgNTIuOCAyMS45IDE5LjEgMCAzOC4yLTcuMyA1Mi44LTIxLjggMjkuMi0yOS4xIDI5LjItNzYuNCAwLjEtMTA1LjVNNDE4LjcgNjYxLjNDMjg0LjkgNjYxLjMgMTc2IDU1Mi40IDE3NiA0MTguNiAxNzYgMjg0LjkgMjg0LjkgMTc2IDQxOC43IDE3NmMxMzMuOCAwIDI0Mi42IDEwOC45IDI0Mi42IDI0Mi43IDAgMTMzLjctMTA4LjkgMjQyLjYtMjQyLjYgMjQyLjYiIHAtaWQ9IjIwNDQiIGZpbGw9IiNhZmFmYmYiPjwvcGF0aD48L3N2Zz4=);
  }

  .rk-select-search-input {
  border: 1px solid #ddd;
  padding: 3px 10px 3px 25px;
  outline: 0;
  width: 100%;
  border-radius: 4px;

}
}

</style>
