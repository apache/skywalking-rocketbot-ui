import { Topo, TopoMetric, TopoServiceMetric, TopoClientMetric } from '../fragments/topology';

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
