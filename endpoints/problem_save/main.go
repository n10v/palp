package problem_save

import (
	"net/http"
	"net/url"
	"strconv"

	"github.com/bogem/palp/endpoints"
	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

type ProblemSaveEndpoint struct {
	*endpoints.Controller
}

func NewProblemSaveEndpoint(c *endpoints.Controller) *ProblemSaveEndpoint {
	return &ProblemSaveEndpoint{c}
}

func (e *ProblemSaveEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "POST" {
		return endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	problemID, err := endpoints.GetProblemID(r.URL.Path, "/endpoints/problem/save/")
	if err != nil {
		return endpoints.WriteError(w, http.StatusNotFound, "problem not found")
	}

	canEdit, err := e.CanUserEdit(problemID, r)
	if err != nil {
		return util.WrapError("can't figure out if user is participating in problem", err)
	}
	if !canEdit {
		return endpoints.WriteStatus(w, http.StatusForbidden)
	}

	visibleForClassrooms, err := strconv.ParseBool(r.FormValue("visibleForClassrooms"))
	if err != nil {
		visibleForClassrooms = false
	}
	problem := model.NewProblem(problemID, r.FormValue("name"), visibleForClassrooms)

	tx, err := e.DB().Begin()
	if err != nil {
		return util.WrapError("can't begin transaction", err)
	}

	if err := updateProblem(tx, problem); err != nil {
		return util.WrapError("can't update problem", err)
	}

	classroomIDs := resolveClassroomIDsFromForm(r.PostForm)
	if err := setClassrooms(tx, problemID, classroomIDs); err != nil {
		tx.Rollback()
		return util.WrapError("can't set participants", err)
	}

	subproblems := resolveSubproblemsFromRequest(r)
	if err := setSubproblems(tx, problemID, subproblems); err != nil {
		tx.Rollback()
		return util.WrapError("can't set subproblems", err)
	}

	tests := resolveTestsFromRequest(r)
	if err := setTests(tx, tests); err != nil {
		tx.Rollback()
		return util.WrapError("can't set tests", err)
	}

	if err := tx.Commit(); err != nil {
		return util.WrapError("can't commit transaction", err)
	}

	w.WriteHeader(http.StatusOK)
	return nil
}

func resolveClassroomIDsFromForm(form url.Values) []model.ClassroomID {
	ids := form["classroomID"]

	var classroomIDs []model.ClassroomID
	for _, id := range ids {
		classroomID, err := strconv.Atoi(id)
		if err != nil {
			continue
		}
		classroomIDs = append(classroomIDs, model.ClassroomID(classroomID))
	}

	return classroomIDs
}

func resolveSubproblemsFromRequest(r *http.Request) []*model.Subproblem {
	subproblems := []*model.Subproblem{}

	ids := r.Form["subproblemID"]
	for _, id := range ids {
		prefix := "subproblem[" + id + "]"
		position, _ := strconv.Atoi(r.FormValue(prefix + "[position]"))
		description := r.FormValue(prefix + "[description]")
		language := r.FormValue(prefix + "[language]")
		optional, err := strconv.ParseBool(r.FormValue(prefix + "[optional]"))
		if err != nil {
			optional = false
		}
		grade, _ := strconv.Atoi(r.FormValue(prefix + "[grade]"))

		subproblem := model.NewSubproblem(model.SubproblemID(id), position, description, language, optional, grade)
		subproblems = append(subproblems, subproblem)
	}

	return subproblems
}

func resolveTestsFromRequest(r *http.Request) []*model.Test {
	tests := []*model.Test{}

	ids := r.Form["testID"]
	for _, id := range ids {
		prefix := "test[" + id + "]"
		position, _ := strconv.Atoi(r.FormValue(prefix + "[position]"))
		input := r.FormValue(prefix + "[input]")
		rightAnswer := r.FormValue(prefix + "[rightAnswer]")
		subproblemID := r.FormValue(prefix + "[subproblemID]")

		test := model.NewTest(model.TestID(id), position, input, rightAnswer, model.SubproblemID(subproblemID))
		tests = append(tests, test)
	}

	return tests
}
