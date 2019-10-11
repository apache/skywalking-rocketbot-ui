/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Commit, ActionTree, MutationTree, Dispatch} from 'vuex';
import axios, {AxiosPromise, AxiosResponse} from 'axios';
import {cancelToken} from '@/utils/cancelToken';
import {State} from './dashboard-data';
import fragmentAll from '@/store/modules/dashboard/fragments';
// getters
const getters = {
  Graphql(state: State): string {
    let fragmentsArr: any = [];
    let variablesArr: any = [];
    state.tree[state.group].children[state.current].children.forEach((i: any) => {
      const globalArr: any = fragmentAll;
      if (globalArr[i.d]) {
        fragmentsArr = [...fragmentsArr, globalArr[i.d].fragment];
      }
      if (globalArr[i.d]) {
        variablesArr = [...variablesArr, ...globalArr[i.d].variable];
      }
    });
    const fragments = Array.from(new Set(fragmentsArr)).join('');
    const variables = Array.from(new Set(variablesArr)).join(',');
    return `query queryData(${variables}) {${fragments}}`;
  },
};
const EndPointInfoGraphql = `
query getEndpointInfo($endpointId: ID!) {
        endpointInfo: getEndpointInfo(endpointId: $endpointId) {
            serviceName
            id
    }}
`;

// actions
const actions: ActionTree<State, any> = {
  GET_QUERY(context: { commit: Commit, dispatch: Dispatch, getters: any }, variablesData: any): AxiosPromise<void> {
    return axios.post('/graphql', {
      query: context.getters.Graphql,
      variables: variablesData,
    }, {cancelToken: cancelToken()}).then((res: AxiosResponse<any>) => {
      var resData = res.data;
      if (resData.data && resData.data.endpointTopology) {
        let endpointIds = resData.data.endpointTopology.nodes.map((n: any) => n.name).filter(function onlyUnique(value: any, index: Number, self: any) {
          return self.indexOf(value) === index;
        });
        Promise.all(
          endpointIds.map((id: any) => {
            return axios.post('/graphql', {
              query: EndPointInfoGraphql,
              variables: {"endpointId": `${id}`}
            }).then((res: AxiosResponse<any>) => {
              return res.data.data.endpointInfo;
            })
          })
        ).then(endpointInfos => {
          var endpointMap = new Map(endpointInfos.map((e: any) => [e.id, e.serviceName] as [string, string]));
          resData.data.endpointTopology.endpoints = endpointMap;
          context.dispatch('COOK_SOURCE', resData);
        });
      } else {
        context.dispatch('COOK_SOURCE', resData);
      }
      return res;
    });
  },
};

export default {
  getters,
  actions,
};
