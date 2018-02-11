// @flow

import classnames from 'classnames';
import * as React from 'react';

type Props = {|
  className?: string,
  checked?: boolean,
  name: string,
  onChange: (SyntheticEvent<HTMLInputElement> => void),
  value: boolean | number | string,
|};

export default function Checkbox(props: Props): React.Node {
  return (
    <input
      checked={props.checked}
      className={classnames('checkbox', props.className)}
      name={props.name}
      onChange={props.onChange}
      type='checkbox'
      value={props.value}
    />
  );
}

Checkbox.defaultProps = {
  checked: false,
};
