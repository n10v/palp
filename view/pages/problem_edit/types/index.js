// @flow

import type {
  ClassroomID,
  Classroom,
  ProblemID,
  SubproblemID,
  TestID,
  Test,
} from '../../../types';
import { nullProblemID } from '../../../types';

type Problem = {|
  id: ProblemID,
  name: string,
  visibleForClassrooms: boolean,
  classroomIDs: ClassroomID[],
|};

type ProblemPropTypes = $Values<Problem>;

const blankProblem: Problem = {
  id: nullProblemID,
  name: '',
  visibleForClassrooms: false,
  classroomIDs: [],
};

type Subproblem = {|
  id: SubproblemID,
  position: number,
  description: string,
  language: string,
  optional: boolean,
  grade: number,
  testIDs: TestID[],
|};

type SubproblemPropTypes = $Values<Subproblem>;

type ReduxState = {|
  classroomIDs: ClassroomID[],
  classrooms: { [ClassroomID]: Classroom },
  problem: Problem,
  subproblems: { [SubproblemID]: Subproblem },
  tests: { [TestID]: Test },
|};

const initialReduxState: ReduxState = {
  classroomIDs: [],
  classrooms: {},
  problem: blankProblem,
  subproblems: {},
  tests: {},
};

export type {
  Problem,
  ProblemPropTypes,
  ReduxState,
  Subproblem,
  SubproblemPropTypes,
};
export {
  initialReduxState,
};
