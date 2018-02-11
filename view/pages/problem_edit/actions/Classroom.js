// @flow

import type { ClassroomID } from '../../../types';

const TOGGLE_CLASSROOM = 'PROBLEM_EDIT/TOGGLE_CLASSROOM';

type ToggleClassroomAction = {
  type: 'PROBLEM_EDIT/TOGGLE_CLASSROOM',
  payload: {
    id: ClassroomID
  },
};

function toggleClassroom(id: ClassroomID): ToggleClassroomAction {
  return { type: TOGGLE_CLASSROOM, payload: { id } };
}

export type { ToggleClassroomAction };
export {
  TOGGLE_CLASSROOM,
  toggleClassroom,
};

