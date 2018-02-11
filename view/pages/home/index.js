// @flow

import type { $AxiosXHR } from 'axios';
import * as React from 'react';
import { Redirect } from 'react-router-dom';

import type { ErrorResponse } from '../../components';
import {
  Button,
  Page,
  clearToaster,
  openToast,
  resolveErrorMessage
} from '../../components';
import { ProblemsTable } from './components';
import type { ProblemID } from '../../types';
import type { HomeResponseData, NewProblemResponseData, Problem, User } from './types';
import { blankUser } from './types';
import { getJSON, sendPostRequest } from '../../utils';

type State = {|
  error: string,
  isFetched: boolean,
  problems: { [ProblemID]: Problem },
  redirectURL: string,
  user: User,
|};

export default class HomePage extends React.Component<void, State> {
  state = {
    error: '',
    isFetched: false,
    problems: {},
    redirectURL: '',
    user: blankUser,
  };

  componentDidMount() {
    this.retrieveHomeData();
    document.title = 'PALP';
  }

  componentWillUnmount() {
    clearToaster();
  }

  retrieveHomeData = () => {
    var component = this;
    getJSON('/endpoints/home/')
      .then((response: $AxiosXHR<HomeResponseData>) => {
        const data = (response.data: HomeResponseData);
        component.setState({
          isFetched: true,

          problems: data.problems,
          user: data.user,
        });
      })
      .catch((error: ErrorResponse) => {
        component.setState({ error: resolveErrorMessage(error) });
      });
  };

  handleNewProblem = () => {
    var component = this;
    sendPostRequest('/endpoints/problem/new/')
      .then((response: $AxiosXHR<NewProblemResponseData>) => {
        const { problemID } = response.data;
        component.setState({ redirectURL: '/problem/edit/'+problemID });
      })
      .catch((error: ErrorResponse) => {
        openToast(resolveErrorMessage(error), false);
      });
  };

  render(): React.Node {
    if (this.state.redirectURL !== '') {
      return (<Redirect to={this.state.redirectURL} />);
    }

    var problems = this.state.user.problemIDs &&
                    this.state.user.problemIDs.map((problemID: ProblemID): Problem =>
                      this.state.problems[problemID]
                    ) || [];

    return (
      <Page
        error={this.state.error}
        hideBody={!this.state.isFetched || this.state.error !== ''}
      >
        <p><b>{this.state.user.username}</b></p>

        {this.state.user.canCreateProblems &&
          <Button
            iconName="add"
            onClick={this.handleNewProblem}
            type="button"
          >
            New Problem
          </Button>}

        <ProblemsTable
          problems={problems}
          showActions={this.state.user.hasProblemsAsEditor}
        />
      </Page>
    );
  }
}
