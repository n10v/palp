// @flow

import * as React from 'react';

import {
  A,
  Button,
  HiddenInput, Table,
  Textarea,
} from '../../../../components';
import type { SubproblemID, TestID, Test } from '../../../../types';

type TestFormProps = {|
  id: TestID,
  input: string,
  makeOnChange: ((TestID, string) => (SyntheticEvent<HTMLTextAreaElement> => void)),
  makeOnRemove: (TestID => (() => void)),
  position: number,
  rightAnswer: string,
  subproblemID: SubproblemID,
|};

function TestForm(props: TestFormProps): React.Node {
  const prefix = `test[${props.id}]`;

  return (
    <tr>
      <td>
        <Textarea
          name={`${prefix}[input]`}
          onChange={props.makeOnChange(props.id, 'input')}
          rows={2}
          value={props.input}
        />
      </td>

      <td>
        <Textarea
          name={`${prefix}[rightAnswer]`}
          onChange={props.makeOnChange(props.id, 'rightAnswer')}
          rows={2}
          value={props.rightAnswer}
        />
      </td>

      <td>
        <HiddenInput name="testID" value={props.id} />
        <HiddenInput name={`${prefix}[position]`} value={props.position} />
        <HiddenInput name={`${prefix}[subproblemID]`} value={props.subproblemID} />

        <A onClick={props.makeOnRemove(props.id)}>remove</A>
      </td>
    </tr>
  );
}

type TestFormTableProps = {|
  makeOnChange: ((TestID, string) => (SyntheticEvent<HTMLTextAreaElement> => void)),
  makeOnRemove: (TestID => (() => void)),
  onAdd: (() => void),
  subproblemID: SubproblemID,
  tests?: Test[],
|};

export default function TestFormTable(props: TestFormTableProps): React.Node {
  var rows;

  if (props.tests != null && props.tests.length > 0) {
    rows = props.tests.map((test: Test): React.Node => (
      <TestForm
        key={test.id}

        id={test.id}
        input={test.input}
        makeOnChange={props.makeOnChange}
        makeOnRemove={props.makeOnRemove}
        position={test.position}
        rightAnswer={test.rightAnswer}
        subproblemID={props.subproblemID}
      />
    ));
  }

  return (
    <>
      <Table className="subproblem__tests">
        <thead>
          <tr>
            <th>Input</th>
            <th>Right answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Button
        className="subproblem__add-test-button"
        onClick={props.onAdd}
        type="button"
      >
        Add test
      </Button>
    </>
  );
}
