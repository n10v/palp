package problem_check_solution

import (
	"database/sql"
	"errors"

	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

func getSubproblemLanguage(db *sql.DB, id model.SubproblemID) (string, error) {
	if !model.IsCorrectSubproblemID(id) {
		return "", errors.New("subproblem id is not correct")
	}

	rows, err := db.Query("SELECT language FROM subproblems WHERE id=?", string(id))
	if err != nil {
		return "", util.WrapError("can't execute the query", err)
	}
	defer rows.Close()

	var language string
	if rows.Next() {
		if err := rows.Scan(&language); err != nil {
			return "", err
		}
	}

	return language, nil
}

func setResult(db *sql.DB, result *model.Result) error {
	_, err := db.Exec("DELETE FROM results WHERE subproblem_id=? AND user_id=?", string(result.SubproblemID()), int(result.UserID()))
	if err != nil {
		return util.WrapError("can't replace results", err)
	}

	query := "INSERT INTO results (success,message,last_checked_test,subproblem_id,user_id) VALUES (?,?,?,?,?)"
	_, err = db.Exec(query, result.Success(), result.Message(), result.LastCheckedTest(), string(result.SubproblemID()), int(result.UserID()))
	return err
}
