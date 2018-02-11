// @flow

import * as React from 'react';

type Props = {|
  children: React.Node,
|};

export default function LoginCallout(props: Props): React.Node {
  return (
    <div className="pt-callout pt-intent-danger login-form__callout">
      {props.children}
    </div>
  );
}

