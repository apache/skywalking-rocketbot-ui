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
  <span class="micro-page flex-h">
    <svg class="icon cp icon-l" @click="pre">
      <use xlink:href="#chevron-left"></use>
    </svg>
    <input class="micro-page-input" type="text" v-model="currentPage">
    <svg class="icon cp icon-r" @click="next">
      <use xlink:href="#chevron-right"></use>
    </svg>
    <span class="sm grey">{{this.total}}</span>
  </span>
</template>
<script lang="js">      // tslint:disable
export default {
  name: 'MicroPage',
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
  mounted() {
    this.$emit('changePage', this.current);
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
.micro-page{
  display: inline-flex;
  .icon{
    padding: 3px;
    opacity: 0.5;
    &:hover{
      opacity: 1;
    }
  }
  .icon-l {
    margin-left: 5px;
  }
  .icon-r {
    margin-right: 5px;
  }
}
.micro-page-input{
  width: 40px;
  text-align: center;
  outline: 0;
  border-style: unset;
  border-radius: 4px;
  border: 1px solid #c1c5ca55;
}
</style>
