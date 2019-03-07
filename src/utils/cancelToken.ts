import axios from 'axios';
/* eslint-disable */
const CancelToken = axios.CancelToken;

export const cancelToken = () => ( new CancelToken(function executor(c) {
    const w = window as any;
    w.axiosCancel.push(c);
  })
);
