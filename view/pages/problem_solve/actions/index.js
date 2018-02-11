// @flow

import type { SetFileAction } from './File';
import { SET_FILE, setFile } from './File';
import type { SetResultAction } from './Result';
import { SET_RESULT, setResult } from './Result';
import type { ReduxState } from '../types';

const SET_STATE = 'PROBLEM_SOLVE/SET_STATE';

type SetStateAction = {
  type: 'PROBLEM_SOLVE/SET_STATE',
  payload: {
    state: $Shape<ReduxState>,
  },
};

function setState(state: $Shape<ReduxState>): SetStateAction {
  return { type: SET_STATE, payload: { state } };
}

type Action =
  | SetFileAction
  | SetResultAction
  | SetStateAction;

export type { Action };
export {
  SET_FILE,
  SET_RESULT,
  SET_STATE,
  setFile,
  setResult,
  setState,
};
