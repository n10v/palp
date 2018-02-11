// @flow

import classnames from 'classnames';
import * as React from 'react';

import type { ResultStatus } from '../../types';

type Props = {|
  message: string,
  status: ResultStatus,
|};

export default function ResultCallout(props: Props): React.Node {
  const { status } = props;
  const className = classnames({
    'pt-callout': true,
    'pt-intent-danger': status === 'FAIL' || status === 'CANCELED',
    'pt-intent-primary': status === 'CHECK_IN_PROCESS',
    'pt-intent-success': status === 'SUCCESS',
    'pt-intent-warning': status === 'NOT_SOLVED',
    'result-callout': true,
  });

  return <div className={className}>{props.message}</div>;
}
