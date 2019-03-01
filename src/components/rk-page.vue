/**
 * pagement
 * @param {
 *   currentPage: Number
 *   currentSize: Number
 *   total      : Number
 *   name       : String (optional)
 * }}
 */
<template>
  <span class="rk-page flex-h">
    <svg class="icon cp mr-5" @click="pre">
      <use xlink:href="#chevron-left"></use>
    </svg>
    <input class="rk-page-input tc mr-5" type="text" v-model="currentPage">
    <span class="mr-5">/</span>
    <span class="mr-5">{{Math.ceil(this.total / this.currentSize)}}</span>
    <svg class="icon cp" @click="next">
      <use xlink:href="#chevron-right"></use>
    </svg>
  </span>
</template>
<script lang="js">      // tslint:disable
export default {
  name: 'RkPage',
  props: {
    name: {
      type: String,
      default: '',
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    currentSize: {
      type: Number,
      default: 10,
    },
    total: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    last() {
      if (this.currentPage * this.currentSize > this.total) {
        return this.total;
      }
      return this.currentPage * this.currentSize;
    },
  },
  data() {
    return {
      current: '',
    };
  },
  watch: {
    currentPage() { this.current = this.currentPage; },
  },
  beforeMount() {
    this.current = this.currentPage;
  },
  methods: {
    next() {
      if (this.current !== Math.ceil(this.total / this.currentSize)) {
        this.current = this.current + 1;
        this.$emit('changePage', this.current);
      }
    },
    pre() {
      if (this.current !== 1) {
        this.current = this.current - 1;
        this.$emit('changePage', this.current);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.rk-page{
  display: inline-flex;
  .icon{
    padding: 3px;
    opacity: 0.5;
    &:hover{
      opacity: 1;
      color: #458eff;
    }
  }
}
.rk-page-input{
  width: 40px;
  outline: 0;
  border-style: unset;
  border-radius: 4px;
  border: 1px solid #c1c5ca55;
}
</style>
