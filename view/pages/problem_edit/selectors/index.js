// @flow

import type {
  ClassroomID,
  Classroom,
  SubproblemID,
  TestID,
  Test
} from '../../../types';
import type { Problem, ReduxState, Subproblem } from '../types';
import { resolveSortedSubproblemList } from '../utils';

function getAllClassrooms(state: ReduxState): Classroom[] {
  if (state.classroomIDs.length === 0) {
    return [];
  }

  var classrooms = [];
  for (var classroomID of state.classroomIDs) {
    classrooms.push(state.classrooms[classroomID]);
  }
  return classrooms;
}

function getProblemClassrooms(state: ReduxState): Classroom[] {
  const allClassrooms = state.classrooms;
  const problemClassroomIDs = state.problem.classroomIDs;
  if (Object.getOwnPropertyNames(allClassrooms).length > 0 && problemClassroomIDs.length > 0) {
    return problemClassroomIDs.map((id: ClassroomID): Classroom => allClassrooms[id]);
  }
  return [];
}

function getProblem(state: ReduxState): Problem {
  return state.problem;
}

function getSubproblems(state: ReduxState): Subproblem[] {
  return resolveSortedSubproblemList(state.subproblems);
}

function getTests(state: ReduxState, subproblemID: SubproblemID): Test[] {
  const allTests = state.tests;
  const testIDs = state.subproblems[subproblemID].testIDs;
  if (Object.getOwnPropertyNames(allTests).length > 0 && testIDs.length > 0) {
    return testIDs.map((id: TestID): Test => allTests[id]);
  }
  return [];
}

export {
  getAllClassrooms,
  getProblemClassrooms,
  getProblem,
  getSubproblems,
  getTests,
};
