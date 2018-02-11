// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { Dispatch } from 'redux';

import type { Action } from '../actions';
import { toggleClassroom } from '../actions';
import { ClassroomCheckboxList } from '../components';
import { getAllClassrooms, getProblemClassrooms } from '../selectors';
import type { ClassroomID, Classroom } from '../../../types';

type Props = {|
  allClassrooms: Classroom[],
  checkedClassrooms: Classroom[],
  makeOnChange: (ClassroomID => (SyntheticEvent<HTMLInputElement> => void)),
|};

function ClassroomCheckboxListContainer(props: Props): React.Node {
  return (
    <ClassroomCheckboxList
      allClassrooms={props.allClassrooms}
      checkedClassrooms={props.checkedClassrooms}
      makeOnChange={props.makeOnChange}
    />
  );
}

function mapStateToProps(state) {
  const s = state.problemEditPage;
  return {
    allClassrooms: getAllClassrooms(s),
    checkedClassrooms: getProblemClassrooms(s),
  };
}

function mapDispatchOnChange(dispatch: Dispatch<Action>) {
  return {
    makeOnChange: (id: ClassroomID): (() => void) => {
      return () => {
        dispatch(toggleClassroom(id));
      };
    },
  };
}

const connector: Connector<{}, Props> = connect(mapStateToProps, mapDispatchOnChange);
export default connector(ClassroomCheckboxListContainer);
