package model

type ClassroomID int
type ProblemID int
type ResultID int
type SubproblemID string
type TestID string
type UserID int

const (
	NullClassroomID  = ClassroomID(0)
	NullProblemID    = ProblemID(0)
	NullResultID     = ResultID(0)
	NullSubproblemID = SubproblemID("")
	NullTestID       = TestID("")
	NullUserID       = UserID(0)
)

func IsCorrectClassroomID(id ClassroomID) bool {
	return id != NullClassroomID
}

func IsCorrectProblemID(id ProblemID) bool {
	return id != NullProblemID
}

func IsCorrectResultID(id ResultID) bool {
	return id != NullResultID
}

func IsCorrectSubproblemID(id SubproblemID) bool {
	return id != NullSubproblemID
}

func IsCorrectTestID(id TestID) bool {
	return id != NullTestID
}

func IsCorrectUserID(id UserID) bool {
	return id != NullUserID
}
