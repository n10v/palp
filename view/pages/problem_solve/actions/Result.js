// @flow

import type { SubproblemID } from '../../../types';
import type { Result } from '../types';

const SET_RESULT = 'PROBLEM_SOLVE/SET_RESULT';

type SetResultAction = {
  type: 'PROBLEM_SOLVE/SET_RESULT',
  payload: {
    subproblemID: SubproblemID,
    result: Result,
  },
};

function setResult(subproblemID: SubproblemID, result: Result): SetResultAction {
  return { type: SET_RESULT, payload: { subproblemID, result } };
}

export type { SetResultAction };
export {
  SET_RESULT,
  setResult,
};
