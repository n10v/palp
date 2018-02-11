package problem_check_solution

import (
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/bogem/palp/check"
	"github.com/bogem/palp/endpoints"
	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
)

type ProblemCheckSolutionEndpoint struct {
	*endpoints.Controller
}

func NewProblemCheckSolutionEndpoint(c *endpoints.Controller) *ProblemCheckSolutionEndpoint {
	return &ProblemCheckSolutionEndpoint{c}
}

func (e *ProblemCheckSolutionEndpoint) ServeHTTP(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "POST" {
		return endpoints.WriteStatus(w, http.StatusMethodNotAllowed)
	}

	rCtx := r.Context()

	id, err := strconv.Atoi(r.FormValue("problemID"))
	if err != nil {
		return endpoints.WriteError(w, http.StatusNotFound, "problem not found")
	}
	problemID := model.ProblemID(id)

	userID, err := e.Authorizer().GetUserID(r)
	if err != nil {
		return util.WrapError("can't get userID from request", err)
	}

	canSolve, err := e.Registry().HasParticipant(rCtx, problemID, userID)
	if err != nil {
		return util.WrapError("can't figure out if user participates in problem", err)
	}
	if !canSolve {
		return endpoints.WriteStatus(w, http.StatusForbidden)
	}

	subproblemID := model.SubproblemID(r.FormValue("subproblemID"))

	subproblemLanguage, err := getSubproblemLanguage(e.DB(), subproblemID)
	if err != nil {
		return util.WrapError("can't get subproblem", err)
	}

	wd, err := os.Getwd()
	if err != nil {
		return util.WrapError("can't get working directory", err)
	}

	solutionMultipartFile, _, err := r.FormFile("solution")
	if err == http.ErrMissingFile {
		return endpoints.WriteError(w, http.StatusBadRequest, "no solution found")
	}
	if err != nil {
		return util.WrapError("can't get solution content", err)
	}
	defer solutionMultipartFile.Close()

	tempDirPath := filepath.Join(wd, "temp")
	if err = createDirIfNotExisting(tempDirPath); err != nil {
		return util.WrapError("can't create temp dir", err)
	}
	solutionDir, err := ioutil.TempDir(tempDirPath, "")
	if err != nil {
		return util.WrapError("can't create solution dir", err)
	}

	path := filepath.Join(solutionDir, e.Checker().SolutionFileName(subproblemLanguage))
	if err = createFile(solutionMultipartFile, path); err != nil {
		return err
	}

	tests, err := e.Registry().GetTests(subproblemID)
	if err != nil {
		return util.WrapError("can't get tests", err)
	}

	var message, status string
	success, test, err := e.Checker().CheckProgramSubproblem(rCtx, subproblemLanguage, tests, solutionDir)
	if err == nil {
		message = "Accepted"
		status = "SUCCESS"
	} else {
		status = "FAIL"
		if check.IsCheckError(err) {
			message = err.Error()
		} else {
			return util.WrapError("error while checking subproblem", err)
		}
	}

	result := model.NewResult(success, message, test, subproblemID, userID)
	if err := setResult(e.DB(), result); err != nil {
		return util.WrapError("can't set result", err)
	}

	resp := response{
		LastCheckedTest: test,
		Message:         message,
		Status:          status,
	}

	return endpoints.WriteJSON(w, resp)
}

func createFile(content io.Reader, path string) error {
	file, err := os.Create(path)
	if err != nil {
		return util.WrapError("can't create file", err)
	}
	defer file.Close()

	if _, err := io.Copy(file, content); err != nil {
		return util.WrapError("can't copy content to file", err)
	}

	return nil
}

func createDirIfNotExisting(path string) error {
	_, err := os.Stat(path)
	if os.IsNotExist(err) {
		return os.Mkdir(path, 0700)
	}
	return err
}
