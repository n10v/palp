package problem_remove

import (
	"net/http"

	"github.com/bogem/palp/endpoints"
	"github.com/bogem/palp/util"
)

type ProblemRemoveEndpoint struct {
	*endpoints.Controller
}

func NewProblemRemoveEndpoint(c *endpoints.Controller) *ProblemRemoveEndpoint {
	return &ProblemRemoveEndpoint{c}
}

func (e *ProblemRemoveEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "POST" {
		return endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	problemID, err := endpoints.GetProblemID(r.URL.Path, "/endpoints/problem/remove/")
	if err != nil {
		return endpoints.WriteError(w, http.StatusNotFound, "problem not found")
	}

	canEdit, err := e.CanUserEdit(problemID, r)
	if err != nil {
		return err
	}
	if !canEdit {
		return endpoints.WriteStatus(w, http.StatusForbidden)
	}

	if err := removeProblem(e.DB(), problemID); err != nil {
		return util.WrapError("can't remove problem", err)
	}

	w.WriteHeader(http.StatusOK)
	return nil
}
