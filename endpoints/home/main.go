package home

import (
	"net/http"

	"github.com/bogem/palp/endpoints"
	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

type HomeEndpoint struct {
	*endpoints.Controller
}

func NewHomeEndpoint(c *endpoints.Controller) *HomeEndpoint {
	return &HomeEndpoint{c}
}

func (e *HomeEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "GET" {
		endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	user, err := e.GetUser(r)
	if err != nil {
		return util.WrapError("can't get user from request", err)
	}

	problems, err := getProblems(e.DB(), user.ID())
	if err != nil {
		return util.WrapError("can't get problems", err)
	}

	hasProblemsAsEditor := false
	for _, problem := range problems {
		if problem.CanBeEdited {
			hasProblemsAsEditor = true
			break
		}
	}

	respUser := responseUser{
		Username:            user.Username(),
		CanCreateProblems:   user.Role().CanCreateProblems(),
		ProblemIDs:          resolveProblemIDs(problems),
		HasProblemsAsEditor: hasProblemsAsEditor,
	}

	respProblems := newResponseProblems(problems)

	resp := response{
		User:     respUser,
		Problems: respProblems,
	}

	return endpoints.WriteJSON(w, resp)
}

func resolveProblemIDs(problems []responseProblem) []model.ProblemID {
	ids := make([]model.ProblemID, 0, len(problems))
	for _, problem := range problems {
		ids = append(ids, problem.ID)
	}
	return ids
}
