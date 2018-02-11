// @flow

import type { $AxiosXHR } from 'axios';
import * as React from 'react';
import { Redirect } from 'react-router';

import { LoginButton, LoginCallout, LoginInput } from './components';
import type { ErrorResponse } from '../../components';
import { Page, resolveErrorMessage } from '../../components';
import type { IsLoggedInResponseData, LoginResponseData } from './types';
import { getJSON, sendPostRequest } from '../../utils';

type State = {|
  error: string,
  isFetched: boolean,
  isLoggedIn: boolean,
|};

export default class LoginPage extends React.Component<void, State> {
  state = {
    error: '',
    isFetched: false,
    isLoggedIn: false,
  };

  componentDidMount() {
    document.title = 'Welcome to PALP!';
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    var component = this;
    getJSON('/endpoints/is_logged_in/')
      .then((response: $AxiosXHR<IsLoggedInResponseData>) => {
        const data = (response.data: IsLoggedInResponseData);
        const { isLoggedIn } = data;
        component.setState({ isFetched: true, isLoggedIn });
      })
      .catch((error: ErrorResponse) => {
        component.setState({ error: resolveErrorMessage(error) });
      });
  }

  handleLogIn = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = document.querySelector('form');
    if (!form) {
      return;
    }

    const formData = new FormData(form);

    var component = this;
    sendPostRequest('/endpoints/login/', formData)
      .then((response: $AxiosXHR<LoginResponseData>) => {
        const data = (response.data: LoginResponseData);
        document.cookie = `token=${data.token}; path=/`;
        component.setState({ isLoggedIn: true });
      })
      .catch((error: ErrorResponse) => {
        component.setState({ error: resolveErrorMessage(error) });
      });
  }

  render(): React.Node {
    if (this.state.isLoggedIn) return (<Redirect to='/home' />);

    return (
      <Page disableContainer hideBody={!this.state.isFetched} hideNavbar>
        <div className="login-page">
          <h1 className="login-page__h1">Welcome!</h1>
          <form className="login-form" onSubmit={this.handleLogIn}>
            <LoginInput name="username" placeholder="username" type="text" />
            <LoginInput name="password" placeholder="password" type="password" />

            <LoginButton>Log in</LoginButton>
          </form>
          {this.state.error !== '' &&
            <LoginCallout>{this.state.error}</LoginCallout> }
        </div>
      </Page>
    );
  }
}
