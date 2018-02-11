// @flow

import type { ToggleClassroomAction } from './Classroom';
import { TOGGLE_CLASSROOM, toggleClassroom } from './Classroom';
import type { EditProblemAction } from './Problem';
import { EDIT_PROBLEM, editProblem } from './Problem';
import type {
  AddSubproblemAction,
  EditSubproblemAction,
  RemoveSubproblemAction,
} from './Subproblem';
import {
  ADD_SUBPROBLEM,
  EDIT_SUBPROBLEM,
  REMOVE_SUBPROBLEM,
  addSubproblem,
  editSubproblem,
  removeSubproblem
} from './Subproblem';
import type {
  AddTestAction,
  EditTestAction,
  RemoveTestAction,
} from './Test';
import {
  ADD_TEST,
  EDIT_TEST,
  REMOVE_TEST,
  addTest,
  editTest,
  removeTest
} from './Test';
import type { ReduxState } from '../types';

const SET_STATE = 'PROBLEM_EDIT/SET_STATE';

type SetStateAction = {
  type: 'PROBLEM_EDIT/SET_STATE',
  payload: {
    state: $Shape<ReduxState>,
  },
};

function setState(state: $Shape<ReduxState>): SetStateAction {
  return { type: SET_STATE, payload: { state } };
}

type Action =
  | AddSubproblemAction
  | AddTestAction
  | EditProblemAction
  | EditSubproblemAction
  | EditTestAction
  | RemoveSubproblemAction
  | RemoveTestAction
  | SetStateAction
  | ToggleClassroomAction;

export type { Action };
export {
  ADD_SUBPROBLEM,
  ADD_TEST,
  EDIT_PROBLEM,
  EDIT_SUBPROBLEM,
  EDIT_TEST,
  REMOVE_SUBPROBLEM,
  REMOVE_TEST,
  SET_STATE,
  TOGGLE_CLASSROOM,
  addSubproblem,
  addTest,
  editProblem,
  editSubproblem,
  editTest,
  removeSubproblem,
  removeTest,
  setState,
  toggleClassroom,
};
