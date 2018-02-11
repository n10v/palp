// @flow

import type { AxiosPromise, CancelTokenSource, CancelToken } from 'axios';
import axios from 'axios';

// assign is Object.assign with type checking.
// See https://github.com/facebook/flow/issues/2405.
// Thanks @lloiser for solution.
function assign<T>(a: T, ...b: $Shape<T>[]): T {
  return Object.assign({}, a, ...b);
}

// UUID v4 Generation by @LeverOne.
// https://gist.github.com/LeverOne/1308368
//
// Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
// where each x is replaced with a random hexadecimal digit from 0 to f,
// and y is replaced with a random hexadecimal digit from 8 to b.
function generateID(): string {
  // $FlowFixMe
  return function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b;}();
}

function getJSON<T>(url: string): AxiosPromise<T> {
  return axios.get(url);
}

function sendPostRequest<T>(url: string, body: mixed, cancelToken?: CancelToken): AxiosPromise<T> {
  if (!cancelToken) {
    return axios.post(url, body);
  }
  return axios.post(url, body, { cancelToken });
}

function newCancelTokenSource(): CancelTokenSource {
  return axios.CancelToken.source();
}

export {
  assign,
  generateID,
  getJSON,
  sendPostRequest,
  newCancelTokenSource,
};
