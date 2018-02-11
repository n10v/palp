// @flow

import { Redirect } from 'react-router';
import * as React from 'react';

type State = {|
  isLoggedOut: boolean;
|};

export default class LogoutPage extends React.Component<void, State> {
  state = {
    isLoggedOut: false,
  };

  componentDidMount() {
    this.deleteToken();
    this.setState({ isLoggedOut: true });
  }

  deleteToken = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
  };

  render(): React.Node {
    return this.state.isLoggedOut
      ? (<Redirect to="/" />)
      : (<p>Logging out...</p>);
  }
}
