package util

import (
	"errors"
	"io/ioutil"
)

func MustReadFile(filename string) []byte {
	contents, err := ioutil.ReadFile(filename)
	if err != nil {
		panic(err)
	}
	return contents
}

func WrapError(msg string, err error) error {
	if err == nil {
		return errors.New(msg)
	}
	if msg == "" && err != nil {
		return err
	}
	return errors.New(msg + ": " + err.Error())
}
