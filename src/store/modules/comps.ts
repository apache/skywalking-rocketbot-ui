import { Commit, ActionTree, MutationTree } from 'vuex';
import { CompsItem, CompsTree } from '../interfaces';
import * as types from '../mutation-types';

export interface State {
  data: CompsItem[];
  current: number;
  tree: CompsTree[];
}

const initState: State = {
  data: [
    { o: 'Service', name: 'Avg Response',
    comp: 'ChartAvgResponse', title: 'ChartAvgSLA', type: 'serviceInfo', width: 4 },
    { o: 'Service', name: 'Avg Throughput',
    comp: 'ChartAvgThroughput', title: 'ChartAvgSLA', type: 'serviceInfo', width: 4 },
    { o: 'Service', name: 'Avg SLA', comp: 'ChartAvgSLA', title: 'ChartAvgSLA', type: 'serviceInfo', width: 4 },
    { o: 'Global', name: 'Critical Response', comp: 'ChartResponse', title: 'ChartResponse', type: 'global', width: 4 },
    { o: 'Service', name: 'Critical Response',
    comp: 'ChartResponse', title: 'serviceInfo', type: 'serviceInfo', width: 4 },
    { o: 'Instance', name: 'CPU', comp: 'ChartCpu', title: 'CPU %' , width: 4 },
    { o: 'Instance', name: 'GC', comp: 'ChartGC', title: 'GC ms' , width: 4 },
    { o: 'Instance', name: 'Heap', comp: 'ChartHeap', title: 'Heap MB' , width: 4 },
    { o: 'Instance', name: 'NonHeap', comp: 'ChartNonHeap', title: 'Non-Heap MB' , width: 4 },
    { o: 'Service', name: 'Slow Endpoints',
    comp: 'ChartTrace', title: 'serviceInfo', type: 'serviceInfo.getSlowEndpoint', width: 4 },
    { o: 'Service', name: 'Slow Instance Throughput',
    comp: 'ChartSlow', title: 'serviceInfo', type: 'serviceInfo.getInstanceThroughput', width: 4 },
  ],
  current: 0,
  tree: [{
    name: 'Dashboard',
    children: [],
    }],
};

// mutations
const mutations: MutationTree<State> = {
  [types.SET_COMPTREE](state: State, data: CompsTree[]) {
    state.tree = data;
  },
  [types.ADD_COMPTREE](state: State, name: string) {
    if (!name) {return; }
    state.tree.push({name, children: []});
  },
  [types.DELETE_COMPTREE](state: State, index: number) {
    state.tree.splice(index, 1);
  },
  [types.ADD_COMP](state: State, comp: CompsItem) {
    state.tree[state.current].children.push(comp);
  },
  [types.DELETE_COMP](state: State, index: number) {
    state.tree[state.current].children.splice(index, 1);
  },
  [types.EDIT_COMP](state: State, params: any) {
    const temp: any = state.tree[state.current].children[params.index];
    temp[params.type] = params.value;
  },
  [types.SET_CURRENTCOMP](state: State, current: number) {
    state.current = current;
  },
  [types.SWICH_COMP](state: State, params: any) {
    const tempStart: any = state.tree[state.current].children[params.start];
    state.tree[state.current].children[params.start] = state.tree[state.current].children[params.end];
    state.tree[state.current].children[params.end] = tempStart;
    state.tree = {...state.tree};
  },
};

// actions
const actions: ActionTree<State, any> = {} ;

// getters
const getters = {
};

export default {
  state: initState,
  getters,
  actions,
  mutations,
};
