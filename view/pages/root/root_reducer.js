import problemEditReducer from '../problem_edit/reducers';
import problemSolveReducer from '../problem_solve/reducers';
import { assign } from '../../utils';

import { initialReduxState as problemEditInitialReduxState } from '../problem_edit/types';
import { initialReduxState as problemSolveInitialReduxState } from '../problem_solve/types';

const initialReduxState = {
  problemEditPage: problemEditInitialReduxState,
  problemSolvePage: problemSolveInitialReduxState,
};

export default function rootReducer(state = initialReduxState, action) {
  switch (true) {
  case action.type.startsWith('PROBLEM_EDIT'):
    return assign(state, { problemEditPage: problemEditReducer(state.problemEditPage, action) });
  case action.type.startsWith('PROBLEM_SOLVE'):
    return assign(state, { problemSolvePage: problemSolveReducer(state.problemSolvePage, action) });
  default:
    return state;
  }
}
