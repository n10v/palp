package home

import "github.com/bogem/palp/model"

type response struct {
	User     responseUser     `json:"user"`
	Problems responseProblems `json:"problems"`
}

type responseUser struct {
	Username            string            `json:"username"`
	CanCreateProblems   bool              `json:"canCreateProblems"`
	ProblemIDs          []model.ProblemID `json:"problemIDs"`
	HasProblemsAsEditor bool              `json:"hasProblemsAsEditor"`
}

type responseProblems map[model.ProblemID]responseProblem

type responseProblem struct {
	ID                   model.ProblemID `json:"id"`
	Name                 string          `json:"name"`
	VisibleForClassrooms bool            `json:"visibleForClassrooms"`
	CanBeEdited          bool            `json:"canBeEdited"`
}

func newResponseProblems(problems []responseProblem) responseProblems {
	respProblems := make(responseProblems, len(problems))
	for _, problem := range problems {
		respProblems[problem.ID] = problem
	}
	return respProblems
}
