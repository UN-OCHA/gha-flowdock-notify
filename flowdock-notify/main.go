package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
  "strings"
)

const (
	EnvFlowdockToken    = "FLOWDOCK_TOKEN"
	EnvFlowdockMessage  = "FLOWDOCK_MESSAGE"
	EnvFlowdockThread   = "FLOWDOCK_THREAD"
	EnvFlowdockUserName = "FLOWDOCK_USERNAME"
	EnvFlowdockIcon     = "FLOWDOCK_ICON"
	EnvFlowdockTags     = "FLOWDOCK_TAGS"
	EnvGithubActor      = "GITHUB_ACTOR"
)

type Webhook struct {
	Event     string       `json:"event"`
	UserName  string       `json:"external_user_name,omitempty"`
	Content   string       `json:"content,omitempty"`
	Thread    string       `json:"thread_id,omitempty"`
	Tags      []string     `json:"tags,omitempty"`
}

func main() {
	token := os.Getenv(EnvFlowdockToken)
	if token == "" {
		fmt.Fprintln(os.Stderr, "Token is required")
		os.Exit(1)
	}

  endpoint := "https://api.flowdock.com/messages/chat/"
  endpoint += token

	text := os.Getenv(EnvFlowdockMessage)
	if text == "" {
		fmt.Fprintln(os.Stderr, "Message is required")
		os.Exit(1)
	}

  message := ":" + os.Getenv(EnvFlowdockIcon) + ":"
  message += text

	msg := Webhook{
    Event:    "message",
		UserName: os.Getenv(EnvFlowdockUserName),
		Thread:   os.Getenv(EnvFlowdockThread),
    Content:  message,
    Tags:     strings.Split(os.Getenv(EnvFlowdockTags), ","),
	}

	if err := send(endpoint, msg); err != nil {
		fmt.Fprintf(os.Stderr, "Error sending message: %s\n", err)
		os.Exit(2)
	}
}

func envOr(name, def string) string {
	if d, ok := os.LookupEnv(name); ok {
		return d
	}
	return def
}

func send(endpoint string, msg Webhook) error {
	enc, err := json.Marshal(msg)
	if err != nil {
		return err
	}
	b := bytes.NewBuffer(enc)
	res, err := http.Post(endpoint, "application/json", b)
	if err != nil {
		return err
	}

	if res.StatusCode >= 299 {
		return fmt.Errorf("Error on message: %s\n", res.Status)
	}
	fmt.Println(res.Status)
	return nil
}
