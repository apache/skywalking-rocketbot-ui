<template>
<div class="rk-alarm-search-box container">

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
.rk-alarm-search-box{
  flex-shrink: 0;
  padding-top: 15px;
  padding-bottom:  15px;
  background-color: #f6f7fb;
  // color: #eaeaea;
}
</style>
