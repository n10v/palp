// @flow

import * as React from 'react';

type Props = {|
  label?: string,
  onChange: (SyntheticEvent<HTMLInputElement> => void),
|};

export default function FileUpdloadInput(props: Props): React.Node {
  return (
    <label className="pt-file-upload file-upload-input">
      <input name="solution" onChange={props.onChange} type="file" />
      <span className="pt-file-upload-input">
        {props.label || 'Choose a file...'}
      </span>
    </label>
  );
}
