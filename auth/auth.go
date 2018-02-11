package auth

import (
	"database/sql"
	"errors"
	"net/http"

	"github.com/bogem/palp/model"
	"github.com/gorilla/securecookie"
)

var ErrBlankUsername = errors.New("username is blank")
var ErrBlankPassword = errors.New("password is blank")
var ErrIncorrectPassword = errors.New("incorrect password")
var ErrUserNotExist = errors.New("user doesn't exist")

func IsLoginError(err error) bool {
	return err != nil && (err == ErrBlankUsername ||
		err == ErrBlankPassword ||
		err == ErrIncorrectPassword ||
		err == ErrUserNotExist)
}

type Authorizer interface {
	GenerateToken(*http.Request) (string, error)
	DeleteToken(http.ResponseWriter)

	GetUserID(*http.Request) (id model.UserID, err error)
	HasValidToken(*http.Request) bool
}

type authorizer struct {
	db *sql.DB
	sc *securecookie.SecureCookie
}

func NewAuthorizer(db *sql.DB) Authorizer {
	hashKey := securecookie.GenerateRandomKey(32)
	sc := securecookie.New(hashKey, nil)

	return &authorizer{db, sc}
}

func (au *authorizer) GenerateToken(r *http.Request) (token string, err error) {
	username := r.FormValue("username")
	if username == "" {
		return "", ErrBlankUsername
	}

	password := r.FormValue("password")
	if password == "" {
		return "", ErrBlankPassword
	}

	row := au.db.QueryRow("SELECT id,password FROM users WHERE username=?", username)

	var id model.UserID
	var dbPassword string
	err = row.Scan(&id, &dbPassword)
	switch {
	case err == sql.ErrNoRows:
		return "", ErrUserNotExist
	case err != nil:
		return "", err
	}

	if password != dbPassword {
		return "", ErrIncorrectPassword
	}

	return au.sc.Encode("token", id)
}

func (au *authorizer) GetUserID(r *http.Request) (userID model.UserID, err error) {
	cookie, err := r.Cookie("token")
	if err != nil {
		return model.UserID(0), err
	}

	if err = au.sc.Decode("token", cookie.Value, &userID); err != nil {
		return model.UserID(0), err
	}

	return model.UserID(userID), nil
}

func (au *authorizer) HasValidToken(r *http.Request) bool {
	id, err := au.GetUserID(r)
	return model.IsCorrectUserID(id) && err == nil
}

func (au *authorizer) DeleteToken(w http.ResponseWriter) {
	http.SetCookie(w, &http.Cookie{
		Name:       "token",
		Value:      "",
		Path:       "/",
		RawExpires: "Thu, 01 Jan 1970 00:00:01 GMT",
	})
}
