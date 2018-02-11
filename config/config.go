package config

import (
	"io/ioutil"

	"github.com/BurntSushi/toml"
)

type Config struct {
	DatabaseDSN string `toml:"databaseDSN"`
	HostAddress string `toml:"hostAddress"`
}

func ParseConfig(path string) (Config, error) {
	conf := Config{}

	content, err := ioutil.ReadFile(path)
	if err != nil {
		return conf, err
	}

	err = toml.Unmarshal(content, &conf)
	return conf, err
}
