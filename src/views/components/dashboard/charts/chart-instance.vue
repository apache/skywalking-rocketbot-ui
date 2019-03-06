<template>
  <rk-panel :title="title">
    <div>
      {{this.stateDashboard.currentInstance}}
    </div>
  </rk-panel>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import moment from 'dayjs';
@Component
export default class Response extends Vue {
  @Prop() private title!: string;
  @Prop() private type!: string;
  @Prop() private stateDashboard!: any;
}
</script>
