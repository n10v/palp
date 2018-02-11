// @flow

import type { SubproblemID } from '../../../types';
import type { SubproblemPropTypes } from '../types';

const ADD_SUBPROBLEM = 'PROBLEM_EDIT/ADD_SUBPROBLEM';

type AddSubproblemAction = {
  type: 'PROBLEM_EDIT/ADD_SUBPROBLEM',
};

function addSubproblem(): AddSubproblemAction {
  return { type: ADD_SUBPROBLEM };
}

const EDIT_SUBPROBLEM = 'PROBLEM_EDIT/EDIT_SUBPROBLEM';

type EditSubproblemAction = {
  type: 'PROBLEM_EDIT/EDIT_SUBPROBLEM',
  payload: {
    id: SubproblemID,
    prop: string,
    value: SubproblemPropTypes,
  },
};

function editSubproblem(
  id: SubproblemID,
  prop: string,
  value: SubproblemPropTypes
): EditSubproblemAction {
  return { type: EDIT_SUBPROBLEM, payload: { id, prop, value } };
}

const REMOVE_SUBPROBLEM = 'PROBLEM_EDIT/REMOVE_SUBPROBLEM';

type RemoveSubproblemAction = {
  type: 'PROBLEM_EDIT/REMOVE_SUBPROBLEM';
  payload: {
    id: SubproblemID
  },
};

function removeSubproblem(id: SubproblemID): RemoveSubproblemAction {
  return { type: REMOVE_SUBPROBLEM, payload: { id } };
}

export type {
  AddSubproblemAction,
  EditSubproblemAction,
  RemoveSubproblemAction,
};
export {
  ADD_SUBPROBLEM,
  EDIT_SUBPROBLEM,
  REMOVE_SUBPROBLEM,
  addSubproblem,
  editSubproblem,
  removeSubproblem,
};
