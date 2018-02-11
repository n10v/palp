// @flow

import type { SubproblemID } from '../../../types';

const SET_FILE = 'PROBLEM_SOLVE/SET_FILE';

type SetFileAction = {
  type: 'PROBLEM_SOLVE/SET_FILE',
  payload: {
    subproblemID: SubproblemID,
    file: File,
  },
};

function setFile(subproblemID: SubproblemID, file: File): SetFileAction {
  return { type: SET_FILE, payload: { subproblemID, file } };
}

export type { SetFileAction };
export {
  SET_FILE,
  setFile,
};
