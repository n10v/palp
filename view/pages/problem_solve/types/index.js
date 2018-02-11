// @flow

import type { CancelTokenSource } from 'axios';

import type { ProblemID, SubproblemID } from '../../../types';
import { nullProblemID } from '../../../types';

type ButtonType =
  | 'CANCEL'
  | 'RESEND';

type Problem = {|
  id: ProblemID,
  name: string,
  visibleForClassrooms: boolean,
  subproblemIDs: SubproblemID[],
|};

type Result = {|
  cancelTokenSource?: CancelTokenSource,
  lastCheckedTest?: number,
  message: string,
  status: ResultStatus,
|};

type ResultStatus =
  | 'CANCELED'
  | 'CHECK_IN_PROCESS'
  | 'FAIL'
  | 'NOT_SOLVED'
  | 'SUCCESS';

const blankProblem: Problem = {
  id: nullProblemID,
  name: '',
  visibleForClassrooms: false,
  subproblemIDs: [],
};

type Subproblem = {|
  id: SubproblemID,
  position: number,
  renderedDescription: string,
  language: string,
  optional: boolean,
  grade: number,
|};

type ReduxState = {|
  files: { [SubproblemID]: File },
  problem: Problem,
  results: { [SubproblemID]: Result },
  subproblems: { [SubproblemID]: Subproblem },
|};

const initialReduxState: ReduxState = {
  files: {},
  problem: blankProblem,
  results: {},
  subproblems: {},
};

type SolveResponseData = {|
  problem: Problem,
  results: { [SubproblemID]: Result },
  subproblems: { [SubproblemID]: Subproblem },
|};

export type {
  ButtonType,
  Problem,
  ReduxState,
  ResultStatus,
  Result,
  SolveResponseData,
  Subproblem,
};
export { initialReduxState };
