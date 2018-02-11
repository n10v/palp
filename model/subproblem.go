package model

type Subproblem struct {
	id          SubproblemID
	position    int
	description string
	language    string
	optional    bool
	grade       int
}

func NewSubproblem(id SubproblemID, position int, description, language string, optional bool, grade int) *Subproblem {
	return &Subproblem{
		id:          id,
		position:    position,
		description: description,
		language:    language,
		optional:    optional,
		grade:       grade,
	}
}

func (s *Subproblem) ID() SubproblemID {
	return s.id
}

func (s *Subproblem) Position() int {
	return s.position
}

func (s *Subproblem) Description() string {
	return s.description
}

func (s *Subproblem) Language() string {
	return s.language
}

func (s *Subproblem) Optional() bool {
	return s.optional
}

func (s *Subproblem) Grade() int {
	return s.grade
}
