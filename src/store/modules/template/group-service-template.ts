import globalTemp from './global-template';
import serviceTemp from './service-template';
import endpointTemp from './endpoint-template';
import instanceTemp from './instance-template';
export default [
  {
    name: 'Global',
    children: globalTemp,
  },
  {
    name: 'Service',
    children: serviceTemp,
  },
  {
    name: 'Endpoint',
    children: endpointTemp,
  },
  {
    name: 'Instance',
    children: instanceTemp,
  },
];
