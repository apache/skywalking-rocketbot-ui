<template>
  <el-date-picker style="top: 87px;left: 40px;position: absolute;"
    v-model="date"
    type="datetimerange"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :default-time="['12:00:00']">
  </el-date-picker>
</template>
<script lang="js">
/* eslint-disable */
export default{
  computed: {
    date: {
      get() {
        return [this.$store.state.rocketbot.duration.start, this.$store.state.rocketbot.duration.end];
      },
      set(value) {
        this.$store.dispatch('SET_DURATION', value);
      },
    },
  },
};
</script>
<style lang="scss">
</style>
