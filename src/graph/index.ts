import axios, { AxiosPromise } from 'axios';
import query from './query';

const queryArr: any = query;

class Graph {
  private queryData: string = '';
  public query(queryData: string) {
    this.queryData = queryData;
    return this;
  }
  public params(variablesData: any): AxiosPromise<any> {
    return axios.post('/graphql', {
      query: queryArr[this.queryData],
      variables: variablesData,
    });
  }
}

export default new Graph();
