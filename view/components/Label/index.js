// @flow

import * as React from 'react';

type Props = {|
  children: React.Node,
  className?: string,
|};

export default function Label(props: Props): React.Node {
  return <label className={props.className}>{props.children}</label>;
}
