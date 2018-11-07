import axios, { AxiosPromise } from 'axios';
const tag = '/api';

interface Login{
  userName: String;
  password: String;
}

export const login = (params:Login): AxiosPromise<any> => {
  return axios.post(`${tag}/login/account`, params);
};
