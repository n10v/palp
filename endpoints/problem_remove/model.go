package problem_remove

import (
	"database/sql"
	"errors"

	"github.com/bogem/palp/model"
)

func removeProblem(db *sql.DB, id model.ProblemID) error {
	if !model.IsCorrectProblemID(id) {
		return errors.New("problem id is not correct")
	}
	_, err := db.Exec("DELETE FROM problems WHERE id=?", id)
	return err
}
