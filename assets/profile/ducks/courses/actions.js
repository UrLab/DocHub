import types from './types';
import Cookies from 'universal-cookie';
import { CALL_API } from 'redux-api-middleware';
import { API } from '../utils/constants';

const cookies = new Cookies();

const API_ENDPOINT = '/tree/';

export const fetchTree = () => ({
  [CALL_API]: {
    endpoint: `${API + API_ENDPOINT}`,
    method: 'GET',
    headers: {
      'X-CSRFToken': cookies.get('csrftoken'),
    },
    credentials: 'same-origin',
    types: [
      types.FETCH_TREE_REQUEST,
      types.FETCH_TREE_COMPLETED,
      types.FETCH_TREE_FAILED,
    ],
  },
});

export default {
  fetchTree,
};
