// @flow

import type { ProblemPropTypes } from '../types';

const EDIT_PROBLEM = 'PROBLEM_EDIT/EDIT_PROBLEM';

type EditProblemAction = {
  type: 'PROBLEM_EDIT/EDIT_PROBLEM',
  payload: {
    prop: string,
    value: ProblemPropTypes,
  },
};

function editProblem(prop: string, value: ProblemPropTypes): EditProblemAction {
  return { type: EDIT_PROBLEM, payload: { prop, value } };
}

export type { EditProblemAction };
export {
  EDIT_PROBLEM,
  editProblem,
};
