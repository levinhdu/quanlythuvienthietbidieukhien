import axios from 'axios';
import { isEmpty } from 'lodash';

import { BASE_URL_API, BASE_URL_APP } from 'src/constants/Config';
import {getTokenInfo} from "src/util/Common";

export default function apiCaller(endpoint, method = 'GET', body, path = '') {
  const tokenInfo = getTokenInfo();
  const accessToken = tokenInfo ? tokenInfo.token : '';
  if (!isEmpty(accessToken)) {
    const newPath = path === 'refresh' ? '' : '/api';
    return axios({
      method: method,
      url: `${BASE_URL_API}${newPath}/${endpoint}`,
      data: body,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': 'Bearer '.concat(accessToken)
      }
    }).catch((err) => {
      return err.response;
    });
  } else {
    window.location = `${BASE_URL_APP}/signin`;
  }
}
