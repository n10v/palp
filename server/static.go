package server

import (
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// staticHandler is a handler for static files.
// It supports "If-Modified-Since" HTTP 1.1 caching in accordance with RFC2616.
func (s *server) staticHandler(w http.ResponseWriter, r *http.Request) {
	filename := r.URL.Path[1:]

	// Get actual modify time of file with filename.
	fileinfo, err := os.Stat(filename)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	actualModTime := fileinfo.ModTime()

	// Check if file is not changed from last response.
	//
	// RFC 2616 Section 14.25: "Note: When handling an If-Modified-Since header field,
	// some servers will use an exact date comparison function, rather than a
	// less-than function, for deciding whether to send a 304 (Not
	// Modified) response. To get best results when sending an If-
	// Modified-Since header field for cache validation, clients are
	// advised to use the exact date string received in a previous Last-
	// Modified header field whenever possible."
	if !actualModTime.IsZero() {
		timeLayout := "2006-01-02 15:04:05 -0700 MST"
		ims, err := time.Parse(timeLayout, r.Header.Get("If-Modified-Since"))
		if err == nil && ims.Equal(actualModTime) {
			// RFC 2616 Section 14.25: "c) If the variant has not been modified
			// since a valid If-Modified-Since date, the server SHOULD return a 304 (Not
			// Modified) response."
			//
			// RFC 2616 Section 14.25: "if the requested variant has not been modified
			// since the time specified in this field, an entity will not be
			// returned from the server; instead, a 304 (not modified) response will
			// be returned without any message-body."
			w.WriteHeader(http.StatusNotModified)
			return
		}
	}

	contentType := detectContentType(filepath.Ext(filename))
	w.Header().Set("Content-Type", contentType+"; charset=utf-8")

	acceptedEncodings := r.Header.Get("Accept-Encoding")
	if len(acceptedEncodings) > 0 {
		encodedFilename := filename + ".gz"
		if strings.Contains(acceptedEncodings, "gzip") && fileExists(filename+".gz") {
			w.Header().Set("Content-Encoding", "gzip")
			filename = encodedFilename
		}
	}

	// Read file as it's changed since "If-Modified-Since" date.
	//
	// RFC 2616 Section 14.25: "b) If the variant has been modified since the If-Modified-Since
	// date, the response is exactly the same as for a normal GET."
	content, err := ioutil.ReadFile(filename)
	if err != nil {
		http.NotFound(w, r)
		return
	}

	w.Header().Set("X-Content-Type-Options", "nosniff")
	if !actualModTime.IsZero() {
		w.Header().Set("Last-Modified", actualModTime.String())
	}

	// Write content.
	w.Write(content)
}

func fileExists(filename string) bool {
	_, err := os.Stat(filename)
	if err != nil {
		return false
	}
	return true
}

func detectContentType(ext string) string {
	switch ext {
	case ".css":
		return "text/css"
	case ".js":
		return "application/javascript"
	}
	return "text/plain"
}
