package problem_new

import (
	"database/sql"
	"errors"

	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

func addProblem(tx *sql.Tx, problem *model.Problem) (model.ProblemID, error) {
	if tx == nil {
		return model.NullProblemID, errors.New("tx is nil")
	}

	result, err := tx.Exec("INSERT INTO problems SET name=?, visible_for_classrooms=?", problem.Name(), problem.VisibleForClassrooms())
	if err != nil {
		return model.NullProblemID, util.WrapError("can't execute the query", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return model.NullProblemID, util.WrapError("can't get LastInsertId", err)
	}

	return model.ProblemID(id), nil
}

func addEditor(tx *sql.Tx, problemID model.ProblemID, editorID model.UserID) error {
	if !model.IsCorrectProblemID(problemID) {
		return errors.New("problem id is not correct")
	}
	if tx == nil {
		return errors.New("tx is nil")
	}

	_, err := tx.Exec("INSERT INTO problem_editors SET problem_id=?, user_id=?", problemID, editorID)
	if err != nil {
		return err
	}

	return nil
}
