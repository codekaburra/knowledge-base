// Local preview server for the knowledge base.
// Usage: go run serve.go   (then open http://localhost:8000)
package main

import (
	"flag"
	"log"
	"net/http"
)

func main() {
	port := flag.String("port", "8000", "port to listen on")
	dir := flag.String("dir", "site", "directory to serve")
	flag.Parse()

	fs := http.FileServer(http.Dir(*dir))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// no-store so edits to notes.json/HTML show up on refresh
		w.Header().Set("Cache-Control", "no-store")
		fs.ServeHTTP(w, r)
	})

	log.Printf("Serving %s/ at http://localhost:%s", *dir, *port)
	log.Fatal(http.ListenAndServe(":"+*port, nil))
}
