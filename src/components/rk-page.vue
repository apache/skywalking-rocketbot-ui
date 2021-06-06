<!-- Licensed to the Apache Software Foundation (ASF) under one or more
contributor license agreements.  See the NOTICE file distributed with
this work for additional information regarding copyright ownership.
The ASF licenses this file to You under the Apache License, Version 2.0
(the "License"); you may not use this file except in compliance with
the License.  You may obtain a copy of the License at
  http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. -->
<template>
  <span class="rk-page flex-h">
    <svg class="icon cp mr-5" @click="pre">
      <use xlink:href="#chevron-left"></use>
    </svg>
    <input class="rk-page-input tc mr-5" type="text" v-model="currentShowPage" @keyup.enter="goToCertainPage" />
    <span class="mr-5">/</span>
    <span class="mr-5">{{ Math.ceil(this.total / this.currentSize) }}</span>
    <svg class="icon cp" @click="next">
      <use xlink:href="#chevron-right"></use>
    </svg>
  </span>
</template>
<script lang="ts">
  import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

  @Component
  export default class RkPage extends Vue {
    @Prop() public currentPage!: number ;
    @Prop() public currentSize!: number ;
    @Prop() public total!: number ;

    public currentShowPage: string = this.currentPage.toString();
    get last(): number {
      if (this.currentPage * this.currentSize > this.total) {
        return this.total;
      }
      return this.currentPage * this.currentSize;
    }
    get totalPages(): number {
      return Math.ceil(this.total / this.currentSize);
    }

    private next(): void {
      if ( Number(this.currentShowPage) < this.totalPages) {
        this.currentShowPage = String(Number(this.currentShowPage) + 1);
        this.$emit('changePage', this.currentShowPage);
      }
    }

    private  pre(): void {
      if ( Number(this.currentShowPage) > 1 ) {
        this.currentShowPage = String(Number(this.currentShowPage) - 1);
        this.$emit('changePage', this.currentShowPage);
      }
    }

    private  goToCertainPage() {
      const regInt: RegExp = /^0*[1-9]\d*$/;
      if (regInt.test( this.currentShowPage.toString() ) && Number(this.currentShowPage) <= this.totalPages) {
        this.$emit('changePage', this.currentShowPage);
      }
    }
  }
</script>
<style lang="scss">
  .rk-page {
    display: inline-flex;
    .icon {
      padding: 3px;
      opacity: 0.5;
      &:hover {
        opacity: 1;
        color: #448dfe;
      }
    }
  }
  .rk-page-input {
    width: 40px;
    outline: 0;
    border-style: unset;
    border-radius: 4px;
    border: 1px solid #c1c5ca55;
  }
</style>