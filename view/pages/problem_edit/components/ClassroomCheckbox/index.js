// @flow

import * as React from 'react';

import { Checkbox, Label } from '../../../../components/';
import type { ClassroomID, Classroom } from '../../../../types';

type ClassroomCheckboxListProps = {|
  allClassrooms: Classroom[],
  checkedClassrooms: Classroom[],

  makeOnChange: (ClassroomID => (SyntheticEvent<HTMLInputElement> => void)),
|};

export default function ClassroomCheckboxList(props: ClassroomCheckboxListProps): React.Node {
  if (props.allClassrooms.length === 0) {
    return null;
  }

  const classrooms = props.allClassrooms.map((classroom: Classroom): React.Node => {
    const checked = props.checkedClassrooms.some((checkedClassroom: Classroom): boolean => {
      return classroom.id === checkedClassroom.id;
    });

    return (
      <ClassroomCheckbox
        checked={checked}
        key={classroom.id}
        id={classroom.id}
        name={classroom.name}
        onChange={props.makeOnChange(classroom.id)}
      />
    );
  });

  return <div>{classrooms}</div>;
}

type ClassroomCheckboxProps = {|
  checked?: boolean,
  id: ClassroomID,
  name: string,
  onChange: (SyntheticEvent<HTMLInputElement> => void);
|};

function ClassroomCheckbox(props: ClassroomCheckboxProps): React.Node {
  return (
    <Label className="problem-form__classroom-label">
      <Checkbox
        checked={props.checked}
        name="classroomID"
        onChange={props.onChange}
        value={props.id}
      />
      {props.name}
    </Label>
  );
}
