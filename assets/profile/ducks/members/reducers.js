import { combineReducers } from 'redux';
import types from './types';
import { createReducer } from '../utils';

const selfReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_SELF_COMPLETED:
      return Object.assign({}, state, action.payload);
    default:
      return state
  }
}
//const selfReducer = createReducer({}, () => ({
//  [types.FETCH_SELF_COMPLETED]: (state, action) => {
//    return action.payload;
//  },
//}));


const membersReducer = (state = {}, action) => {
  switch (action.type) {
    case 'members/FETCH_LIST_COMPLETED':
      return Object.assign({}, state, action.payload);
    case 'members/FETCH_DETAIL_COMPLETED':
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    default:
      return state
  }
}

//const membersReducer = createReducer({}, () => ({
//  [types.FETCH_LIST_COMPLETED]: (state, action) => {
//  },
//  [types.FETCH_DETAIL_COMPLETED]: (state, action) => {
//   return action.payload;
//  },
//}));

export default combineReducers({
  self: selfReducer,
  members: membersReducer,
});
