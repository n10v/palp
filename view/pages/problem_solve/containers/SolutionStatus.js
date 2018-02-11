// @flow

import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import * as React from 'react';

import { SolutionStatus } from '../components';
import { getResults, getSubproblems } from '../selectors';
import type { SubproblemID } from '../../../types';
import type { Result, Subproblem } from '../types';

function resolveUnsolvedSubproblemPositions(results: { [SubproblemID]: Result }, subproblems: { [SubproblemID]: Subproblem }): number[] {
  var subproblemPositions = [];

  for (var subproblemID in results) {
    const result = results[subproblemID];
    if (result.status !== 'SUCCESS') {
      subproblemPositions.push(subproblems[subproblemID].position);
    }
  }

  return subproblemPositions.sort();
}

type Props = {|
  results: { [SubproblemID]: Result },
  subproblems: { [SubproblemID]: Subproblem },
|};

function SolutionStatusContainer(props: Props): React.Node {
  const subproblemPositionList = resolveUnsolvedSubproblemPositions(props.results, props.subproblems);
  return (<SolutionStatus subproblemPositionList={subproblemPositionList} />);
}

function mapStateToProps(state): Props {
  const s = state.problemSolvePage;
  return {
    results: getResults(s),
    subproblems: getSubproblems(s),
  };
}

const connector: Connector<{}, Props> = connect(mapStateToProps, null);
export default connector(SolutionStatusContainer);
