// @flow

import * as React from 'react';

type Props = {|
  name: string,
  value?: boolean | number | string,
|};

export default function HiddenInput(props: Props): React.Node {
  return <input name={props.name} type="hidden" value={props.value} />;
}
