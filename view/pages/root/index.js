import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import LoginPage from '../login';
import LogoutPage from '../logout';
import HomePage from '../home';
import ProblemEditPage from '../problem_edit';
import ProblemSolvePage from '../problem_solve';
import store from './store';

function Root() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <>
          <Route exact path='/' component={LoginPage} />
          <Route path='/home' component={HomePage} />
          <Route path='/logout' component={LogoutPage} />
         <Route path='/problem/edit/:problemID' component={ProblemEditPage} />
         <Route path='/problem/solve/:problemID' component={ProblemSolvePage} />
        </>
      </BrowserRouter>
    </Provider>
  );
}

ReactDOM.render(<Root />, document.getElementById('root'));

