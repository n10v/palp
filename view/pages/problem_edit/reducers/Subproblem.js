// @flow

import type { Action } from '../actions';
import {
  ADD_SUBPROBLEM,
  EDIT_SUBPROBLEM,
  REMOVE_SUBPROBLEM
} from '../actions';
import type { ReduxState, Subproblem } from '../types';
import { assign, generateID } from '../../../utils';
import { resolveSortedSubproblemList } from '../utils';

export default function subproblemReducer(state: ReduxState, action: Action): ReduxState {
  switch (action.type) {
  case ADD_SUBPROBLEM: {
    const position = Object.getOwnPropertyNames(state.subproblems).length+1;
    const subproblem = newSubproblem(position);
    const subproblems = assign(state.subproblems, { [subproblem.id]: subproblem });
    return assign(state, { subproblems });
  }

  case EDIT_SUBPROBLEM: {
    const { id, prop, value } = action.payload;
    const prevSubproblem = state.subproblems[id];
    if (prevSubproblem == null) {
      return state;
    }

    const subproblem = assign(prevSubproblem, { [prop]: value });
    const subproblems = assign(state.subproblems, { [id]: subproblem });
    return assign(state, { subproblems });
  }

  case REMOVE_SUBPROBLEM: {
    const { id } = action.payload;

    var subproblems = assign(state.subproblems, {});
    delete subproblems[id];

    // Refresh positions.
    const sortedSubproblems = resolveSortedSubproblemList(subproblems);
    var position = 1;
    for (var subproblem of sortedSubproblems) {
      subproblems[subproblem.id].position = position;
      position++;
    }

    return assign(state, { subproblems });
  }

  default:
    return state;
  }
}

function newSubproblem(position: number): Subproblem {
  return {
    id: generateID(),
    position,
    description: '',
    language: 'java',
    grade: 0,
    optional: false,
    testIDs: [],
  };
}

