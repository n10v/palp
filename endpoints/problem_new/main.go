package problem_new

import (
	"fmt"
	"net/http"

	"github.com/bogem/palp/endpoints"
	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

type ProblemNewEndpoint struct {
	*endpoints.Controller
}

func NewProblemNewEndpoint(c *endpoints.Controller) *ProblemNewEndpoint {
	return &ProblemNewEndpoint{c}
}

func (e *ProblemNewEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "POST" {
		return endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	user, err := e.GetUser(r)
	if err != nil {
		return util.WrapError("can't get user from request", err)
	}

	if !user.Role().CanCreateProblems() {
		return endpoints.WriteStatus(w, http.StatusForbidden)
	}

	tx, err := e.DB().Begin()
	if err != nil {
		return util.WrapError("can't begin transaction", err)
	}

	problemID, err := addProblem(tx, model.NewProblem(model.NullProblemID, "New Problem", false))
	if err != nil {
		tx.Rollback()
		return util.WrapError("can't add problem", err)
	}

	fmt.Println(problemID)

	if err := addEditor(tx, problemID, user.ID()); err != nil {
		tx.Rollback()
		return util.WrapError("can't add editor", err)
	}

	if err := tx.Commit(); err != nil {
		return util.WrapError("can't commit transaction", err)
	}

	return endpoints.WriteJSON(w, response{problemID})
}
