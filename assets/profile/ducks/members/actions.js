import types from './types';
import Cookies from 'universal-cookie';
import { CALL_API } from 'redux-api-middleware';
import { API } from '../utils/constants';

const cookies = new Cookies();

const API_ENDPOINT = '/users/';

export const fetchSelf = () => ({
  [CALL_API]: {
    endpoint: `${API}/me`,
    method: 'GET',
    headers: {
      'X-CSRFToken': cookies.get('csrftoken'),
    },
    credentials: 'same-origin',
    types: [
      types.FETCH_SELF_REQUEST,
      types.FETCH_SELF_COMPLETED,
      types.FETCH_SELF_FAILED,
    ],
  },
});

export const fetchList = () => ({
  [CALL_API]: {
    endpoint: `${API + API_ENDPOINT}`,
    method: 'GET',
    headers: {
      'X-CSRFToken': cookie.load('csrftoken'),
    },
    credentials: 'same-origin',
    types: [
      types.FETCH_LIST_REQUEST,
      types.FETCH_LIST_COMPLETED,
      types.FETCH_LIST_FAILED,
    ],
  },
});

export const fetchDetail = id => ({
  [CALL_API]: {
    endpoint: `${API + API_ENDPOINT + String(id)}.json`,
    method: 'GET',
    headers: {
      'X-CSRFToken': cookie.load('csrftoken'),
    },
    credentials: 'same-origin',
    types: [
      types.FETCH_DETAIL_REQUEST,
      types.FETCH_DETAIL_COMPLETED,
      types.FETCH_DETAIL_FAILED,
    ],
  },
});

export default {
  fetchSelf,
  fetchList,
  fetchDetail,
};
