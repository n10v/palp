// @flow

import * as React from 'react';

import { Input } from '../../../../components';

type Props = {|
  name: string,
  placeholder?: string,
  type: string,
|};

export default function LoginInput(props: Props): React.Node {
  return (
    <Input
      className="pt-large login-form__input"
      name={props.name}
      placeholder={props.placeholder}
      type={props.type}
    />
  );
}
