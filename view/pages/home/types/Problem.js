// @flow

import type { ProblemID } from '../../../types';

type Problem = {|
  id: ProblemID,
  name: string,
  visibleForClassrooms: boolean,
  canBeEdited: boolean,
|};

export type { Problem };
