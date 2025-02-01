// layouts/api/flickr-photos.go
package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/gohugoio/hugo/cache/filecache"
)

func handler(w http.ResponseWriter, r *http.Request) {
	albumID := r.URL.Query().Get("album_id")
	userID := r.URL.Query().Get("user_id")
	page := r.URL.Query().Get("page")
	apiKey := getAPIKey() // Implement this to get your Flickr API key

	// Create cache key
	cacheKey := fmt.Sprintf("flickr_album_%s_page_%s", albumID, page)

	// Try to get from cache first
	cache := filecache.New("flickr", time.Hour)
	if cached, err := cache.Get(cacheKey); err == nil {
		w.Header().Set("Content-Type", "application/json")
		w.Write(cached)
		return
	}

	// If not in cache, fetch from Flickr API
	url := fmt.Sprintf(
		"https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=%s&photoset_id=%s&user_id=%s&page=%s&format=json&nojsoncallback=1",
		apiKey, albumID, userID, page,
	)

	resp, err := http.Get(url)
	if err != nil {
		http.Error(w, "Failed to fetch photos", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response", http.StatusInternalServerError)
		return
	}

	// Cache the response
	cache.Set(cacheKey, body)

	// Return response
	w.Header().Set("Content-Type", "application/json")
	w.Write(body)
}