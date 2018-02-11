// @flow

import * as React from 'react';

import {
  Button,
  Checkbox,
  HiddenInput,
  Input,
  Label,
  MDE,
} from '../../../../components';
import { TestFormTableContainer } from '../../containers';
import type { SubproblemID } from '../../../../types';
import type { Subproblem } from '../../types';

type SubproblemFormProps = {|
  id: SubproblemID,
  description: string,
  grade: number,
  makeOnDescriptionChange: (SubproblemID => (string => void)),
  makeOnInputChange: ((SubproblemID, string) => (SyntheticEvent<HTMLInputElement> => void)),
  makeOnRemove: (SubproblemID => (() => void)),
  optional: boolean,
  position: number,
|};

function SubproblemForm(props: SubproblemFormProps): React.Node {
  const prefix = `subproblem[${props.id}]`;

  return (
    <div className="pt-card pt-elevation-2 subproblem">
      <h2 className="subproblem__position">{`Subproblem #${props.position}`}</h2>
      <HiddenInput name="subproblemID" value={props.id} />
      <HiddenInput name={`${prefix}[position]`} value={props.position} />

      <MDE
        name={`${prefix}[description]`}
        required
        value={props.description}
      />

      <TestFormTableContainer subproblemID={props.id} />

      <Label className="subproblem__grade__label">
        Grade:
        <Input
          name={`${prefix}[grade]`}
          onChange={props.makeOnInputChange(props.id, 'grade')}
          required
          type="number"
          value={props.grade}
        />
      </Label>

      <Label className="subproblem__optional__label">
        Optional:
        <Checkbox
          checked={props.optional}
          name={`${prefix}[optional]`}
          onChange={props.makeOnInputChange(props.id, 'optional')}
          value="true"
        />
      </Label>

      <Label className="subproblem__language_label">
        Language: java
        <HiddenInput name={`${prefix}[language]`} value="java" />
      </Label>

      <Button
        className="subproblem__remove-button"
        onClick={props.makeOnRemove(props.id)}
        type="button"
      >
        Remove subproblem
      </Button>
    </div>
  );
}

type SubproblemFormListProps = {
  makeOnDescriptionChange: (SubproblemID => (string => void)),
  makeOnInputChange: ((SubproblemID, string) => (SyntheticEvent<HTMLInputElement> => void)),
  makeOnRemove: (SubproblemID => (() => void)),
  onAdd: (() => void),
  subproblems: Subproblem[],
};

export default function SubproblemFormList(props: SubproblemFormListProps): React.Node {
  return (
    <div>
      {props.subproblems.length > 0 && props.subproblems.map((subproblem: Subproblem): React.Node => (
        <SubproblemForm
          key={subproblem.id}

          id={subproblem.id}
          description={subproblem.description}
          grade={subproblem.grade}
          makeOnDescriptionChange={props.makeOnDescriptionChange}
          makeOnInputChange={props.makeOnInputChange}
          makeOnRemove={props.makeOnRemove}
          optional={subproblem.optional}
          position={subproblem.position}
        />
      ))}
      <Button onClick={props.onAdd} type="button">Add subproblem</Button>
    </div>
  );
}
