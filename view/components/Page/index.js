// @flow

import type { $AxiosError } from 'axios';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import * as React from 'react';

type ErrorResponse = $AxiosError<{ error?: string}>;

function resolveErrorMessage(error: ErrorResponse): string {
  if (error.response != null) {
    const { response } = error;
    if (response.data.error == null) {
      return response.statusText;
    }
    return response.data.error;
  } else if (error.request != null) {
    return 'Network connection error';
  } else {
    return error.message;
  }
}

type Props = {|
  children?: React.Node,
  disableContainer?: boolean,
  error?: string,
  hideBody?: boolean,
  hideNavbar?: boolean,
|};

function Page(props: Props): React.Node {
  const className = classnames({
    'main': true,
    'container': !props.disableContainer,
  });

  return (
    <>
      {!props.hideNavbar && (<Navbar />)}
      <main className={className}>
        {props.error != null && props.error !== '' &&
            <p className="error-message">{props.error}</p>}
        {!props.hideBody && props.children}
      </main>
    </>
  );
}

function Navbar(): React.Node {
  return (
    <nav className="pt-navbar pt-dark navbar">
      <div className="container">
        <div className="pt-navbar-group pt-align-left">
          <Link className="pt-button pt-minimal pt-icon-home" to="/home">Home</Link>
        </div>
        <div className="pt-navbar-group pt-align-right">
          <Link className="pt-button pt-minimal pt-icon-log-out" to="/logout">Logout</Link>
        </div>
      </div>
    </nav>
  );
}


export type { ErrorResponse };
export {
  resolveErrorMessage,
  Page,
};
