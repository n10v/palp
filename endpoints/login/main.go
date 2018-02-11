package login

import (
	"net/http"

	"github.com/bogem/palp/auth"
	"github.com/bogem/palp/endpoints"
)

type LoginEndpoint struct {
	*endpoints.Controller
}

func NewLoginEndpoint(c *endpoints.Controller) *LoginEndpoint {
	return &LoginEndpoint{c}
}

func (e *LoginEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "POST" {
		return endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	token, err := e.Authorizer().GenerateToken(r)
	if err != nil {
		if auth.IsLoginError(err) {
			return endpoints.WriteError(w, http.StatusBadRequest, err.Error())
		} else {
			return err
		}
	}

	return endpoints.WriteJSON(w, response{Token: token})
}
