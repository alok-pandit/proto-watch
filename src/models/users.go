package models

import "time"

type User struct {
	ID        string
	Fullname  string
	Email     string
	Password  string
	Role      int
	CreatedAt time.Time
	Addresses []Addresses
	Children  ChildrenList
}

type Addresses struct {
	Address string
}

type ChildrenList struct {
	Children []string
}
