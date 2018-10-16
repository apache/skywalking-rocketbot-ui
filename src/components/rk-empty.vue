<template>
<div class="empty-state">
  <div class="empty-state-title">
    {{title}}
    <slot name="title"></slot>
  </div>
  <div class="empty-state-text">
    {{text}}
    <slot name="text"></slot>
  </div>
</div>
</template>

<script lang="ts">
export default {
  name: 'EmptyState',
  props: ['title', 'text'],
};
</script>

<style scoped lang="scss">
.empty-state {
  padding: 15px;
  text-align: center;
  color: #9ba3af;
  border-bottom: 1px dashed #e4e7ed;
  border-top:0;
}
.empty-state-title {
  font-size: 18px;
  font-weight: 500;
  line-height: 40px;
}
.empty-state-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
}
</style>
