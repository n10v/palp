// @flow

import type { Action } from '../actions';
import { SET_FILE } from '../actions';
import type { ReduxState } from '../types';
import { assign } from '../../../utils';

export default function fileReducer(state: ReduxState, action: Action): ReduxState {
  switch (action.type) {
  case SET_FILE: {
    const { subproblemID, file } = action.payload;
    const files = assign(state.files, { [subproblemID] : file });
    return assign(state, { files });
  }

  default:
    return state;
  }
}
