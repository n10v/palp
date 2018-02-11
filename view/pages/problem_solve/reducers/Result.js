// @flow

import type { Action } from '../actions';
import { SET_RESULT } from '../actions';
import type { ReduxState } from '../types';
import { assign } from '../../../utils';

export default function resultReducer(state: ReduxState, action: Action): ReduxState {
  switch (action.type) {
  case SET_RESULT: {
    const { subproblemID, result } = action.payload;
    const results = assign(state.results, { [subproblemID]: result });
    return assign(state, { results });
  }

  default:
    return state;
  }
}
