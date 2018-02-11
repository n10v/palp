package home

import (
	"database/sql"
	"errors"

	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

func getProblems(db *sql.DB, id model.UserID) ([]responseProblem, error) {
	if !model.IsCorrectUserID(id) {
		return nil, errors.New("user id is not correct")
	}

	query := `
SELECT *
FROM (
	(SELECT problems.id,problems.name,problems.visible_for_classrooms,1
	FROM problems
	INNER JOIN problem_editors ON problems.id=problem_editors.problem_id
	WHERE problem_editors.user_id=?)

	UNION ALL

  (SELECT problems.id,problems.name,problems.visible_for_classrooms,0
	FROM problems
	INNER JOIN (problem_classrooms,classroom_users)
	ON (problems.id=problem_classrooms.problem_id AND problem_classrooms.classroom_id=classroom_users.classroom_id)
	WHERE classroom_users.user_id=? AND problems.visible_for_classrooms=true)
) t GROUP BY id DESC`

	rows, err := db.Query(query, id, id)
	if err != nil {
		return nil, util.WrapError("can't execute the query", err)
	}
	defer rows.Close()

	return scanProblems(rows)
}

func scanProblems(rows *sql.Rows) ([]responseProblem, error) {
	problems := []responseProblem{}

	for rows.Next() {
		problem := responseProblem{}
		rows.Scan(&problem.ID, &problem.Name, &problem.VisibleForClassrooms, &problem.CanBeEdited)
		problems = append(problems, problem)
	}

	return problems, rows.Err()
}
