package is_logged_in

import (
	"net/http"

	"github.com/bogem/palp/endpoints"
)

type IsLoggedInEndpoint struct {
	*endpoints.Controller
}

func NewIsLoggedInEndpoint(c *endpoints.Controller) *IsLoggedInEndpoint {
	return &IsLoggedInEndpoint{c}
}

func (e *IsLoggedInEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "GET" {
		endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	hasValidToken := e.Authorizer().HasValidToken(r)
	return endpoints.WriteJSON(w, response{hasValidToken})
}
