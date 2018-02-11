// @flow

import type { Action } from '../actions';
import { EDIT_PROBLEM } from '../actions';
import type { ReduxState } from '../types';
import { assign } from '../../../utils';

export default function problemReducer(state: ReduxState, action: Action): ReduxState {
  switch (action.type) {
  case EDIT_PROBLEM: {
    const { prop, value } = action.payload;
    const problem = assign(state.problem, { [prop]: value });
    return assign(state, { problem });
  }

  default:
    return state;
  }
}
