// @flow

import * as React from 'react';

import { Button, FileUploadInput } from '../../../../components';
import ResultCallout from '../ResultCallout';
import type { ButtonType, Result } from '../../types';

type SubproblemProps = {|
  buttonType?: ButtonType,
  file?: File,
  grade: number,
  handleCancelCheck: (() => void),
  handleFileInput: (SyntheticEvent<HTMLInputElement> => void),
  handleResendSolution: (() => void),
  language: string,
  optional: boolean,
  position: number,
  renderedDescription: string,
  result: Result,
|};

export default function Subproblem(props: SubproblemProps): React.Node {
  const { result } = props;
  return (
    <form className="pt-card pt-elevation-2 subproblem">
      <p><b>Subproblem #{props.position} {props.optional && '(Optional)'}</b></p>
      <p>{props.grade} points</p>

      <div
        className="subproblem__description"
        dangerouslySetInnerHTML={{__html: props.renderedDescription}}>
      </div>

      <p>Language: {props.language}</p>

      <FileUploadInput
        label={props.file && props.file.name}
        onChange={props.handleFileInput}
      />

      <br />

      <ControlButton
        buttonType={props.buttonType}
        handleCancelCheck={props.handleCancelCheck}
        handleResendSolution={props.handleResendSolution}
      />

      {result &&
        <ResultCallout message={result.message} status={result.status} /> }
    </form>
  );
}

type ControlButtonProps = {|
  buttonType?: ButtonType,
  handleCancelCheck: (() => void),
  handleResendSolution: (() => void),
|};

function ControlButton(props: ControlButtonProps): React.Node {
  if (props.buttonType === 'CANCEL') {
    return (
      <Button
        danger
        iconName="cross"
        onClick={props.handleCancelCheck}
        type="button"
      >
        Cancel
      </Button>
    );
  } else if (props.buttonType === 'RESEND') {
    return (
      <Button
        iconName="repeat"
        onClick={props.handleResendSolution}
        type="button"
      >
        Resend
      </Button>
    );
  }

  return null;
}
