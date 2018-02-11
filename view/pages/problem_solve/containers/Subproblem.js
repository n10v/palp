// @flow

import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import * as React from 'react';

import { Subproblem as SubproblemComponent } from '../components';
import { getFile, getResults, getSubproblems } from '../selectors';
import type { SubproblemID } from '../../../types';
import type { ButtonType, Result, Subproblem } from '../types';
import { resolveSortedSubproblemList } from '../utils';

type SubproblemContainerProps = {|
  checkSolution: ((SubproblemID, File) => void),
  file?: File,
  result: Result,
  subproblem: Subproblem,
|};

function makeHandleCancelCheck(props: SubproblemContainerProps): (() => void) {
  return () => {
    const { cancelTokenSource } = props.result;
    if (cancelTokenSource != null) {
      cancelTokenSource.cancel();
    }
  };
}

function makeHandleFileInput(props: SubproblemContainerProps): (SyntheticEvent<HTMLInputElement> => void) {
  return (e: SyntheticEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files[0];
    if (file != null) {
      props.checkSolution(props.subproblem.id, file);
    }
  };
}

function makeHandleResendSolution(props: SubproblemContainerProps): (() => void) {
  return () => {
    if (props.file != null) {
      props.checkSolution(props.subproblem.id, props.file);
    }
  };
}

function SubproblemContainer(props: SubproblemContainerProps): React.Node {
  const { result } = props;

  var buttonType: ButtonType;
  if (result && result.status === 'CHECK_IN_PROCESS') {
    buttonType = 'CANCEL';
  } else if (props.file && result && result.status !== 'CHECK_IN_PROCESS') {
    buttonType = 'RESEND';
  }

  return (
    <SubproblemComponent
      buttonType={buttonType}
      file={props.file}
      grade={props.subproblem.grade}
      handleCancelCheck={makeHandleCancelCheck(props)}
      handleFileInput={makeHandleFileInput(props)}
      handleResendSolution={makeHandleResendSolution(props)}
      language={props.subproblem.language}
      optional={props.subproblem.optional}
      position={props.subproblem.position}
      renderedDescription={props.subproblem.renderedDescription}
      result={result}
    />
  );
}

type OwnProps = {|
  checkSolution: ((SubproblemID, File) => void),
|};

type SubproblemContainerListProps = {|
  checkSolution: ((SubproblemID, File) => void),
  getFile: (SubproblemID => File),
  results: { [SubproblemID]: Result },
  subproblems: { [SubproblemID]: Subproblem },
|};

function SubproblemContainerList(props: SubproblemContainerListProps): React.Node {
  const sortedSubproblemList = (resolveSortedSubproblemList(props.subproblems): Subproblem[]);
  return sortedSubproblemList.map((subproblem: Subproblem): React.Node => (
    <SubproblemContainer
      checkSolution={props.checkSolution}
      file={props.getFile(subproblem.id)}
      key={subproblem.id}
      result={props.results[subproblem.id]}
      subproblem={subproblem}
    />
  ));
}

function mapStateToProps(state, ownProps: OwnProps): SubproblemContainerListProps {
  const s = state.problemSolvePage;
  return {
    checkSolution: ownProps.checkSolution,
    getFile: (subproblemID: SubproblemID): File => getFile(s, subproblemID),
    results: getResults(s),
    subproblems: getSubproblems(s),
  };
}

const connector: Connector<OwnProps, SubproblemContainerListProps> = connect(mapStateToProps);
export default connector(SubproblemContainerList);
