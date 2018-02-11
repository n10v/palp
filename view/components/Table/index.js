// @flow

import classnames from 'classnames';
import * as React from 'react';

type Props = {|
  children?: React.Node,
  className?: string,
|};

export default function Table(props: Props): React.Node {
  const className = classnames('pt-table pt-bordered pt-condensed table', props.className);
  return <table className={className}>{props.children}</table>;
}
