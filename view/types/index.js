// @flow

type ClassroomID = number;
type ProblemID = number;
type ResultID = number;
type SubproblemID = string;
type TestID = string;
type UserID = number;

const nullClassroomID: ClassroomID = 0;
const nullProblemID: ProblemID = 0;
const nullResultID: ResultID = 0;
const nullSubproblemID: SubproblemID = '';
const nullTestID: TestID = '';
const nullUserID: UserID = 0;

type Classroom = {|
  id: ClassroomID,
  name: string,
|};

type Test = {|
  id: TestID,
  position: number,
  input: string,
  rightAnswer: string,
  subproblemID: SubproblemID
|};

type TestPropTypes = $Values<Test>;

export type {
  Classroom,
  ClassroomID,
  ProblemID,
  ResultID,
  SubproblemID,
  Test,
  TestID,
  TestPropTypes,
  UserID,
};
export {
  nullClassroomID,
  nullProblemID,
  nullResultID,
  nullSubproblemID,
  nullTestID,
  nullUserID,
};
