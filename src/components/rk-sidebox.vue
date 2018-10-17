<template>
  <div>
    <div class="rk-sidebox-backdrop" v-show="show" @click="handleHide"></div>
    <aside class="rk-sidebox" :style="show?`width:${width};right:0`:`width:${width};right:-${width}`">
      <h3 class="rk-sidebox-title">{{this.title}}
        <div class="r rk-sidebox-close" @click="handleHide">
          <ion-icon name="close"></ion-icon>
        </div>
      </h3>
      <slot/>
    </aside>
  </div>
</template>
<script lang="ts">
export default {
  name: 'rkSidebox',
  props: {
    show: {},
    title: {
      default: '',
    },
    width: {
      default: '648px',
    },
  },
  methods: {
    handleHide() {
      this.$emit('update:show', false);
    },
  },
};
</script>

<style lang="scss">
.rk-sidebox-backdrop{
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(31, 33, 38, 0.3);
  z-index: 199;
}
.rk-sidebox{
  overflow-y: auto;
  will-change: right;
  transition:right .3s;
  position: fixed;
  right: 0;
  top: 52px;
  bottom: 0;
  z-index: 999999999;
  padding: 25px 20px 20px;
  background-color: #fff;
  border: solid 1px #ccd1d9;
}
.rk-sidebox-title {
  font-size: 18px;
  margin-bottom: 30px;
  line-height: 20px;
  &::before{
    content:"";
    display: block;
    float: left;
    width:3px;
    height: 18px;
    margin-top: 1px;
    background-color: #595f69;
    margin-right:8px;
  }
}
.rk-sidebox-close{
  cursor: pointer;
  color: #217ef2;
  .close-btn{
    font-size:14px;
    font-weight: normal;
  }
}
</style>
