package problem_edit

import (
	"net/http"

	"github.com/bogem/palp/endpoints"
	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

type ProblemEditEndpoint struct {
	*endpoints.Controller
}

func NewProblemEditEndpoint(c *endpoints.Controller) *ProblemEditEndpoint {
	return &ProblemEditEndpoint{c}
}

func (e *ProblemEditEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "GET" {
		return endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	problemID, err := endpoints.GetProblemID(r.URL.Path, "/endpoints/problem/edit/")
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

	canEdit, err := e.CanUserEdit(problemID, r)
	if err != nil {
		return err
	}
	if !canEdit {
		return endpoints.WriteStatus(w, http.StatusForbidden)
	}

	allClassrooms, err := getAllClassrooms(e.DB())
	if err != nil {
		return util.WrapError("can't get all classrooms", err)
	}
	respClassroomIDs := resolveClassroomIDs(allClassrooms)
	respClassrooms := newResponseClassrooms(allClassrooms)

	subproblems, err := e.Registry().GetSubproblems(rCtx, problemID)
	if err != nil {
		return util.WrapError("can't get subproblems", err)
	}
	classrooms, err := getClassrooms(e.DB(), problemID)
	if err != nil {
		return util.WrapError("can't get classrooms", err)
	}
	classroomIDs := resolveClassroomIDs(classrooms)
	respProblem := newResponseProblem(problem, classroomIDs)

	subproblemTests, err := getProblemTests(e.DB(), problemID)
	if err != nil {
		return util.WrapError("can't get tests", err)
	}
	subproblemTestIDs := resolveSubproblemTestIDs(subproblemTests)
	respSubproblems := newResponseSubproblems(subproblems, subproblemTestIDs)
	respTests := newResponseTests(subproblemTests)

	resp := response{
		ClassroomIDs: respClassroomIDs,
		Classrooms:   respClassrooms,
		Problem:      respProblem,
		Subproblems:  respSubproblems,
		Tests:        respTests,
	}

	return endpoints.WriteJSON(w, resp)
}

func resolveClassroomIDs(classrooms []*model.Classroom) []model.ClassroomID {
	ids := make([]model.ClassroomID, 0, len(classrooms))
	for _, classroom := range classrooms {
		ids = append(ids, classroom.ID())
	}
	return ids
}

func resolveSubproblemTestIDs(subproblemTests map[model.SubproblemID][]*model.Test) map[model.SubproblemID][]model.TestID {
	ids := make(map[model.SubproblemID][]model.TestID, len(subproblemTests))
	for subproblemID, tests := range subproblemTests {
		testIDs := make([]model.TestID, 0, len(tests))
		for _, test := range tests {
			testIDs = append(testIDs, test.ID())
		}
		ids[subproblemID] = testIDs
	}
	return ids
}
