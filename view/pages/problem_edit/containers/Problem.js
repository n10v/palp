// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { Dispatch } from 'redux';

import type { Action } from '../actions';
import { editProblem } from '../actions';
import { ProblemForm } from '../components';
import { getProblem } from '../selectors';

type Props = {|
  name: string,
  makeOnChange: (string => (SyntheticEvent<HTMLInputElement> => void)),
  onRemove: (SyntheticEvent<HTMLElement> => void),
  onSubmit: (SyntheticEvent<HTMLElement> => void),
  visibleForClassrooms: boolean,
|};

function ProblemFormContainer(props: Props): React.Node {
  return (
    <ProblemForm
      name={props.name}
      makeOnChange={props.makeOnChange}
      onRemove={props.onRemove}
      onSubmit={props.onSubmit}
      visibleForClassrooms={props.visibleForClassrooms}
    />
  );
}

function mapStateToProps(state) {
  const { name, visibleForClassrooms } = getProblem(state.problemEditPage);
  return { name, visibleForClassrooms };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    makeOnChange: (prop: string): (SyntheticEvent<HTMLInputElement> => void) => {
      return (e: SyntheticEvent<HTMLInputElement>) => {
        const t = (e.currentTarget: HTMLInputElement);
        const value = t.type === 'checkbox' ? t.checked : t.value;
        dispatch(editProblem(prop, value));
      };
    },
  };
}

const connector: Connector<{}, Props> = connect(mapStateToProps, mapDispatchToProps);
export default connector(ProblemFormContainer);
