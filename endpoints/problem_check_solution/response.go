package problem_check_solution

type response struct {
	LastCheckedTest int    `json:"lastCheckedTest,omitempty"`
	Message         string `json:"message"`
	Status          string `json:"status"`
}
