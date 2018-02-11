// @flow

import * as React from 'react';

import { Button } from '../../../../components';

type Props = {|
  children: React.Node,
|};

export default function LoginButton(props: Props): React.Node {
  return (
    <Button className="login-form__button" large primary type="submit">
      {props.children}
    </Button>
  );
}
