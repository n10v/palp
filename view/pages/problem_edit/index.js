// @flow

import type { $AxiosXHR } from 'axios';
import { connect } from 'react-redux';
import type { Match } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import * as React from 'react';
import type { Dispatch } from 'redux';

import type { Action } from './actions';
import { setState } from './actions';
import { ProblemFormContainer } from './containers';
import type { ErrorResponse } from '../../components';
import {
  Page,
  clearToaster,
  openToast,
  resolveErrorMessage
} from '../../components';
import type { ReduxState } from './types';
import { getJSON, sendPostRequest } from '../../utils';

type Props = {|
  dispatch: Dispatch<Action>,
  match: Match,
|};

type State = {|
  error: string,
  isFetched: boolean,
  isRemoved: boolean,
|};

class ProblemEditPage extends React.Component<Props, State> {
  problemID: string;

  state = {
    error: '',
    isFetched: false,
    isRemoved: false,
  };

  constructor(props: Props) {
    super(props);

    const { problemID } = this.props.match.params;

    if (problemID) {
      this.problemID = problemID;
    } else {
      throw new Error('problemID is null');
    }
  }

  componentDidMount() {
    if (!this.state.isFetched) {
      this.retrieveProblem();
    }
  }

  componentWillUnmount() {
    clearToaster();
  }

  handleProblemRemove = () => {
    const result = confirm('Are you sure you want to delete this problem?');
    if (!result) {
      return;
    }

    var component = this;
    sendPostRequest(`/endpoints/problem/remove/${this.problemID}/`)
      .then(() => component.setState({ isRemoved: true }))
      .catch((error: ErrorResponse) => {
        openToast(resolveErrorMessage(error), false);
      });
  };

  handleProblemSubmit = () => {
    const form = document.querySelector('form');
    if (!form) {
      openToast('Internal error by saving', false);
      return;
    }

    const formData = new FormData(form);
    sendPostRequest(`/endpoints/problem/save/${this.problemID}/`, formData)
      .then(() => openToast('Problem successfully saved!', true))
      .catch((error: ErrorResponse) => {
        openToast(resolveErrorMessage(error), false);
      });
  };

  retrieveProblem = () => {
    var component = this;
    getJSON(`/endpoints/problem/edit/${this.problemID}`)
      .then((response: $AxiosXHR<ReduxState>) => {
        const { data } = response;
        document.title = `Edit "${data.problem.name}"`;
        component.props.dispatch(setState(data));
        component.setState({ isFetched: true });
      })
      .catch((error: ErrorResponse) => {
        component.setState({ error: resolveErrorMessage(error) });
      });
  };

  render(): React.Node {
    if (this.state.isRemoved) return (<Redirect to='/home' />);

    const hideBody = this.state.isFetched == false || this.state.error !== '';

    return (
      <Page
        error={this.state.error}
        hideBody={hideBody}
      >
        <ProblemFormContainer
          onRemove={this.handleProblemRemove}
          onSubmit={this.handleProblemSubmit}
        />
      </Page >
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<Action>, ownProps: { match: Match }): Props {
  return { dispatch, match: ownProps.match };
}

const ConnectedProblemEditPage = connect(null, mapDispatchToProps)(ProblemEditPage);

export default ConnectedProblemEditPage;
