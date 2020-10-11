<template>
  <div class="rk-error-log-bar flex-h">
    <div class="flex-h">
      <ToolBarSelect
        @onChoose="SELECT_LOG_TYPE"
        :title="this.$t('logCategory')"
        :current="logState.type"
        :data="logState.logCategories"
        icon="package"
      />
      <ToolBarSelect
        @onChoose="selectService"
        :title="this.$t('currentApp')"
        :current="rocketOption.currentService"
        :data="rocketOption.services"
        icon="package"
      />
      <ToolBarSelect
        @onChoose="selectInstance"
        :title="this.$t('currentVersion')"
        :current="rocketOption.currentInstance"
        :data="rocketOption.instances"
        icon="disk"
      />
      <ToolBarEndpointSelect
        @onChoose="selectEndpoint"
        :title="this.$t('currentPage')"
        :current="rocketOption.currentEndpoint"
        :data="rocketOption.endpoints"
        icon="code"
      />
      <ToolBarSelect
        @onChoose="SELECT_ERROR_CATALOG"
        :title="this.$t('errorCatalog')"
        :current="logState.category"
        :data="logState.categories"
        icon="disk"
      />
    </div>

    <span class="flex-h rk-right">
      <a class="rk-log-search-btn bg-blue mr-10" @click="queryLogs">
        <svg class="icon mr-5 vm">
          <use xlink:href="#search"></use>
        </svg>
        <span class="vm">{{ this.$t('search') }}</span>
      </a>

      <RkPage :currentSize="10" :currentPage="pageNum" @changePage="handleRefresh" :total="logState.total" />
    </span>
  </div>
</template>

<script lang="ts">
  import { Duration, Option } from '@/types/global';
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import { Action, Getter, Mutation, State } from 'vuex-class';
  import TraceSelect from '../common/trace-select.vue';
  import ToolBarSelect from '../dashboard/tool-bar-select.vue';
  import ToolBarEndpointSelect from '../dashboard/tool-bar-endpoint-select.vue';

  @Component({
    components: { TraceSelect, ToolBarSelect, ToolBarEndpointSelect },
  })
  export default class Bar extends Vue {
    @State('rocketLog') private logState: any;
    @State('rocketOption') private rocketOption: any;
    @Mutation('SELECT_LOG_TYPE') private SELECT_LOG_TYPE: any;
    @Mutation('SELECT_ERROR_CATALOG') private SELECT_ERROR_CATALOG: any;

    @Action('SELECT_SERVICE') private SELECT_SERVICE: any;
    @Action('SELECT_DATABASE') private SELECT_DATABASE: any;
    @Action('SELECT_ENDPOINT') private SELECT_ENDPOINT: any;
    @Action('SELECT_INSTANCE') private SELECT_INSTANCE: any;
    @Action('MIXHANDLE_GET_OPTION') private MIXHANDLE_GET_OPTION: any;

    @Action('QUERY_LOGS') private QUERY_LOGS: any;
    @Getter('durationTime') private durationTime: any;

    private pageNum: number = 1;
    private beforeMount() {
      this.MIXHANDLE_GET_OPTION({
        compType: this.logState.type.key,
        duration: this.durationTime,
      }).then(() => {
        this.queryLogs();
      });
    }

    private handleRefresh(pageNum: number) {
      this.pageNum = pageNum;
      this.queryLogs();
    }

    private selectService(i: any) {
      this.SELECT_SERVICE({ service: i, duration: this.durationTime });
    }

    private selectEndpoint(i: any) {
      this.SELECT_ENDPOINT({ endpoint: i, duration: this.durationTime });
    }

    private selectInstance(i: any) {
      this.SELECT_INSTANCE({ instance: i, duration: this.durationTime });
    }

    private queryLogs() {
      const { currentService, currentInstance, currentEndpoint } = this.rocketOption;
      const { category } = this.logState;
      this.QUERY_LOGS({
        condition: {
          serviceId: currentService.key,
          serviceVersionId: currentInstance.key,
          pagePathId: currentEndpoint.key,
          category: category.key,
          paging: { pageNum: this.pageNum, pageSize: 35, needTotal: true },
          queryDuration: this.durationTime,
        },
      });
    }
  }
</script>

<style scoped lang="scss">
  .rk-error-log-bar {
    flex-shrink: 0;
    background-color: #333840;
    color: #eee;
    width: 100%;
    padding: 8px 15px 12px;
    height: 52px;
    justify-content: space-between;
  }

  .rk-right {
    min-width: 210px;
  }

  .rk-log-search-btn {
    padding: 3px 9px;
    background-color: #484b55;
    border-radius: 4px;
    /*margin-top: 12px;*/
    &.bg-blue {
      background-color: #448dfe;
    }
  }
</style>
