package models

import "time"

type User struct {
	ID        string
	Fullname  string
	Email     string
	Password  string
	Role      int
	CreatedAt time.Time
	Addresses []string
}
