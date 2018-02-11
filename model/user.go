package model

type User struct {
	id       UserID
	username string
	role     Role
}

func (u *User) ID() UserID {
	return u.id
}

func (u *User) Username() string {
	return u.username
}

func (u *User) Role() Role {
	return u.role
}

type Role byte

const (
	StudentRole = Role(iota)
	TeacherRole
	AdminRole
)

func (r Role) String() string {
	switch r {
	case StudentRole:
		return "Student"
	case TeacherRole:
		return "Teacher"
	case AdminRole:
		return "Admin"
	}
	return ""
}

// Teachers and higher can create problems.
func (r Role) CanCreateProblems() bool {
	return r >= 1
}
