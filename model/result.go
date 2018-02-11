package model

type Result struct {
	id              ResultID
	success         bool
	message         string
	lastCheckedTest int
	subproblemID    SubproblemID
	userID          UserID
}

func NewResult(success bool, message string, lastCheckedTest int, sid SubproblemID, uid UserID) *Result {
	return &Result{
		id:              NullResultID,
		success:         success,
		message:         message,
		lastCheckedTest: lastCheckedTest,
		subproblemID:    sid,
		userID:          uid,
	}
}

func (r *Result) ID() ResultID {
	return r.id
}

func (r *Result) Success() bool {
	return r.success
}

func (r *Result) Message() string {
	return r.message
}

func (r *Result) LastCheckedTest() int {
	return r.lastCheckedTest
}

func (r *Result) SubproblemID() SubproblemID {
	return r.subproblemID
}

func (r *Result) UserID() UserID {
	return r.userID
}
