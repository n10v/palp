package model

import "database/sql"

func ScanClassrooms(rows *sql.Rows) ([]*Classroom, error) {
	classrooms := []*Classroom{}

	for rows.Next() {
		classroom := Classroom{}
		rows.Scan(&classroom.id, &classroom.name)
		classrooms = append(classrooms, &classroom)
	}

	return classrooms, rows.Err()
}

func ScanProblems(rows *sql.Rows) ([]*Problem, error) {
	problems := []*Problem{}

	for rows.Next() {
		problem := Problem{}
		rows.Scan(&problem.id, &problem.name, &problem.visibleForClassrooms)
		problems = append(problems, &problem)
	}

	return problems, rows.Err()
}

func ScanResults(rows *sql.Rows) ([]*Result, error) {
	results := []*Result{}

	for rows.Next() {
		result := Result{}
		rows.Scan(&result.id, &result.success, &result.message, &result.lastCheckedTest, &result.subproblemID, &result.userID)
		results = append(results, &result)
	}

	return results, rows.Err()
}

func ScanSubproblems(rows *sql.Rows) ([]*Subproblem, error) {
	subproblems := []*Subproblem{}

	for rows.Next() {
		sp := Subproblem{}
		if err := rows.Scan(&sp.id, &sp.position, &sp.description, &sp.language, &sp.optional, &sp.grade); err != nil {
			return nil, err
		}
		subproblems = append(subproblems, &sp)
	}

	return subproblems, rows.Err()
}

func ScanTests(rows *sql.Rows) ([]*Test, error) {
	tests := []*Test{}

	for rows.Next() {
		test := Test{}
		rows.Scan(&test.id, &test.position, &test.input, &test.rightAnswer, &test.subproblemID)
		tests = append(tests, &test)
	}

	return tests, rows.Err()
}

func ScanUsers(rows *sql.Rows) ([]*User, error) {
	users := []*User{}

	for rows.Next() {
		user := User{}
		rows.Scan(&user.id, &user.username, &user.role)
		users = append(users, &user)
	}

	return users, rows.Err()
}
