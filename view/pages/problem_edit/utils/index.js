// @flow

import type { SubproblemID } from '../../../types';
import type { Subproblem } from '../types';

function compareSubproblems(a: Subproblem, b: Subproblem): number {
  if (a.position < b.position) {
    return -1;
  } else if (a.position > b.position) {
    return 1;
  } else {
    return 0;
  }
}

function resolveSortedSubproblemList(subproblems: { [SubproblemID]: Subproblem }): Subproblem[] {
  if (Object.getOwnPropertyNames(subproblems).length === 0) {
    return [];
  }

  var subproblemList = [];
  for (var subproblemID in subproblems) {
    subproblemList.push(subproblems[subproblemID]);
  }

  return subproblemList.sort(compareSubproblems);
}

export {
  resolveSortedSubproblemList,
};
