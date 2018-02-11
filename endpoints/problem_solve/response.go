package problem_solve

import (
	"github.com/bogem/moredown"
	"github.com/bogem/palp/model"
)

type response struct {
	Problem     responseProblem     `json:"problem"`
	Results     responseResults     `json:"results"`
	Subproblems responseSubproblems `json:"subproblems"`
}

type responseProblem struct {
	ID                   model.ProblemID `json:"id"`
	Name                 string          `json:"name"`
	VisibleForClassrooms bool            `json:"visibleForClassrooms"`
}

type responseResults map[model.SubproblemID]responseResult

type responseResult struct {
	Message string `json:"message"`
	Status  string `json:"status"`
	Test    int    `json:"test"`
}

type responseSubproblems map[model.SubproblemID]responseSubproblem

type responseSubproblem struct {
	ID                  model.SubproblemID `json:"id"`
	Position            int                `json:"position"`
	RenderedDescription string             `json:"renderedDescription"`
	Language            string             `json:"language"`
	Optional            bool               `json:"optional"`
	Grade               int                `json:"grade"`
}

func newResponseProblem(problem *model.Problem) responseProblem {
	return responseProblem{
		ID:                   problem.ID(),
		Name:                 problem.Name(),
		VisibleForClassrooms: problem.VisibleForClassrooms(),
	}
}

func newResponseSubproblems(subproblems []*model.Subproblem) responseSubproblems {
	respSubproblems := make(responseSubproblems, len(subproblems))
	for _, subproblem := range subproblems {
		respSubproblems[subproblem.ID()] = newResponseSubproblem(subproblem)
	}
	return respSubproblems
}

func newResponseSubproblem(subproblem *model.Subproblem) responseSubproblem {
	return responseSubproblem{
		ID:                  subproblem.ID(),
		Position:            subproblem.Position(),
		RenderedDescription: moredown.MarkdownString(subproblem.Description()),
		Language:            subproblem.Language(),
		Optional:            subproblem.Optional(),
		Grade:               subproblem.Grade(),
	}
}
