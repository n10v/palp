// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { Dispatch } from 'redux';

import type { Action } from '../actions';
import { addTest, editTest, removeTest } from '../actions';
import { TestFormTable } from '../components';
import { getTests } from '../selectors';
import type { SubproblemID, Test, TestID } from '../../../types';

type Props = {|
  makeOnChange: ((TestID, string) => (SyntheticEvent<HTMLTextAreaElement> => void)),
  makeOnRemove: (TestID => (() => void)),
  handleAdd: (SubproblemID => void),
  subproblemID: SubproblemID,
  tests: Test[],
|};

function TestFormTableContainer(props: Props): React.Node {
  return (
    <TestFormTable
      makeOnChange={props.makeOnChange}
      makeOnRemove={props.makeOnRemove}
      onAdd={() => props.handleAdd(props.subproblemID)}
      subproblemID={props.subproblemID}
      tests={props.tests}
    />
  );
}

type OwnProps = {|
  subproblemID: SubproblemID,
|};

function mapStateToProps(state, ownProps: OwnProps) {
  return {
    tests: getTests(state.problemEditPage, ownProps.subproblemID),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    handleAdd: (subproblemID: SubproblemID) => {
      dispatch(addTest(subproblemID));
    },

    makeOnChange: (id: TestID, prop: string): (SyntheticEvent<HTMLTextAreaElement> => void) => {
      return (e: SyntheticEvent<HTMLTextAreaElement>) => {
        dispatch(editTest(id, prop, e.currentTarget.value));
      };
    },

    makeOnRemove: (id: TestID): (() => void) => {
      return (): void => {
        dispatch(removeTest(id));
      };
    },
  };
}

const connector: Connector<OwnProps, Props> = connect(mapStateToProps, mapDispatchToProps);
export default connector(TestFormTableContainer);
