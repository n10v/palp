package problem_edit

import (
	"database/sql"
	"errors"

	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

func getProblemTests(db *sql.DB, id model.ProblemID) (map[model.SubproblemID][]*model.Test, error) {
	if !model.IsCorrectProblemID(id) {
		return nil, errors.New("problem id is blank")
	}

	query := `
SELECT tests.id,tests.position,tests.input,tests.right_answer,tests.subproblem_id
FROM tests
INNER JOIN subproblems
ON tests.subproblem_id=subproblems.id
WHERE subproblems.problem_id=?
ORDER BY tests.id,tests.position`

	rows, err := db.Query(query, id)
	if err != nil {
		return nil, errors.New("can't execute the query")
	}
	defer rows.Close()

	problemTests := map[model.SubproblemID][]*model.Test{}

	for rows.Next() {
		var (
			id           model.TestID
			position     int
			input        string
			rightAnswer  string
			subproblemID model.SubproblemID
		)
		rows.Scan(&id, &position, &input, &rightAnswer, &subproblemID)
		test := model.NewTest(id, position, input, rightAnswer, subproblemID)

		tests, ok := problemTests[subproblemID]
		if !ok {
			tests = make([]*model.Test, 0)
		}
		tests = append(tests, test)
		problemTests[subproblemID] = tests
	}

	return problemTests, rows.Err()
}

func getAllClassrooms(db *sql.DB) ([]*model.Classroom, error) {
	rows, err := db.Query("SELECT * FROM classrooms ORDER BY name ASC")
	if err != nil {
		return nil, util.WrapError("can't execute the query", err)
	}
	defer rows.Close()

	return model.ScanClassrooms(rows)
}

func getClassrooms(db *sql.DB, id model.ProblemID) ([]*model.Classroom, error) {
	if !model.IsCorrectProblemID(id) {
		return nil, errors.New("problem id is not correct")
	}

	query := `
SELECT classrooms.id,classrooms.name
FROM classrooms
INNER JOIN problem_classrooms ON classrooms.id=problem_classrooms.classroom_id
WHERE problem_classrooms.problem_id=?
ORDER BY name ASC`

	rows, err := db.Query(query, id)
	if err != nil {
		return nil, util.WrapError("can't execute the query", err)
	}
	defer rows.Close()

	return model.ScanClassrooms(rows)
}
