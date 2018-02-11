package endpoints

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"github.com/bogem/palp/model"
)

// GetProblemID returns problemID from path.
// For example: getProblemID("/problem/solve/1/", "/problem/solve") => (1, nil).
func GetProblemID(path, prefix string) (model.ProblemID, error) {
	id, err := strconv.Atoi(strings.Trim(path[len(prefix):], "/"))
	return model.ProblemID(id), err
}

type EndpointError struct {
	Error string `json:"error"`
}

func WriteJSON(w http.ResponseWriter, data interface{}) error {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	enc := json.NewEncoder(w)
	enc.SetEscapeHTML(false)
	return enc.Encode(data)
}

func WriteError(w http.ResponseWriter, code int, msg string) error {
	w.WriteHeader(code)
	return WriteJSON(w, EndpointError{msg})
}

func WriteStatus(w http.ResponseWriter, code int) error {
	var msg string
	switch code {
	case http.StatusForbidden:
		msg = "Access Forbidden"
	default:
		msg = http.StatusText(code)
	}
	return WriteError(w, code, msg)
}
