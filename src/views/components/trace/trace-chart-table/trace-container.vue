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
.trace {
    font-size: 12px;
    margin: 5px;
    height: 100%;
    overflow: auto;
  }
  .trace-header {
    display: flex;
    border: 2px solid #ddd;
    border-left: 0;
    border-right: 0;
  }

  .trace-header div {
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    line-height: 30px;
    background-color: aliceblue;
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap        
  }



  .trace-item {
    display: flex;
  }
  .trace-item.selected {
    background: beige;
  }

  .trace-item div {
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap
  }
  .method {
    width: 45%;
  }
  .argument {
    width: 15%;
  }
  .start-time {
    width: 5%;
    min-width: 100px;
  }
  .gap {
    width: 5%;
  }
  .exec-ms {
    width: 6%;
  }
  .exec-percent {
    width: 10%;
  }
  .self {
    width: 5%;
  }
  .api {
    width: 10%;
  }
  .agent {
    width: 15%;
  }
  .application {
    width: 15%;
  }
</style>

