package model

import "encoding/json"

type Classroom struct {
	id   ClassroomID
	name string
}

func (c *Classroom) ID() ClassroomID {
	return c.id
}

func (c *Classroom) Name() string {
	return c.name
}

func (c *Classroom) MarshalJSON() ([]byte, error) {
	v := struct {
		ID   ClassroomID `json:"id"`
		Name string      `json:"name"`
	}{
		ID:   c.ID(),
		Name: c.Name(),
	}

	return json.Marshal(v)
}
