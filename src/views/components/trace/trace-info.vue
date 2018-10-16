<template>
<div>
<div class="rk-trace-search-box container">

  </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State } from '@/store/modules/options.ts';
import { Component, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class SearchBox extends Vue {
  @Prop() stateOptions: State;
}
</script>
<style lang="scss">
.rk-trace-search-subbox{
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-top: 15px;
  padding-bottom:  15px;
  background-color: #f6f7fb;
  border-bottom:1px solid rgba(0,0,0,.03);
  font-size: 13px;
  .item{
    margin-right: 30px;
  }
  .label{
    font-weight: 600;
  }
  .rk-trace-input{
    background: 0;
    border: 0;
    outline: none;
    padding-bottom: 3px;
    border-bottom: 1px solid rgba(34, 34, 34, 0.3);
    &:focus{
      border-color: #6fa4ff;
    }
  }
}
.rk-trace-search-box{
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding-top: 15px;
  padding-bottom:  15px;
  background-color: #2f333c;
  color: #fff;
  border-bottom:1px solid rgba(0,0,0,.05);
  .item{
    margin-right: 30px;
  }
  .label{
    font-weight: 600;
    font-size: 13px;
  }
  .rk-trace-input{
    color: #e8e8e8;
    background: 0;
    border: 0;
    outline: none;
    padding-bottom: 3px;
    border-bottom: 1px solid rgba(250,250,255,.5);
    &:focus{
      border-color: #6fa4ff;
    }
  }
}
</style>
