// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { Dispatch } from 'redux';

import type { Action } from '../actions';
import { addSubproblem, editSubproblem, removeSubproblem } from '../actions';
import { SubproblemFormList } from '../components';
import { getSubproblems } from '../selectors';
import type { SubproblemID } from '../../../types';
import type { Subproblem } from '../types';

type Props = {|
  makeOnDescriptionChange: (SubproblemID => (string => void)),
  makeOnInputChange: ((SubproblemID, string) => (SyntheticEvent<HTMLInputElement> => void)),
  makeOnRemove: (SubproblemID => (() => void)),
  handleAdd: (() => void),
  subproblems: Subproblem[],
|};

function SubproblemFormListContainer(props: Props): React.Node {
  return (
    <SubproblemFormList
      makeOnDescriptionChange={props.makeOnDescriptionChange}
      makeOnInputChange={props.makeOnInputChange}
      makeOnRemove={props.makeOnRemove}
      onAdd={props.handleAdd}
      subproblems={props.subproblems}
    />
  );
}

function mapStateToProps(state) {
  return {
    subproblems: getSubproblems(state.problemEditPage),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    handleAdd: () => {
      dispatch(addSubproblem());
    },

    makeOnRemove: (id: SubproblemID): (() => void) => {
      return (): void => {
        var result = confirm('Are you sure you want to delete this suproblem?');
        if (!result) {
          return;
        }
        dispatch(removeSubproblem(id));
      };
    },

    makeOnInputChange: (id: SubproblemID, prop: string): (SyntheticEvent<HTMLInputElement> => void) => {
      return (e: SyntheticEvent<HTMLInputElement>) => {
        const t = (e.currentTarget: HTMLInputElement);
        const value = t.type === 'checkbox' ? t.checked : t.value;
        dispatch(editSubproblem(id, prop, value));
      };
    },

    makeOnDescriptionChange: (id: SubproblemID): (string => void) => {
      return (v: string): void => {
        dispatch(editSubproblem(id, 'description', v));
      };
    }
  };
}


const connector: Connector<{}, Props> = connect(mapStateToProps, mapDispatchToProps);
export default connector(SubproblemFormListContainer);
