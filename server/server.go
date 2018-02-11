package server

import (
	"database/sql"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/bogem/palp/config"
	"github.com/bogem/palp/endpoints/home"
	"github.com/bogem/palp/endpoints/is_logged_in"
	"github.com/bogem/palp/endpoints/login"
	"github.com/bogem/palp/endpoints/problem_check_solution"
	"github.com/bogem/palp/endpoints/problem_edit"
	"github.com/bogem/palp/endpoints/problem_new"
	"github.com/bogem/palp/endpoints/problem_remove"
	"github.com/bogem/palp/endpoints/problem_save"
	"github.com/bogem/palp/endpoints/problem_solve"

	"github.com/bogem/palp/auth"
	"github.com/bogem/palp/check"
	"github.com/bogem/palp/endpoints"
	"github.com/bogem/palp/model"
	_ "github.com/go-sql-driver/mysql"
	"github.com/sirupsen/logrus"
	prefixed "github.com/x-cray/logrus-prefixed-formatter"
)

type server struct {
	authorizer  auth.Authorizer
	hostAddress string
	c           *endpoints.Controller
	logger      *logrus.Logger
}

func newServer(dsn, hostAddress string) *server {
	s := new(server)
	s.initLogger()
	db := s.initDB(dsn)
	s.initAuthorizer(db)
	s.initController(db)
	s.hostAddress = hostAddress
	return s
}

func (s *server) initLogger() {
	s.logger = &logrus.Logger{
		Out:       os.Stderr,
		Formatter: &prefixed.TextFormatter{FullTimestamp: true},
		Level:     logrus.InfoLevel,
	}
}

func (s *server) initDB(dsn string) *sql.DB {
	// Open MySQL DB.
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		s.logger.Fatal("can't open MySQL DB: ", err)
	}

	// Check the connection to DB.
	if err := db.Ping(); err != nil {
		s.logger.Fatal("can't connect to MySQL DB: ", err)
	}

	return db
}

func (s *server) initAuthorizer(db *sql.DB) {
	s.authorizer = auth.NewAuthorizer(db)
}

func (s *server) initController(db *sql.DB) {
	reg := model.NewRegistry(db)

	checker, err := check.NewChecker()
	if err != nil {
		s.logger.Fatal(err)
	}

	s.c = endpoints.NewController(s.logger, s.authorizer, db, reg, checker)
}

func (s *server) serve() {
	mux := s.initMux()
	s.logger.Println("Server is started on " + s.hostAddress)
	s.logger.Fatal(http.ListenAndServe(s.hostAddress, accessLogMiddleware(mux)))
}

func (s *server) initMux() *http.ServeMux {
	mux := http.NewServeMux()

	mux.Handle("/endpoints/login/", s.toH(login.NewLoginEndpoint(s.c)))
	mux.Handle("/endpoints/is_logged_in/", s.toH(is_logged_in.NewIsLoggedInEndpoint(s.c)))

	mux.Handle("/endpoints/home/", s.checkToken(s.toH(home.NewHomeEndpoint(s.c))))

	mux.Handle("/endpoints/problem/new/", s.checkToken(s.toH(problem_new.NewProblemNewEndpoint(s.c))))
	mux.Handle("/endpoints/problem/edit/", s.checkToken(s.toH(problem_edit.NewProblemEditEndpoint(s.c))))
	mux.Handle("/endpoints/problem/remove/", s.checkToken(s.toH(problem_remove.NewProblemRemoveEndpoint(s.c))))
	mux.Handle("/endpoints/problem/save/", s.checkToken(s.toH(problem_save.NewProblemSaveEndpoint(s.c))))
	mux.Handle("/endpoints/problem/solve/", s.checkToken(s.toH(problem_solve.NewProblemSolveEndpoint(s.c))))
	mux.Handle("/endpoints/problem/check_solution/", s.checkToken(s.toH(problem_check_solution.NewProblemCheckSolutionEndpoint(s.c))))

	mux.HandleFunc("/static/", s.staticHandler)
	mux.HandleFunc("/", s.handleRoot)

	return mux
}

func (s *server) handleRoot(w http.ResponseWriter, r *http.Request) {
	content, err := ioutil.ReadFile("static/index.html")
	if err != nil {
		s.logger.Fatal("can't read index.html file")
	}
	w.Write(content)
}

func Start() {
	conf, err := config.ParseConfig("config.toml")
	if err != nil {
		log.Fatal("can't parse config: ", err)
	}
	if conf.HostAddress == "" {
		log.Fatal("hostAddress can't be empty")
	}
	if conf.DatabaseDSN == "" {
		log.Fatal("databaseDSN can't be empty")
	}

	serv := newServer(conf.DatabaseDSN, conf.HostAddress)
	serv.serve()
}
