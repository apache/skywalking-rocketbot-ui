import { Topo, TopoMetric,
  TopoServiceMetric, TopoClientMetric, TopoServiceInfo, TopoClientInfo } from '../fragments/topology';

export const queryTopo =
  `query queryTraces(${Topo.variable}) {${Topo.query}}`;

export const queryTopoInfo =
  `query queryTrace(
    ${Topo.variable},
    ${TopoMetric.variable},
    ${TopoServiceMetric.variable},
    ${TopoClientMetric.variable})
      {
        ${TopoMetric.query},
        ${TopoServiceMetric.query},
        ${TopoClientMetric.query}
      }`;

export const queryTopoServiceInfo =
  `query queryTopoServiceInfo(${TopoServiceInfo.variable}) {${TopoServiceInfo.query}}`;

export const queryTopoClientInfo =
  `query queryTopoClientInfo(${TopoClientInfo.variable}) {${TopoClientInfo.query}}`;
