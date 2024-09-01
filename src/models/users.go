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

type LoginRequest struct {
	Email    string
	Password string
}

type LoginResponse struct {
	Token string
}

type LogoutRequest struct {
	Token string
}

type LogoutResponse struct {
	Success bool
}

type GetAllUsersRequest struct{}

type GetAllUsersResponse struct {
	Users []User
}
