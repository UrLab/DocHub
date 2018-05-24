import { combineReducers } from 'redux';
import types from './types';
import { createReducer } from '../utils';

const treeReducer = (state = {}, action) => {
  switch (action.type) {
    case types.FETCH_TREE_COMPLETED:
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


export default combineReducers({
  tree: treeReducer,
});
