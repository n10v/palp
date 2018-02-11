package model

import "encoding/json"

// Test is a primitive used for testing solvers' solutions.
type Test struct {
	id           TestID
	position     int
	input        string
	rightAnswer  string
	subproblemID SubproblemID
}

func NewTest(id TestID, position int, input, rightAnswer string, subproblemID SubproblemID) *Test {
	return &Test{
		id:           id,
		position:     position,
		input:        input,
		rightAnswer:  rightAnswer,
		subproblemID: subproblemID,
	}
}

func (t *Test) ID() TestID {
	return t.id
}

func (t *Test) Position() int {
	return t.position
}

func (t *Test) Input() string {
	return t.input
}

func (t *Test) RightAnswer() string {
	return t.rightAnswer
}

func (t *Test) SubproblemID() SubproblemID {
	return t.subproblemID
}

func (t *Test) MarshalJSON() ([]byte, error) {
	v := struct {
		ID           TestID       `json:"id"`
		Position     int          `json:"position"`
		Input        string       `json:"input"`
		RightAnswer  string       `json:"rightAnswer"`
		SubproblemID SubproblemID `json:"subproblemID"`
	}{
		ID:           t.ID(),
		Position:     t.Position(),
		Input:        t.Input(),
		RightAnswer:  t.RightAnswer(),
		SubproblemID: t.SubproblemID(),
	}

	return json.Marshal(v)
}
