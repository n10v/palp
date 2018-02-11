package check

import (
	"sync"

	"github.com/bogem/palp/util"
	"github.com/docker/docker/client"
)

type language struct {
	compiled         bool
	dockerImageName  string
	solutionFileName string
}

type Checker struct {
	dockerClient *client.Client

	sync.Mutex
	languages map[string]language
}

func NewChecker() (*Checker, error) {
	client, err := client.NewEnvClient()
	if err != nil {
		return nil, util.WrapError("can't create client", err)
	}

	checker := &Checker{
		dockerClient: client,
		languages: map[string]language{
			"java": language{
				compiled:         true,
				dockerImageName:  "java-palp",
				solutionFileName: "Main.java",
			},
		},
	}

	return checker, nil
}

func (c *Checker) language(language string) language {
	c.Lock()
	defer c.Unlock()
	return c.languages[language]
}

func (c *Checker) SolutionFileName(language string) string {
	return c.language(language).solutionFileName
}
