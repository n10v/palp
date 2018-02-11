package check

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/bogem/palp/bbpool"
	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/pkg/stdcopy"
)

const (
	Accepted = "Accepted"

	compilationError = "Compilation Error"
	runtimeError     = "Runtime Error"
	timeoutExceeded  = "Timeout Exceeded"
	wrongAnswer      = "Wrong Answer"
)

type CheckError struct {
	errType string
	msg     string
}

func newCheckError(errType, msg string) CheckError {
	return CheckError{errType, msg}
}

func (ce CheckError) Type() string {
	return ce.errType
}

func (ce CheckError) Message() string {
	if ce.msg == "" {
		return ce.Type()
	}
	return ce.msg
}

func (ce CheckError) Error() string {
	return ce.Type()
}

func IsCheckError(err error) bool {
	_, ok := err.(CheckError)
	return ok
}

func isDeadlineError(err error) bool {
	return err == context.DeadlineExceeded
}

// solutionDir must be absolute path.
func (c *Checker) CheckProgramSubproblem(ctx context.Context, language string, tests []*model.Test, solutionDir string) (success bool, lastCheckedTest int, err error) {
	l := c.language(language)

	if l.compiled {
		timeoutCtx, _ := context.WithTimeout(ctx, 20*time.Second)
		err := c.compileSolution(timeoutCtx, l.dockerImageName, solutionDir)
		if isDeadlineError(timeoutCtx.Err()) {
			err = newCheckError(timeoutExceeded, "")
		}
		if err != nil {
			return false, 0, err
		}
	}

	for i, test := range tests {
		i = i + 1

		timeoutCtx, _ := context.WithTimeout(ctx, 60*time.Second)
		err := c.testSolution(timeoutCtx, l.dockerImageName, solutionDir, test)
		if isDeadlineError(timeoutCtx.Err()) {
			err = newCheckError(timeoutExceeded, "")
		}
		if err != nil {
			return false, i, err
		}
	}

	return true, len(tests), nil
}

func (c *Checker) compileSolution(ctx context.Context, dockerImageName, solutionDir string) error {
	containerID, err := c.createContainer(ctx, []string{"/bin/bash", "-c", "source /palp-compile"}, dockerImageName, solutionDir)
	if err != nil {
		return util.WrapError("can't create compile container", err)
	}
	// defer c.removeContainer(containerID)

	if err = c.runContainer(ctx, containerID); err != nil {
		return util.WrapError("can't run container", err)
	}

	_, err = c.getContainerOutput(ctx, containerID)
	if err != nil {
		return newCheckError(compilationError, err.Error())
	}

	return nil
}

func (c *Checker) testSolution(ctx context.Context, dockerImageName, solutionDir string, test *model.Test) error {
	containerID, err := c.createContainer(ctx, []string{"/bin/bash", "-c", "source /palp-run"}, dockerImageName, solutionDir)
	if err != nil {
		return util.WrapError("can't create container", err)
	}
	// defer c.removeContainer(containerID)

	input := sanitize(test.Input())
	if input != "" {
		input += "\n"

		if err := c.writeToContainer(ctx, containerID, []byte(input)); err != nil {
			return util.WrapError("can't write to container", err)
		}
	}

	if err := c.runContainer(ctx, containerID); err != nil {
		return util.WrapError("can't run container", err)
	}

	answer, err := c.getContainerOutput(ctx, containerID)
	if err != nil {
		return newCheckError(runtimeError, err.Error())
	}

	answer = sanitize(answer)
	rightAnswer := sanitize(test.RightAnswer())

	if answer != rightAnswer {
		return newCheckError(wrongAnswer, "")
	}

	return nil
}

func sanitize(s string) string {
	s = strings.TrimSpace(s)

	// clear deletes '\r' from string.
	clear := func(r rune) rune {
		if r == '\r' {
			return -1
		}
		return r
	}

	return strings.Map(clear, s)
}

func (c *Checker) createContainer(ctx context.Context, cmd []string, dockerImageName, solutionDir string) (containerID string, err error) {
	config := &container.Config{
		Image:       dockerImageName,
		WorkingDir:  "/palp",
		Cmd:         cmd,
		AttachStdin: true,
		OpenStdin:   true,
	}
	hostConfig := &container.HostConfig{
		Binds: []string{solutionDir + ":/palp"},
	}

	resp, err := c.dockerClient.ContainerCreate(ctx, config, hostConfig, nil, "")
	return resp.ID, err
}

func (c *Checker) writeToContainer(ctx context.Context, container string, data []byte) error {
	resp, err := c.dockerClient.ContainerAttach(ctx, container, types.ContainerAttachOptions{Stream: true, Stdin: true})
	if err != nil {
		return util.WrapError("can't attach to container", err)
	}
	defer resp.CloseWrite()

	_, err = resp.Conn.Write(data)
	if err != nil {
		return err
	}
	return nil
}

func (c *Checker) runContainer(ctx context.Context, containerID string) error {
	var resultC <-chan container.ContainerWaitOKBody
	var errC <-chan error
	go func() {
		resultC, errC = c.dockerClient.ContainerWait(ctx, containerID, container.WaitConditionNextExit)
	}()

	if err := c.dockerClient.ContainerStart(ctx, containerID, types.ContainerStartOptions{}); err != nil {
		return util.WrapError("can't start container", err)
	}

	for {
		select {
		case <-resultC:
			return nil
		case err := <-errC:
			return err
		case <-ctx.Done():
			return ctx.Err()
		}
	}

	return nil
}

func (c *Checker) getContainerOutput(ctx context.Context, containerID string) (output string, err error) {
	out, err := c.dockerClient.ContainerLogs(ctx, containerID, types.ContainerLogsOptions{ShowStdout: true, ShowStderr: true})
	if err != nil {
		return "", util.WrapError("can't get container logs", err)
	}

	stdout := bbpool.Get()
	defer bbpool.Put(stdout)

	stderr := bbpool.Get()
	defer bbpool.Put(stderr)

	stdcopy.StdCopy(stdout, stderr, out)
	if stderr.Len() > 0 {
		return "", errors.New(stderr.String())
	}

	return strings.TrimSpace(stdout.String()), nil
}

func (c *Checker) removeContainer(containerID string) error {
	options := types.ContainerRemoveOptions{Force: true}
	return c.dockerClient.ContainerRemove(context.Background(), containerID, options)
}
