// @flow

import type { SubproblemID } from '../../../types';
import type { Problem, ReduxState, Result, Subproblem } from '../types';

function getFile(state: ReduxState, subproblemID: SubproblemID): File {
  return state.files[subproblemID];
}

function getProblem(state: ReduxState): Problem {
  return state.problem;
}

function getResults(state: ReduxState): { [SubproblemID]: Result } {
  return state.results;
}

function getSubproblems(state: ReduxState): { [SubproblemID]: Subproblem } {
  return state.subproblems;
}

export {
  getFile,
  getProblem,
  getResults,
  getSubproblems,
};
