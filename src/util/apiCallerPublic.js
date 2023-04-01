import axios from 'axios';
import { BASE_URL_API } from 'src/constants/Config';

export default function apiCallerPublic(type, endpoint, method = 'GET', body) {
  let url = BASE_URL_API;
  if(type) {
    url = `${BASE_URL_API}/${type}/${endpoint}`
  } else {
    url = `${BASE_URL_API}/${endpoint}`
  }
  let dataBody = body;
  return axios({
    method: method,
    url: url,
    data: dataBody,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }).catch(err => err.response);
};
