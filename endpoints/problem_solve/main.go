package problem_solve

import (
	"net/http"

	"github.com/bogem/palp/endpoints"
	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

type ProblemSolveEndpoint struct {
	*endpoints.Controller
}

func NewProblemSolveEndpoint(c *endpoints.Controller) *ProblemSolveEndpoint {
	return &ProblemSolveEndpoint{c}
}

func (e *ProblemSolveEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "GET" {
		endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	problemID, err := endpoints.GetProblemID(r.URL.Path, "/endpoints/problem/solve/")
	if err != nil {
		return endpoints.WriteError(w, http.StatusNotFound, "problem not found")
	}

	rCtx := r.Context()

	problem, err := e.Registry().GetProblem(rCtx, problemID)
	if err == model.ErrProblemIsNotFound {
		return endpoints.WriteError(w, http.StatusNotFound, "problem not found")
	}
	if err != nil {
		return util.WrapError("can't get problem by ID", err)
	}

	userID, err := e.Authorizer().GetUserID(r)
	if err != nil {
		return util.WrapError("can't get userID from request", err)
	}

	canSolve, err := e.Registry().HasParticipant(rCtx, problemID, userID)
	if err != nil {
		return util.WrapError("can't figure out if user participates in problem", err)
	}
	if !canSolve {
		return endpoints.WriteStatus(w, http.StatusForbidden)
	}

	canEdit, err := e.CanUserEdit(problemID, r)
	if err != nil {
		return util.WrapError("can't figure out if user can edit problem", err)
	}

	if !canEdit && !problem.VisibleForClassrooms() {
		return endpoints.WriteStatus(w, http.StatusForbidden)
	}

	subproblems, err := e.Registry().GetSubproblems(rCtx, problemID)
	if err != nil {
		return util.WrapError("can't get subproblems", err)
	}

	respProblem := newResponseProblem(problem)

	respResults, err := getResults(rCtx, e.DB(), subproblems, userID)
	if err != nil {
		return util.WrapError("can't get results", err)
	}

	resp := response{
		Problem:     respProblem,
		Results:     respResults,
		Subproblems: newResponseSubproblems(subproblems),
	}

	return endpoints.WriteJSON(w, resp)
}
