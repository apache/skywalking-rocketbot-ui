<template>
<span class="micro-page">
  <span class="dao-btn-group">
    <button class="rk-page-btn mr5" @click="pre"
    :disabled="this.current == 1">
      <Icon type="ios-arrow-back" />
    </button>
    <button class="rk-page-btn" @click="next"
    :disabled="total=== 0 || this.current == Math.ceil(this.total / this.currentSize)">
      <Icon type="ios-arrow-forward" />
    </button>
  </span><span class="micro-page-info"><span v-if="total">{{currentPage===1?1:((currentPage-1)*currentSize+1)}} -
    {{last}}</span> Totol {{total}} {{name}}</span>
</span>
</template>
<script lang="js">
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
.micro-page .dao-btn{
  padding: 8px;
  fill: #3d444f;
  &:disabled{
    fill: #ccd1d9;
  }
  .icon{fill:inherit;}
}
.micro-page-info{
  margin-left: 10px;
  color: #9ba3af;
  vertical-align: middle;
}
.rk-page-btn{
  cursor: pointer;
  border-radius: 4px;
  background-color: #5487ed;
  border: 0;
  color: #fff;
  outline: none;
  padding: 0px .5em;
  height: 23px;
  vertical-align: bottom;
  -webkit-transition: background-color .3s;
  transition: background-color .3s;
  &:hover {
    background-color: #6296ff;
  }
}
</style>
