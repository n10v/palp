// @flow

import type { Action } from '../actions';
import {
  SET_FILE,
  SET_RESULT,
  SET_STATE,
} from '../actions';
import fileReducer from './File';
import resultReducer from './Result';
import type { ReduxState } from '../types';
import { initialReduxState } from '../types';
import { assign } from '../../../utils';

export default function(state: ReduxState = initialReduxState, action: Action): ReduxState {
  switch (action.type) {
  case SET_FILE: return fileReducer(state, action);
  case SET_RESULT: return resultReducer(state, action);
  case SET_STATE: return assign(state, action.payload.state);
  default: return state;
  }
}
