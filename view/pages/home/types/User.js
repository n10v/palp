// @flow

import type { ProblemID } from '../../../types';

type User = {|
  username: string,
  canCreateProblems: boolean,
  problemIDs: ProblemID[],
  hasProblemsAsEditor: boolean,
|};

const blankUser: User = {
  username: '',
  canCreateProblems: false,
  problemIDs: [],
  hasProblemsAsEditor: false,
};

export type { User };
export { blankUser };
