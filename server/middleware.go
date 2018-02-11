package server

import (
	"fmt"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/bogem/palp/endpoints"
)

func (s *server) toH(endpoint endpoints.Endpoint) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		err := endpoint.ServeHTTP(w, r)
		if err != nil && !strings.Contains(err.Error(), "context canceled") {
			w.WriteHeader(http.StatusInternalServerError)
			s.logger.Errorf("path: %v; err: %v", r.URL.Path, err)
		}
	})
}

func (s *server) checkToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !s.authorizer.HasValidToken(r) {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func accessLogMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		t := time.Now()

		resp := &responseWriter{0, w}
		next.ServeHTTP(resp, r)

		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			ip = "(bogus ip)"
		}
		fTime := t.Format("02/Jan/2006:15:04:05 -0700")
		reqLine := r.Method + " " + r.URL.Path + " " + r.Proto

		var respCode string
		if r.Context().Err() != nil && r.Context().Err().Error() == "context canceled" {
			respCode = "(canceled)"
		} else {
			respCode = strconv.Itoa(resp.Code())
		}

		fmt.Printf("%v - [%v] %q %v\n", ip, fTime, reqLine, respCode)
	})
}

// responseWriter is a modification of http.ResponseWriter with ability to
// get written HTTP status code.
type responseWriter struct {
	code int
	w    http.ResponseWriter
}

func (rw *responseWriter) Header() http.Header {
	return rw.w.Header()
}

func (rw *responseWriter) Write(p []byte) (int, error) {
	return rw.w.Write(p)
}

func (rw *responseWriter) WriteHeader(code int) {
	rw.code = code
	rw.w.WriteHeader(code)
}

func (rw *responseWriter) Code() int {
	if rw.code == 0 {
		return http.StatusOK
	}
	return rw.code
}
