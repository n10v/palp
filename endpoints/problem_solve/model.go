package problem_solve

import (
	"context"
	"database/sql"
	"errors"
	"strconv"

	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

const (
	resultStatusFail    = "FAIL"
	resultStatusSuccess = "SUCCESS"
)

func getResults(ctx context.Context, db *sql.DB, subproblems []*model.Subproblem, userID model.UserID) (responseResults, error) {
	if len(subproblems) == 0 {
		return nil, nil
	}
	if !model.IsCorrectUserID(userID) {
		return nil, errors.New("userID is not correct")
	}

	query := `
SELECT success,message,last_checked_test,subproblem_id
FROM results
WHERE user_id=? AND (`

	for i, s := range subproblems {
		query += "subproblem_id=" + strconv.Quote(string(s.ID()))
		if i == len(subproblems)-1 {
			query += ")"
		} else {
			query += " OR "
		}
	}

	rows, err := db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, util.WrapError("can't execute the query", err)
	}
	defer rows.Close()

	respResults := make(responseResults)
	for rows.Next() {
		var (
			respResult   responseResult
			subproblemID model.SubproblemID
			success      bool
		)

		rows.Scan(&success, &respResult.Message, &respResult.Test, &subproblemID)

		if success {
			respResult.Status = resultStatusSuccess
		} else {
			respResult.Status = resultStatusFail
		}
		respResults[subproblemID] = respResult
	}

	if len(respResults) != len(subproblems) {
		for _, s := range subproblems {
			if _, ok := respResults[s.ID()]; !ok {
				respResults[s.ID()] = responseResult{
					Message: "Not solved",
					Status:  "NOT_SOLVED",
				}
			}
		}
	}

	return respResults, nil

}
