package problem_edit

import "github.com/bogem/palp/model"

type response struct {
	ClassroomIDs []model.ClassroomID `json:"classroomIDs"`
	Classrooms   responseClassrooms  `json:"classrooms"`
	Problem      responseProblem     `json:"problem"`
	Subproblems  responseSubproblems `json:"subproblems"`
	Tests        responseTests       `json:"tests"`
}

type responseClassrooms map[model.ClassroomID]*model.Classroom
type responseSubproblems map[model.SubproblemID]responseSubproblem
type responseTests map[model.TestID]*model.Test

type responseProblem struct {
	ID                   model.ProblemID     `json:"id"`
	Name                 string              `json:"name"`
	VisibleForClassrooms bool                `json:"visibleForClassrooms"`
	ClassroomIDs         []model.ClassroomID `json:"classroomIDs"`
}

func newResponseProblem(problem *model.Problem, classroomIDs []model.ClassroomID) responseProblem {
	return responseProblem{
		ID:                   problem.ID(),
		Name:                 problem.Name(),
		VisibleForClassrooms: problem.VisibleForClassrooms(),
		ClassroomIDs:         classroomIDs,
	}
}

type responseSubproblem struct {
	ID          model.SubproblemID `json:"id"`
	Position    int                `json:"position"`
	Description string             `json:"description"`
	Language    string             `json:"language"`
	Optional    bool               `json:"optional"`
	Grade       int                `json:"grade"`
	TestIDs     []model.TestID     `json:"testIDs"`
}

func newResponseSubproblem(subproblem *model.Subproblem, testIDs []model.TestID) responseSubproblem {
	return responseSubproblem{
		ID:          subproblem.ID(),
		Position:    subproblem.Position(),
		Description: subproblem.Description(),
		Language:    subproblem.Language(),
		Optional:    subproblem.Optional(),
		Grade:       subproblem.Grade(),
		TestIDs:     testIDs,
	}
}

func newResponseSubproblems(subproblems []*model.Subproblem, subproblemTestsIDs map[model.SubproblemID][]model.TestID) responseSubproblems {
	respSubproblems := make(responseSubproblems, len(subproblems))
	for _, subproblem := range subproblems {
		testIDs := subproblemTestsIDs[subproblem.ID()]
		if testIDs == nil {
			testIDs = []model.TestID{}
		}
		respSubproblems[subproblem.ID()] = newResponseSubproblem(subproblem, testIDs)
	}
	return respSubproblems
}

func newResponseClassrooms(classrooms []*model.Classroom) responseClassrooms {
	respClassrooms := make(responseClassrooms, len(classrooms))
	for _, classroom := range classrooms {
		respClassrooms[classroom.ID()] = classroom
	}
	return respClassrooms
}

func newResponseTests(subproblemTests map[model.SubproblemID][]*model.Test) responseTests {
	respTests := make(responseTests, len(subproblemTests))
	for _, tests := range subproblemTests {
		for _, test := range tests {
			respTests[test.ID()] = test
		}
	}
	return respTests
}
