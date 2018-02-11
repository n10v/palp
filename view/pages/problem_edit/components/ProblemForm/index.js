// @flow

import * as React from 'react';

import { Button, Checkbox, Input, Label } from '../../../../components/';
import {
  ClassroomCheckboxListContainer,
  SubproblemFormListContainer,
} from '../../containers/';

type Props = {|
  makeOnChange: (string => (SyntheticEvent<HTMLInputElement> => void)),
  name: string,
  onRemove: (SyntheticEvent<HTMLElement> => void),
  onSubmit: (SyntheticEvent<HTMLElement> => void),
  visibleForClassrooms: boolean
|};

export default function ProblemForm(props: Props): React.Node {
  return (
    <form
      className="problem-form"
      encType="multipart/form-data"
    >
      <div>
        <Label>
          Name:
          <Input
            name="name"
            onChange={props.makeOnChange('name')}
            required
            type="text"
            value={props.name}
          />
        </Label>

        <Label className="problem-form__visible-for-classrooms-label">
          Visible for classrooms:
          <Checkbox
            checked={props.visibleForClassrooms}
            name="visibleForClassrooms"
            onChange={props.makeOnChange('visibleForClassrooms')}
            value="true"
          />
        </Label>

        <Label className="problem-form__classrooms-label">Classrooms:</Label>
        <ClassroomCheckboxListContainer />
      </div>

      <SubproblemFormListContainer />

      <div className="problem-form__control-buttons">
        <Button
          className="pt-intent-danger"
          onClick={props.onRemove}
          type="button"
        >
          Remove
        </Button>
        <Button onClick={props.onSubmit} type="button">Save</Button>
      </div>

    </form>
  );
}
