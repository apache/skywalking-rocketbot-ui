<template>
    <div class="trace">
      <div class="trace-header">
        <div class="method">
          Method
        </div>
        <div class="start-time">
          Start Time
        </div>
        <div class="gap">
          Gap(ms)
        </div>
        <div class="exec-ms">
          Exec(ms)
        </div>
        <div class="exec-percent">
          Exec(%)
        </div>
        <div class="self">
          Self(ms)
        </div>
        <div class="api">
          API
        </div>
        <div class="application">
          Service
        </div>
      </div>

      <slot> </slot>
    </div>
</template>
<style lang="scss" scoped>
@import './trace.scss';
.trace {
    font-size: 12px;
    height: 100%;
    overflow: auto;
  }
  .trace-header {
    display: flex;
    border-left: 0;
    border-right: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .trace-header div {
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    line-height: 30px;
    background-color: #f3f4f9;;
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap        
  }
</style>

