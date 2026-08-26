const http = require("http");

const PORT = process.env.PORT || 8787;

let lastSearchTime = 0;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // --------------------------------------------------
  // META OAUTH CALLBACK
  // --------------------------------------------------

  if (req.url.startsWith("/auth/meta/callback")) {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");
    const errorDescription =
      url.searchParams.get("error_description");

    res.setHeader(
      "Content-Type",
      "text/html; charset=utf-8"
    );

    if (error) {
      console.error("❌ Meta OAuth error:", error);
      console.error(
        "Description:",
        errorDescription || "Unknown error"
      );

      res.writeHead(400);

      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Meta Login Failed</title>
          </head>
          <body>
            <h2>❌ Meta Login Failed</h2>
            <p>${error}</p>
            <p>${errorDescription || ""}</p>
          </body>
        </html>
      `);

      return;
    }

    if (!code) {
      console.log("⚠️ Meta callback reached without code");

      res.writeHead(400);

      res.end(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Meta Callback</title>
          </head>
          <body>
            <h2>⚠️ Meta Callback Reached</h2>
            <p>No authorization code was received.</p>
          </body>
        </html>
      `);

      return;
    }

    console.log("✅ Meta authorization code received");
    console.log("Code received:", code.substring(0, 12) + "...");

    res.writeHead(200);

    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, 
initial-scale=1.0" />
          <title>ShopBoost AI - Meta Connected</title>

          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #050505;
              color: white;
              font-family: Arial, sans-serif;
            }

            .card {
              width: min(90%, 520px);
              padding: 40px;
              border: 1px solid rgba(255,255,255,.15);
              border-radius: 24px;
              background: #111;
              text-align: center;
              box-shadow: 0 20px 60px rgba(0,0,0,.5);
            }

            h1 {
              margin-bottom: 12px;
            }

            p {
              color: #aaa;
              line-height: 1.6;
            }

            .success {
              font-size: 52px;
            }
          </style>
        </head>

        <body>
          <div class="card">
            <div class="success">✅</div>

            <h1>Meta Connected</h1>

            <p>
              ShopBoost AI successfully received the
              Meta authorization callback.
            </p>

            <p>
              Authorization code received successfully.
            </p>
          </div>
        </body>
      </html>
    `);

    return;
  }

  // --------------------------------------------------
  // LOCATION SEARCH
  // --------------------------------------------------

  if (req.url.startsWith("/api/locations/search")) {
    const url = new URL(
      req.url,
      `http://localhost:${PORT}`
    );

    const query = url.searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      res.writeHead(400, {
        "Content-Type": "application/json"
      });

      res.end(
        JSON.stringify({
          error: "Search query is required"
        })
      );

      return;
    }

    const now = Date.now();

    if (now - lastSearchTime < 1100) {
      res.writeHead(429, {
        "Content-Type": "application/json"
      });

      res.end(
        JSON.stringify({
          error:
            "Please wait a moment before searching again."
        })
      );

      return;
    }

    lastSearchTime = now;

    try {
      const apiUrl =
        "https://nominatim.openstreetmap.org/search?" +
        new URLSearchParams({
          q: query,
          format: "jsonv2",
          addressdetails: "1",
          limit: "8",
          countrycodes: "in"
        });

      const response = await fetch(apiUrl, {
        headers: {
          "User-Agent":
            "ShopBoost-AI/1.0 location-search"
        }
      });

      if (!response.ok) {
        throw new Error(
          `Location API returned ${response.status}`
        );
      }

      const data = await response.json();

      const results = data.map((place) => ({
        id: `${place.osm_type}-${place.osm_id}`,

        name:
          place.name ||
          place.address?.city ||
          place.address?.town ||
          place.address?.village ||
          place.display_name.split(",")[0],

        displayName: place.display_name,

        latitude: Number(place.lat),

        longitude: Number(place.lon),

        type: place.type,

        city:
          place.address?.city ||
          place.address?.town ||
          place.address?.village ||
          place.address?.municipality ||
          "",

        state:
          place.address?.state || "",

        country:
          place.address?.country || "India"
      }));

      res.writeHead(200, {
        "Content-Type": "application/json"
      });

      res.end(JSON.stringify(results));

    } catch (error) {
      console.error(error);

      res.writeHead(500, {
        "Content-Type": "application/json"
      });

      res.end(
        JSON.stringify({
          error: "Unable to search locations"
        })
      );
    }

    return;
  }

  // --------------------------------------------------
  // NOT FOUND
  // --------------------------------------------------

  res.writeHead(404, {
    "Content-Type": "text/plain"
  });

  res.end("Not Found");
});

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `📍 Location API running at http://localhost:${PORT}`
  );

  console.log(
    `🔐 Meta OAuth callback: http://localhost:${PORT}/auth/meta/callback`
  );
});
