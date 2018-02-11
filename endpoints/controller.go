package endpoints

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/bogem/palp/auth"
	"github.com/bogem/palp/check"
	"github.com/bogem/palp/model"
	"github.com/bogem/palp/util"
	"github.com/sirupsen/logrus"
)

type Endpoint interface {
	ServeHTTP(w http.ResponseWriter, r *http.Request) error
}

type Controller struct {
	logger *logrus.Logger

	authorizer auth.Authorizer

	db       *sql.DB
	registry model.Registry

	checker *check.Checker
}

func NewController(
	logger *logrus.Logger,
	au auth.Authorizer,
	db *sql.DB,
	reg model.Registry,
	checker *check.Checker) *Controller {

	return &Controller{
		logger:     logger,
		authorizer: au,
		db:         db,
		registry:   reg,
		checker:    checker,
	}
}

func (c *Controller) Logger() *logrus.Logger {
	return c.logger
}

func (c *Controller) Authorizer() auth.Authorizer {
	return c.authorizer
}

func (c *Controller) DB() *sql.DB {
	return c.db
}

func (c *Controller) Registry() model.Registry {
	return c.registry
}

func (c *Controller) Checker() *check.Checker {
	return c.checker
}

func (c *Controller) GetUser(r *http.Request) (*model.User, error) {
	userID, err := c.Authorizer().GetUserID(r)
	if err != nil {
		return nil, err
	}
	return c.Registry().GetUser(userID)
}

func (c *Controller) CanUserEdit(problemID model.ProblemID, r *http.Request) (bool, error) {
	userID, err := c.Authorizer().GetUserID(r)
	if err != nil {
		return false, util.WrapError("can't get userID from request", err)
	}

	canEdit, err := c.Registry().HasEditor(problemID, userID)
	if err != nil {
		return false, util.WrapError("can't figure out if user can edit problem", err)
	}

	return canEdit, nil
}

func (c *Controller) DoesUserParticipate(ctx context.Context, problemID model.ProblemID, r *http.Request) (bool, error) {
	userID, err := c.Authorizer().GetUserID(r)
	if err != nil {
		return false, util.WrapError("can't get userID from request", err)
	}

	doesParticipate, err := c.Registry().HasParticipant(ctx, problemID, userID)
	if err != nil {
		return false, util.WrapError("can't figure out if user participates in problem", err)
	}

	return doesParticipate, nil
}
