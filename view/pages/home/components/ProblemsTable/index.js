// @flow

import { Link } from 'react-router-dom';
import * as React from 'react';

import { Table } from '../../../../components';
import type { Problem } from '../../types';

type ProblemsTableProps = {|
  problems: Problem[],
  showActions: boolean,
|};


export default function ProblemsTable(props: ProblemsTableProps): React.Node {
  if (props.problems.length === 0) {
    return null;
  }

  return (
    <Table className="pt-striped problems-table">
      <thead>
        <tr>
          <th><b>Problems</b></th>
          { props.showActions && <th><b>Actions</b></th> }
        </tr>
      </thead>

      <tbody>
        {props.problems.map((problem: Problem): React.Node => {
          return (
            <ProblemRow
              key={problem.id}
              problem={problem}
              showActions={props.showActions}
            />
          );
        })}
      </tbody>
    </Table>
  );
}

type ProblemRowProps = {|
  problem: Problem,
  showActions: boolean,
|};

function ProblemRow(props: ProblemRowProps): React.Node {
  var { problem } = props;

  return (
    <tr>
      <td>
        <Link
          className="pt-button pt-minimal pt-intent-primary"
          to={`/problem/solve/${problem.id}/`}
        >
          {problem.name}
        </Link>
        {!problem.visibleForClassrooms &&
          <i>(not visible for classrooms)</i>}
      </td>
      {props.showActions && (
        <td>
          {problem.canBeEdited &&
            <Link
              className="pt-button pt-minimal pt-intent-primary"
              to={`/problem/edit/${problem.id}/`}
            >
              edit
            </Link>
          }
        </td>
      )}
    </tr>
  );
}
