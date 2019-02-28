<template>
  <div class="rk-chart-edit" draggable="true" @dragstart="$emit('dragstart', index)" @dragover="$event.preventDefault();" @drop="$emit('drop', index)">
    <div class="rk-chart-edit-title clear cm ell">
      <svg class="icon mr-10 vm">
        <use xlink:href="#marquee-selection"></use>
      </svg>
      <span class="vm">{{`${o} ${name}`}}</span>
      <svg class="icon red r lg cp" @click="DELETE_COMP(index)">
        <use xlink:href="#file-deletion"></use>
      </svg>
    </div>
    <div class="rk-chart-edit-container">
      <div class="flex-h mb-5">
        <div class="title grey">Title:</div>
        <input type="text" class="rk-chart-edit-input long" :value="title" @change="EDIT_COMP({index,type:'title',value:$event.target.value})">
      </div>
      <div class="flex-h">
        <div class="title grey">Width:</div>
        <input type="number" min="1" max="12" class="rk-chart-edit-input long" :value="width" @change="EDIT_COMP({index,type:'width',value:$event.target.value})">
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { State, Getter, Mutation } from 'vuex-class';
import { Component, Prop } from 'vue-property-decorator';

@Component
export default class Response extends Vue {
  @Mutation('DELETE_COMP') private DELETE_COMP: any;
  @Mutation('EDIT_COMP') private EDIT_COMP: any;
  @Prop() private o!: string;
  @Prop() private index!: number;
  @Prop() private name!: string;
  @Prop() private title!: string;
  @Prop() private width!: number;
}
</script>
<style lang="scss">
.rk-chart-edit{
  padding-left: 5px;
  padding-right: 5px;
}
.rk-chart-edit-title{
  padding: 5px 15px;
  line-height: 15px;
  border-radius: 4px;
  background-color: rgba(196, 200, 225, .2);
}
.rk-chart-edit-container{
  padding: 7px 10px;
  border: 1px dashed rgba(196, 200, 225, .4);
  margin-bottom: 10px;
  border-top: 0;
  .title{
    width: 70px;
    flex-shrink: 0;
  }
}
.rk-chart-edit-input{
  border: 0;
  outline: 0;
  padding: 4px 10px;
  border-radius: 3px;
  border: 1px solid #c1c5ca41;
  // background-color: rgba(196, 200, 225, 0.05);
}
</style>
