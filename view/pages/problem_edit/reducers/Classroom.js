// @flow

import type { Action } from '../actions';
import { TOGGLE_CLASSROOM } from '../actions';
import type { ReduxState } from '../types';
import type { ClassroomID } from '../../../types';
import { assign } from '../../../utils';

export default function classroomReducer(state: ReduxState, action: Action): ReduxState {
  switch (action.type) {
  case TOGGLE_CLASSROOM: {
    const classroomIDs = toggleClassroom(action.payload.id, state.problem.classroomIDs);
    const problem = assign(state.problem, { classroomIDs: classroomIDs });
    return assign(state, { problem });
  }

  default:
    return state;
  }
}

function toggleClassroom(id: ClassroomID, classroomIDs: ClassroomID[]): ClassroomID[] {
  classroomIDs = classroomIDs.slice();

  const classroomIndex = classroomIDs.findIndex((classroomID: ClassroomID): boolean => (classroomID === id));
  if (classroomIndex >= 0) {
    // Classroom is already in classrooms => remove it.
    classroomIDs.splice(classroomIndex, 1);
  } else {
    // Classroom is not in classrooms => add it.
    classroomIDs.push(id);
  }

  return classroomIDs;
}
