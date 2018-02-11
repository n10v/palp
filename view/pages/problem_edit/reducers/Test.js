// @flow

import type { Action } from '../actions';
import {
  ADD_TEST,
  EDIT_TEST,
  REMOVE_TEST
} from '../actions';
import type { ReduxState } from '../types';
import type { SubproblemID, TestID, Test } from '../../../types';
import { assign, generateID } from '../../../utils';

export default function testReducer(state: ReduxState, action: Action): ReduxState {
  switch (action.type) {
  case ADD_TEST: {
    const { subproblemID } = action.payload;
    const prevSubproblem = state.subproblems[subproblemID];
    if (prevSubproblem == null) {
      return state;
    }
    var subproblem = assign(prevSubproblem, {});

    const position = subproblem.testIDs.length+1;
    const test = newTest(position, subproblemID);

    subproblem.testIDs.push(test.id);

    const subproblems = assign(state.subproblems, { [test.subproblemID]: subproblem });
    const tests = assign(state.tests, { [test.id]: test });
    return assign(state, { subproblems, tests });
  }

  case EDIT_TEST: {
    const { id, prop, value } = action.payload;
    const prevTest = state.tests[id];
    if (prevTest == null) {
      return state;
    }

    const test = assign(prevTest, { [prop]: value });
    const tests = assign(state.tests, { [id]: test });
    return assign(state, { tests });
  }

  case REMOVE_TEST: {
    const { id } = action.payload;
    const { subproblemID } = state.tests[id];
    const prevSubproblem = state.subproblems[subproblemID];
    if (prevSubproblem == null) {
      return state;
    }

    var subproblem = assign(prevSubproblem, {});
    var testIDs = subproblem.testIDs.slice();

    const testIndex = testIDs.findIndex((testID: TestID): boolean => (testID === id));
    if (testIndex < 0) {
      return state;
    }
    testIDs.splice(testIndex, 1);
    subproblem.testIDs = testIDs;

    var tests = assign(state.tests, {});
    delete tests[id];

    // Refresh positions.
    var position = 1;
    for (var testID of testIDs) {
      tests[testID].position = position;
      position++;
    }

    const subproblems = assign(state.subproblems, { [subproblemID]: subproblem });
    return assign(state, { subproblems, tests });
  }

  default:
    return state;
  }
}

function newTest(position: number, subproblemID: SubproblemID): Test {
  return {
    id: generateID(),
    input: '',
    position,
    rightAnswer: '',
    subproblemID,
  };
}

