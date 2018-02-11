package model

import (
	"context"
	"database/sql"
	"errors"

	"github.com/bogem/palp/util"
)

var ErrProblemIsNotFound = errors.New("problem is not found")

type Registry interface {
	GetUser(id UserID) (*User, error)
	HasEditor(problemID ProblemID, userID UserID) (bool, error)
	HasParticipant(ctx context.Context, problemID ProblemID, userID UserID) (bool, error)

	GetProblem(ctx context.Context, id ProblemID) (*Problem, error)
	GetSubproblems(ctx context.Context, id ProblemID) ([]*Subproblem, error)
	GetTests(id SubproblemID) ([]*Test, error)
}

type registry struct {
	db *sql.DB
}

func NewRegistry(db *sql.DB) Registry {
	return &registry{db}
}

func (r *registry) GetUser(id UserID) (*User, error) {
	if !IsCorrectUserID(id) {
		return nil, errors.New("user id is not correct")
	}

	user := User{id: id}
	row := r.db.QueryRow("SELECT username,role FROM users WHERE id=?", id)
	err := row.Scan(&user.username, &user.role)
	return &user, err
}

func (r *registry) HasEditor(problemID ProblemID, userID UserID) (bool, error) {
	if !IsCorrectProblemID(problemID) {
		return false, errors.New("problem id is not correct")
	}
	if !IsCorrectUserID(userID) {
		return false, errors.New("user id is not correct")
	}

	query := "SELECT COUNT(*) FROM problem_editors WHERE problem_id=? AND user_id=?"
	row := r.db.QueryRow(query, problemID, userID)

	var count byte
	err := row.Scan(&count)
	return count > 0, err
}

func (r *registry) HasParticipant(ctx context.Context, problemID ProblemID, userID UserID) (bool, error) {
	if !IsCorrectProblemID(problemID) {
		return false, errors.New("problem id is not correct")
	}
	if !IsCorrectUserID(userID) {
		return false, errors.New("user id is not correct")
	}

	// Query to check if user is participant (solver or editor).
	query := `
(SELECT 1
FROM users
INNER JOIN (problem_classrooms,classroom_users)
ON (users.id=classroom_users.user_id AND classroom_users.classroom_id=problem_classrooms.classroom_id)
WHERE problem_classrooms.problem_id=? AND users.id=?
LIMIT 1)
UNION ALL
(SELECT 1 FROM problem_editors WHERE user_id=? LIMIT 1)`

	row := r.db.QueryRowContext(ctx, query, problemID, userID, userID)

	var one byte
	err := row.Scan(&one)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}

	return true, nil
}

func (r *registry) GetProblem(ctx context.Context, id ProblemID) (*Problem, error) {
	if !IsCorrectProblemID(id) {
		return nil, errors.New("problem id is not correct")
	}

	problem := Problem{id: id}
	row := r.db.QueryRowContext(ctx, "SELECT name,visible_for_classrooms FROM problems WHERE id=?", id)
	err := row.Scan(&problem.name, &problem.visibleForClassrooms)
	if err == sql.ErrNoRows {
		return nil, ErrProblemIsNotFound
	}
	if err != nil {
		return nil, err
	}
	return &problem, nil
}

func (r *registry) GetSubproblems(ctx context.Context, id ProblemID) ([]*Subproblem, error) {
	if !IsCorrectProblemID(id) {
		return nil, errors.New("problem id is not correct")
	}

	rows, err := r.db.QueryContext(ctx, "SELECT id,position,description,language,optional,grade FROM subproblems WHERE problem_id=? ORDER BY position ASC", id)
	if err != nil {
		return nil, util.WrapError("can't execute the query", err)
	}
	defer rows.Close()

	return ScanSubproblems(rows)
}

func (r *registry) GetTests(id SubproblemID) ([]*Test, error) {
	if !IsCorrectSubproblemID(id) {
		return nil, errors.New("subproblem id is not correct")
	}

	query := `
SELECT id,position,input,right_answer,subproblem_id
FROM tests
WHERE subproblem_id=?
ORDER BY position ASC`

	rows, err := r.db.Query(query, string(id))
	if err != nil {
		return nil, util.WrapError("can't execute the query", err)
	}
	defer rows.Close()

	return ScanTests(rows)
}
