// @flow

import * as React from 'react';

type Props = {|
  subproblemPositionList: number[],
|};

export default function SolutionStatus(props: Props): React.Node {
  const { subproblemPositionList } = props;
  var className = 'pt-callout ';
  var message;

  if (subproblemPositionList.length === 0) {
    className += 'pt-intent-success';
    message = 'You solved all subproblems. Well done!';
  } else {
    className += 'pt-intent-warning';

    const unsolvedCount = subproblemPositionList.length;
    message = `You have ${unsolvedCount} unsolved subproblems: `;

    for (var i = 0; i < subproblemPositionList.length; i++)  {
      message += '#'+subproblemPositionList[i];
      if (i !== subproblemPositionList.length-1) {
        message += ', ';
      }
    }
  }

  className += ' solution-status';

  return (<div className={className} style={{width: '650px'}}>{message}</div>);
}
