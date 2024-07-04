package models

type Message struct {
	ID      int64
	Message string
}

type Messages struct {
	Messages []Message
}
