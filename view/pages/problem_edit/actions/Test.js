// @flow

import type { SubproblemID, TestID, TestPropTypes } from '../../../types';

const ADD_TEST = 'PROBLEM_EDIT/ADD_TEST';

type AddTestAction = {
  type: 'PROBLEM_EDIT/ADD_TEST',
  payload: {
    subproblemID: SubproblemID
  },
};

function addTest(subproblemID: SubproblemID): AddTestAction {
  return { type: ADD_TEST, payload: { subproblemID } };
}

const EDIT_TEST = 'PROBLEM_EDIT/EDIT_TEST';

type EditTestAction = {
  type: 'PROBLEM_EDIT/EDIT_TEST',
  payload: {
    id: TestID,
    prop: string,
    value: TestPropTypes,
  },
};

function editTest(id: TestID, prop: string, value: TestPropTypes): EditTestAction {
  return { type: EDIT_TEST, payload: { id, prop, value } };
}

const REMOVE_TEST = 'PROBLEM_EDIT/REMOVE_TEST';

type RemoveTestAction = {
  type: 'PROBLEM_EDIT/REMOVE_TEST',
  payload: {
    id: TestID
  },
};

function removeTest(id: TestID): RemoveTestAction {
  return { type: REMOVE_TEST, payload: { id } };
}

export type {
  AddTestAction,
  EditTestAction,
  RemoveTestAction,
};
export {
  ADD_TEST,
  EDIT_TEST,
  REMOVE_TEST,
  addTest,
  editTest,
  removeTest,
};
