package model

import "encoding/json"

type Problem struct {
	id                   ProblemID
	name                 string
	visibleForClassrooms bool
}

func NewProblem(id ProblemID, name string, visibleForClassrooms bool) *Problem {
	return &Problem{
		id:                   id,
		name:                 name,
		visibleForClassrooms: visibleForClassrooms,
	}
}

func (p *Problem) ID() ProblemID {
	return p.id
}

func (p *Problem) Name() string {
	return p.name
}

func (p *Problem) VisibleForClassrooms() bool {
	return p.visibleForClassrooms
}

func (p *Problem) MarshalJSON() ([]byte, error) {
	v := struct {
		ID                   ProblemID `json:"id"`
		Name                 string    `json:"name"`
		VisibleForClassrooms bool      `json:"visibleForClassrooms"`
	}{
		ID:                   p.ID(),
		Name:                 p.Name(),
		VisibleForClassrooms: p.VisibleForClassrooms(),
	}

	return json.Marshal(v)
}
