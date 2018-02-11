// @flow

import classnames from 'classnames';
import * as React from 'react';

type Props = {|
  className?: string,
  name: string,
  onChange: (SyntheticEvent<HTMLTextAreaElement> => void),
  required?: boolean,
  rows?: number,
  value: boolean | number | string,
|};

export default function Textarea(props: Props): React.Node {
  return (
    <textarea
      className={classnames('textarea', props.className)}
      name={props.name}
      onChange={props.onChange}
      required={props.required}
      rows={props.rows}
      value={props.value}
    />
  );
}
