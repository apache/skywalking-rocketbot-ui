<template>
    <div class="trace">
      <!--header-->
      <div class="trace-header">
        <div class="method">
          Method
        </div>
        <!-- <div class="argument">
          Argument
        </div> -->
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
        <!-- <div class="class">
          Class
        </div> -->
        <div class="api">
          API
        </div>
        <!-- <div class="agent">
          Instance
        </div> -->
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
    /* justify-content:space-between; */
  }

  .trace-header div {
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    line-height: 30px;
    background-color: aliceblue;
        /* float:left; */
    padding: 0 4px;
    border: 1px solid transparent;
    border-right: 1px dotted silver;
    overflow: hidden;
    line-height: 30px;
    /* float:left; */
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap        
  }



  .trace-item {
    display: flex;
    /* justify-content: space-between; */
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
    /* float:left; */
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap
  }
  .method {
    /* border-right: 1px dashed black; */
    width: 45%;
  }
  .argument {
    /* border-right: 1px dashed black; */
    width: 15%;
  }
  .start-time {
    /* border-right: 1px dashed black; */
    width: 5%;
    min-width: 100px;
  }
  .gap {
    /* border-right: 1px dashed black; */
    width: 5%;
  }
  .exec-ms {
    /* border-right: 1px dashed black; */
    width: 6%;
  }
  .exec-percent {
    width: 10%;
  }
  .self {
    /* border-right: 1px dashed black; */
    width: 5%;
  }
  // .class {
  //   /* border-right: 1px dashed black; */
  //   width: 10%;
  // }
  .api {
    /* border-right: 1px dashed black; */
    width: 10%;
  }
  .agent {
    /* border-right: 1px dashed black; */
    width: 15%;
  }
  .application {
    /* border-right: 1px dashed black; */
    width: 15%;
  }
</style>

