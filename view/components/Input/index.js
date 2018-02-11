// @flow

import classnames from 'classnames';
import * as React from 'react';

type Props = {|
  className?: string,
  name: string,
  onChange?: (SyntheticKeyboardEvent<HTMLInputElement> => void),
  placeholder?: string,
  required?: boolean,
  type: string,
  value?: boolean | number | string,
|};

export default function Input(props: Props): React.Node {
  return (
    <input
      className={classnames('pt-input', 'input', props.className)}
      name={props.name}
      onChange={props.onChange}
      placeholder={props.placeholder}
      required={props.required}
      type={props.type}
      value={props.value}
    />
  );
}
