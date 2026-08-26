import { useEffect, useRef, useState } from "react";
import "./LocationTargeting.css";

function LocationTargeting() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [peopleType, setPeopleType] = useState("living");
  const [radius, setRadius] = useState("10");

  const requestId = useRef(0);

  useEffect(() => {
    const value = query.trim();

    if (value.length < 2) {
      setResults([]);
      setError("");
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      const currentRequest = ++requestId.current;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://localhost:8787/api/locations/search?q=${encodeURIComponent(value)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Location search failed");
        }

        if (currentRequest === requestId.current) {
          setResults(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (currentRequest === requestId.current) {
          setResults([]);
          setError(
            "Location search connect కాలేదు. Backend server running ఉందో check చేయండి."
          );
        }
      } finally {
        if (currentRequest === requestId.current) {
          setLoading(false);
        }
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const addLocation = (location) => {
    const alreadySelected = selectedLocations.some(
      (item) => item.id === location.id
    );

    if (alreadySelected) return;

    setSelectedLocations((previous) => [...previous, location]);
    setResults([]);
    setQuery("");
    setError("");
  };

  const removeLocation = (id) => {
    setSelectedLocations((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  const getLocationSubtitle = (location) => {
    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    }

    return location.displayName || "Location";
  };

  return (
    <div className="location-targeting">

      <div className="location-heading">
        <div>
          <span className="location-eyebrow">
            📍 LOCATION TARGETING
          </span>

          <h2>Where do you want to reach people?</h2>

          <p>
            Choose the real locations where your ad should appear.
          </p>
        </div>

        <div className="location-icon">
          📍
        </div>
      </div>

      <div className="location-search-section">

        <div className="location-search-label">
          <label htmlFor="location-search">
            📍 Search locations
          </label>

          <span>
            Automatic suggestions
          </span>
        </div>

        <div className="location-search-box">

          <span className="search-icon">
            🔎
          </span>

          <input
            id="location-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type a city, town, area or location"
            autoComplete="off"
          />

          {loading && (
            <span className="location-loading">
              <span className="loading-dot"></span>
              Searching
            </span>
          )}

          {query && !loading && (
            <button
              type="button"
              className="clear-search"
              onClick={() => {
                setQuery("");
                setResults([]);
                setError("");
              }}
              aria-label="Clear location search"
            >
              ✕
            </button>
          )}

        </div>

        {query.trim().length > 0 &&
          query.trim().length < 2 && (
            <div className="location-hint">
              Type at least 2 characters to see locations.
            </div>
          )}

        {error && (
          <div className="location-error">
            ⚠️ {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="location-results">

            <div className="results-header">
              <span>LOCATION SUGGESTIONS</span>
              <span>{results.length} found</span>
            </div>

            {results.map((location) => (
              <button
                type="button"
                className="location-result"
                key={location.id}
                onClick={() => addLocation(location)}
              >
                <span className="result-pin">
                  📍
                </span>

                <span className="result-content">
                  <strong>
                    {location.name}
                  </strong>

                  <small>
                    {getLocationSubtitle(location)}
                  </small>
                </span>

                <span className="result-add">
                  +
                </span>
              </button>
            ))}

          </div>
        )}

        {query.trim().length >= 2 &&
          !loading &&
          !error &&
          results.length === 0 && (
            <div className="location-empty">
              <span>📍</span>
              <strong>No matching locations found</strong>
              <small>
                Try a city, town or nearby area.
              </small>
            </div>
          )}

      </div>

      {selectedLocations.length > 0 && (
        <div className="selected-section">

          <div className="section-title-row">
            <div className="section-title">
              📍 Selected locations
            </div>

            <span className="selected-count">
              {selectedLocations.length} selected
            </span>
          </div>

          <div className="selected-location-list">

            {selectedLocations.map((location) => (
              <div
                className="selected-location"
                key={location.id}
              >
                <div className="selected-location-icon">
                  📍
                </div>

                <div className="selected-location-info">
                  <strong>
                    {location.name}
                  </strong>

                  <small>
                    {getLocationSubtitle(location)}
                  </small>
                </div>

                <button
                  type="button"
                  className="remove-location"
                  onClick={() => removeLocation(location.id)}
                  aria-label={`Remove ${location.name}`}
                >
                  ✕
                </button>
              </div>
            ))}

          </div>

        </div>
      )}

      <div className="people-section">

        <div className="section-title">
          👥 People to target
        </div>

        <label
          className={`radio-option ${
            peopleType === "living" ? "active" : ""
          }`}
        >
          <input
            type="radio"
            name="peopleType"
            value="living"
            checked={peopleType === "living"}
            onChange={(event) =>
              setPeopleType(event.target.value)
            }
          />

          <span className="radio-custom"></span>

          <span>
            <strong>People living in this location</strong>
            <small>Recommended</small>
          </span>
        </label>

        <label
          className={`radio-option ${
            peopleType === "recent" ? "active" : ""
          }`}
        >
          <input
            type="radio"
            name="peopleType"
            value="recent"
            checked={peopleType === "recent"}
            onChange={(event) =>
              setPeopleType(event.target.value)
            }
          />

          <span className="radio-custom"></span>

          <span>
            <strong>People recently in this location</strong>
          </span>
        </label>

        <label
          className={`radio-option ${
            peopleType === "traveling" ? "active" : ""
          }`}
        >
          <input
            type="radio"
            name="peopleType"
            value="traveling"
            checked={peopleType === "traveling"}
            onChange={(event) =>
              setPeopleType(event.target.value)
            }
          />

          <span className="radio-custom"></span>

          <span>
            <strong>People traveling in this location</strong>
          </span>
        </label>

      </div>

      <div className="radius-section">

        <div className="radius-info">
          <div className="radius-icon">
            🎯
          </div>

          <div>
            <strong>Target radius</strong>

            <small>
              Reach people around the selected locations
            </small>
          </div>
        </div>

        <select
          value={radius}
          onChange={(event) =>
            setRadius(event.target.value)
          }
        >
          <option value="1">1 km</option>
          <option value="2">2 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="15">15 km</option>
          <option value="20">20 km</option>
          <option value="25">25 km</option>
          <option value="50">50 km</option>
        </select>

      </div>

      {selectedLocations.length > 0 && (
        <div className="targeting-summary">

          <div className="summary-icon">
            ✓
          </div>

          <div>
            <strong>
              Audience area ready
            </strong>

            <span>
              {selectedLocations.length} location
              {selectedLocations.length > 1 ? "s" : ""} ·{" "}
              {radius} km radius
            </span>
          </div>

        </div>
      )}

      <div className="location-attribution">
        Location data © OpenStreetMap contributors
      </div>

    </div>
  );
}

export default LocationTargeting;
