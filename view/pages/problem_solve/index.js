// @flow

import type { $AxiosXHR } from 'axios';
import axios from 'axios';
import type { Connector } from 'react-redux';
import { connect } from 'react-redux';
import type { Match } from 'react-router';
import * as React from 'react';

import type { Action } from './actions';
import { setFile, setResult, setState } from './actions';
import type { ErrorResponse } from '../../components';
import { Page, resolveErrorMessage } from '../../components';
import { SolutionStatusContainer, SubproblemContainerList } from './containers';
import type { SubproblemID } from '../../types';
import type { Result, SolveResponseData } from './types';
import { getJSON, newCancelTokenSource, sendPostRequest } from '../../utils';

type Props = {|
  dispatch: Dispatch<Action>,
  match: Match,
|};

type State = {|
  error: string,
  isFetched: boolean,
|};

class ProblemSolvePage extends React.Component<Props, State> {
  problemID: string;

  state = {
    error: '',
    isFetched: false,
  };

  constructor(props: Props) {
    super(props);

    this.problemID = this.props.match.params.problemID;
  }

  componentDidMount() {
    if (!this.state.isFetched) {
      this.retrieveProblem();
    }
  }

  checkSolution = (subproblemID: SubproblemID, solutionFile: File) => {
    if (solutionFile == null) {
      return;
    }

    this.props.dispatch(setFile(subproblemID, solutionFile));

    var formData = new FormData();
    formData.append('problemID', this.problemID);
    formData.append('subproblemID', subproblemID);
    formData.append('solution', solutionFile);

    var cancelTokenSource = newCancelTokenSource();
    const result = { cancelTokenSource, message: 'Checking...', status: 'CHECK_IN_PROCESS' };
    this.props.dispatch(setResult(subproblemID, result));

    var component = this;
    sendPostRequest('/endpoints/problem/check_solution/', formData, cancelTokenSource.token)
      .then((response: $AxiosXHR<Result>) => {
        component.props.dispatch(setResult(subproblemID, response.data));
      })
      .catch((error: ErrorResponse) => {
        var result;
        if (axios.isCancel(error)) {
          result = { message: 'Canceled', status: 'CANCELED' };
        } else {
          result = { message: resolveErrorMessage(error), status: 'FAIL' };
        }
        component.props.dispatch(setResult(subproblemID, result));
      });
  };

  retrieveProblem = () => {
    if (this.state.isFetched) {
      return;
    }

    var component = this;
    getJSON(`/endpoints/problem/solve/${this.problemID}`)
      .then((response: $AxiosXHR<SolveResponseData>) => {
        const data = response.data;
        document.title = `Solve "${data.problem.name}"`;
        const state = {
          files: {},
          ...data,
        };
        this.props.dispatch(setState(state));
        component.setState({ isFetched: true });
      })
      .catch((error: ErrorResponse) => {
        component.setState({ error: resolveErrorMessage(error) });
      });
  };

  render(): React.Node {
    return (
      <Page
        error={this.state.error}
        hideBody={!this.state.isFetched || this.state.error !== ''}
      >
        <SolutionStatusContainer />
        <SubproblemContainerList checkSolution={this.checkSolution} />
      </Page>
    );
  }
}

type OwnProps = {|
  match: Match,
|};

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: OwnProps): Props {
  return {
    dispatch,
    match: ownProps.match,
  };
}

const connector: Connector<OwnProps, Props> = connect(null, mapDispatchToProps);
const ConnectedProblemSolvePage = connector(ProblemSolvePage);

export default ConnectedProblemSolvePage;
