import axios from 'axios';
/* eslint-disable */
const CancelToken = axios.CancelToken;

export const cancelToken = () => ( new CancelToken(function executor(c) {
    window.axiosCancel.push(c);
  })
)
