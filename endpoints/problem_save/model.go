package problem_save

import (
	"database/sql"
	"errors"
	"time"

	"github.com/bogem/palp/model"
)

func setClassrooms(tx *sql.Tx, problemID model.ProblemID, classroomIDs []model.ClassroomID) error {
	if !model.IsCorrectProblemID(problemID) {
		return errors.New("problem id is not correct")
	}
	if tx == nil {
		return errors.New("tx is nil")
	}

	tx.Exec("DELETE FROM problem_classrooms WHERE problem_id=?", problemID)

	if len(classroomIDs) < 1 {
		return nil
	}

	stmt, err := tx.Prepare("INSERT INTO problem_classrooms (problem_id,classroom_id) VALUES (?,?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, id := range classroomIDs {
		_, err := stmt.Exec(problemID, id)
		if err != nil {
			return err
		}
	}

	return nil
}

func setSubproblems(tx *sql.Tx, problemID model.ProblemID, subproblems []*model.Subproblem) error {
	if !model.IsCorrectProblemID(problemID) {
		return errors.New("problem id is not correct")
	}
	if tx == nil {
		return errors.New("tx is nil")
	}

	updated := time.Now().Format("2006-01-02 15:04:05")

	if len(subproblems) > 0 {
		stmt, err := tx.Prepare("REPLACE INTO subproblems (id,position,description,type,language,optional,grade,problem_id,updated) VALUES (?,?,?,?,?,?,?,?,?)")
		if err != nil {
			return err
		}
		defer stmt.Close()

		for _, sp := range subproblems {
			_, err := stmt.Exec(string(sp.ID()), sp.Position(), sp.Description(), "code",
				sp.Language(), sp.Optional(), sp.Grade(), problemID, updated)
			if err != nil {
				return err
			}
		}
	}

	_, err := tx.Exec("DELETE FROM subproblems WHERE problem_id=? AND updated < ?", problemID, updated)
	return err
}

func setTests(tx *sql.Tx, tests []*model.Test) error {
	if tx == nil {
		return errors.New("tx is nil")
	}

	// Delete all tests with corresponding subproblemIDs.
	subproblemIDs := make(map[model.SubproblemID]struct{})
	for _, test := range tests {
		subproblemIDs[test.SubproblemID()] = struct{}{}
	}
	for subproblemID := range subproblemIDs {
		tx.Exec("DELETE FROM tests WHERE subproblem_id=?", subproblemID)
	}

	if len(tests) < 1 {
		return nil
	}

	// Insert tests.
	stmt, err := tx.Prepare("INSERT INTO tests (id,position,input,right_answer,subproblem_id) VALUES (?,?,?,?,?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, test := range tests {
		_, err := stmt.Exec(string(test.ID()), test.Position(), test.Input(), test.RightAnswer(), string(test.SubproblemID()))
		if err != nil {
			return err
		}
	}

	return nil
}

func updateProblem(tx *sql.Tx, problem *model.Problem) error {
	if tx == nil {
		return errors.New("tx is nil")
	}
	query := "UPDATE problems SET name=?, visible_for_classrooms=? WHERE id=?"
	_, err := tx.Exec(query, problem.Name(), problem.VisibleForClassrooms(), int(problem.ID()))
	return err
}
