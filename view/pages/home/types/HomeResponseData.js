// @flow

import type { Problem } from './Problem';
import type { User } from './User';
import type { ProblemID } from '../../../types';

type HomeResponseData = {|
  problems: { [ProblemID]: Problem },
  user: User,
|};

export type { HomeResponseData };
