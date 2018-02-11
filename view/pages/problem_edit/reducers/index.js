// @flow

import type { Action } from '../actions';
import {
  ADD_SUBPROBLEM,
  ADD_TEST,
  EDIT_PROBLEM,
  EDIT_SUBPROBLEM,
  EDIT_TEST,
  REMOVE_SUBPROBLEM,
  REMOVE_TEST,
  SET_STATE,
  TOGGLE_CLASSROOM,
} from '../actions';
import classroomReducer from './Classroom';
import problemReducer from './Problem';
import subproblemReducer from './Subproblem';
import testReducer from './Test';
import type { ReduxState } from '../types';
import { initialReduxState } from '../types';
import { assign } from '../../../utils';

export default (state: ReduxState = initialReduxState, action: Action): ReduxState => {
  switch (action.type) {
  case ADD_SUBPROBLEM:
  case EDIT_SUBPROBLEM:
  case REMOVE_SUBPROBLEM:
    return subproblemReducer(state, action);
  case ADD_TEST:
  case EDIT_TEST:
  case REMOVE_TEST:
    return testReducer(state, action);
  case EDIT_PROBLEM:
    return problemReducer(state, action);
  case SET_STATE:
    return assign(state, action.payload.state);
  case TOGGLE_CLASSROOM:
    return classroomReducer(state, action);
  default:
    return state;
  }
};
