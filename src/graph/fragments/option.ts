export const Services = {
  variable: '$duration: Duration!',
  query: `
    services: getAllServices(duration: $duration) {
      key: id
      label: name
    }
  `};

export const Database = {
  variable: '$duration: Duration!',
  query: `
    services: getAllDatabases(duration: $duration) {
      key: id
      label: name
    }
  `};

export const Endpoints = {
  variable: '$serviceId: ID!, $keyword: String!',
  query: `
    endpoints: searchEndpoint(serviceId: $serviceId, keyword: $keyword, limit: 10) {
      key: id
      label: name
    }
`};

export const Instances = {
  variable: '$serviceId: ID!, $keyword: String!',
  query: `
    instances: getServiceInstances(duration: $duration, serviceId: $serviceId) {
      key: id
      label: name
      attributes {
        name
        value
      }
    }
  `};
