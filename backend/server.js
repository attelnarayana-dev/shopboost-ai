const http = require("http");
const { createClient } = require("@supabase/supabase-js");

const PORT = process.env.PORT || 8787;
const HOST = "0.0.0.0";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const META_REDIRECT_URI =
  process.env.META_REDIRECT_URI ||
  "https://shopboost-ai-backend.onrender.com/auth/meta/callback";

const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY
      )
    : null;

let lastSearchTime = 0;

async function exchangeMetaCode(code) {
  const tokenUrl =
    "https://graph.facebook.com/v25.0/oauth/access_token?" +
    new URLSearchParams({
      client_id: META_APP_ID,
      client_secret: META_APP_SECRET,
      redirect_uri: META_REDIRECT_URI,
      code
    });

  const response = await fetch(tokenUrl);

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error("Meta token exchange failed:", data);

    throw new Error(
      data.error?.message ||
        "Unable to exchange Meta authorization code"
    );
  }

  return data;
}

async function getMetaUser(accessToken) {
  const response = await fetch(
    "https://graph.facebook.com/v25.0/me?fields=id,name",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    console.error("Meta user request failed:", data);

    throw new Error(
      data.error?.message ||
        "Unable to retrieve Meta user"
    );
  }

  return data;
}

async function metaGraphRequest(path, accessToken) {
  const response = await fetch(
    `https://graph.facebook.com/v25.0${path}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok || data.error) {
    throw new Error(
      data.error?.message ||
        "Meta Graph API request failed"
    );
  }

  return data;
}

async function getMetaAssets(connectionId) {
  if (!supabase) {
    throw new Error(
      "Supabase environment variables are missing"
    );
  }

  // Get the customer's stored Meta token
  const { data: connection, error } =
    await supabase
      .from("meta_connections")
      .select(
        "id, customer_id, meta_user_id, access_token"
      )
      .eq("id", connectionId)
      .single();

  if (error || !connection) {
    throw new Error(
      "Meta connection was not found"
    );
  }

  const accessToken =
    connection.access_token;

  // ==========================================
  // BUSINESSES
  // ==========================================

  const businesses =
    await metaGraphRequest(
      `/me/businesses?fields=id,name&limit=100`,
      accessToken
    );

  // ==========================================
  // AD ACCOUNTS
  // ==========================================

  const adAccounts =
    await metaGraphRequest(
      
`/me/adaccounts?fields=id,name,account_status,currency,account_id&limit=100`,
      accessToken
    );

  // ==========================================
  // FACEBOOK PAGES
  // ==========================================

  const pages =
    await metaGraphRequest(
      `/me/accounts?fields=id,name,access_token&limit=100`,
      accessToken
    );

  // ==========================================
  // SAVE BUSINESSES
  // ==========================================

  for (const business of businesses.data || []) {
    const { error } = await supabase
      .from("meta_businesses")
      .upsert(
        {
          meta_connection_id:
            connection.id,
          business_id:
            business.id,
          business_name:
            business.name || null
        },
        {
          onConflict:
            "meta_connection_id,business_id"
        }
      );

    if (error) {
      console.error(
        "Business save error:",
        error
      );
    }
  }

  // ==========================================
  // SAVE AD ACCOUNTS
  // ==========================================

  for (const account of adAccounts.data || []) {
    const { error } = await supabase
      .from("meta_ad_accounts")
      .upsert(
        {
          meta_connection_id:
            connection.id,
          ad_account_id:
            account.id,
          ad_account_name:
            account.name || null
        },
        {
          onConflict:
            "meta_connection_id,ad_account_id"
        }
      );

    if (error) {
      console.error(
        "Ad account save error:",
        error
      );
    }
  }

  // ==========================================
  // SAVE FACEBOOK PAGES
  // ==========================================

  for (const page of pages.data || []) {
    const { error } = await supabase
      .from("meta_pages")
      .upsert(
        {
          meta_connection_id:
            connection.id,
          page_id:
            page.id,
          page_name:
            page.name || null
        },
        {
          onConflict:
            "meta_connection_id,page_id"
        }
      );

    if (error) {
      console.error(
        "Page save error:",
        error
      );
    }
  }

  return {
    businesses:
      businesses.data || [],

    adAccounts:
      adAccounts.data || [],

    pages:
      pages.data || []
  };
}

async function saveMetaConnection({
  metaUser,
  accessToken,
  expiresIn
}) {
  if (!supabase) {
    throw new Error(
      "Supabase environment variables are missing"
    );
  }

  // Check whether this Meta user already has a connection
  const { data: existingConnection, error: findError } =
    await supabase
      .from("meta_connections")
      .select("id, customer_id")
      .eq("meta_user_id", metaUser.id)
      .maybeSingle();

  if (findError) {
    throw findError;
  }

  let customerId;

  if (existingConnection) {
    customerId = existingConnection.customer_id;

    const { error: updateError } = await supabase
      .from("meta_connections")
      .update({
        access_token: accessToken,
        token_expires_at: expiresIn
          ? new Date(
              Date.now() + expiresIn * 1000
            ).toISOString()
          : null,
        updated_at: new Date().toISOString()
      })
      .eq("id", existingConnection.id);

    if (updateError) {
      throw updateError;
    }

    console.log(
      "✅ Existing Meta connection updated"
    );

    return existingConnection.id;
  }

  // Create a ShopBoost customer for the first connection
  const { data: customer, error: customerError } =
    await supabase
      .from("customers")
      .insert({
        name: metaUser.name || "Meta Customer"
      })
      .select("id")
      .single();

  if (customerError) {
    throw customerError;
  }

  customerId = customer.id;

  // Save Meta connection
  const { data: connection, error: connectionError } =
    await supabase
      .from("meta_connections")
      .insert({
        customer_id: customerId,
        meta_user_id: metaUser.id,
        access_token: accessToken,
        token_expires_at: expiresIn
          ? new Date(
              Date.now() + expiresIn * 1000
            ).toISOString()
          : null
      })
      .select("id")
      .single();

  if (connectionError) {
    throw connectionError;
  }

  console.log(
    "✅ New customer + Meta connection saved"
  );

  return connection.id;
}

const server = http.createServer(
  async (req, res) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      "*"
    );

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, OPTIONS"
    );

    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type"
    );

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    // ==========================================
    // META OAUTH CALLBACK
    // ==========================================

    if (
      req.url.startsWith(
        "/auth/meta/callback"
      )
    ) {
      try {
        const url = new URL(
          req.url,
          `http://${req.headers.host}`
        );

        const code =
          url.searchParams.get("code");

        const error =
          url.searchParams.get("error");

        const errorDescription =
          url.searchParams.get(
            "error_description"
          );

        res.setHeader(
          "Content-Type",
          "text/html; charset=utf-8"
        );

        if (error) {
          res.writeHead(400);

          res.end(`
            <h2>❌ Meta Login Failed</h2>
            <p>${error}</p>
            ${
              errorDescription
                ? `<p>${errorDescription}</p>`
                : ""
            }
          `);

          return;
        }

        if (!code) {
          res.writeHead(400);

          res.end(`
            <h2>❌ Meta Callback Error</h2>
            <p>No authorization code was received.</p>
          `);

          return;
        }

        console.log(
          "✅ Meta authorization code received"
        );

        // Exchange authorization code for access token
        const tokenData =
          await exchangeMetaCode(code);

        const accessToken =
          tokenData.access_token;

        const expiresIn =
          tokenData.expires_in;

        if (!accessToken) {
          throw new Error(
            "Meta did not return an access token"
          );
        }

        console.log(
          "✅ Meta access token received"
        );

        // Get Meta user information
        const metaUser =
          await getMetaUser(accessToken);

        console.log(
          "✅ Meta user:",
          metaUser.id,
          metaUser.name
        );

        // Save customer + connection
        const connectionId =
          await saveMetaConnection({
            metaUser,
            accessToken,
            expiresIn
          });

        console.log(
          "✅ Meta connection saved:",
          connectionId
        );

        // Sync Meta business, ad account and Facebook Page assets.
        // Instagram is intentionally not included here.
        try {
          const metaAssets =
            await getMetaAssets(connectionId);

          console.log(
            "✅ Meta assets synced:",
            "Businesses:",
            metaAssets.businesses.length,
            "Ad Accounts:",
            metaAssets.adAccounts.length,
            "Facebook Pages:",
            metaAssets.pages.length
          );
        } catch (assetError) {
          console.error(
            "❌ Meta asset sync failed:",
            assetError
          );
        }

        res.writeHead(200);

        res.end(`
          <!DOCTYPE html>

          <html>
          <head>
            <title>Meta Connected</title>

            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />

            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 60px 20px;
                background: #f5f7fb;
              }

              .card {
                max-width: 450px;
                margin: auto;
                background: white;
                padding: 40px;
                border-radius: 20px;
                box-shadow:
                  0 10px 40px
                  rgba(0,0,0,.1);
              }

              h1 {
                color: #1877f2;
              }
            </style>
          </head>

          <body>

            <div class="card">

              <h1>
                ✅ Meta Connected
              </h1>

              <p>
                Meta account connected
                successfully.
              </p>

              <p>
                Customer connection has been
                saved securely.
              </p>

              <p>
                You can now return to
                ShopBoost AI.
              </p>

            </div>

          </body>
          </html>
        `);

        return;

      } catch (error) {
        console.error(
          "❌ Meta OAuth error:",
          error
        );

        res.writeHead(500);

        res.end(`
          <h2>❌ Meta Connection Failed</h2>
          <p>
            ${error.message}
          </p>
        `);

        return;
      }
    }

    // ==========================================
    // LOCATION SEARCH API
    // ==========================================

    if (
      req.url.startsWith(
        "/api/locations/search"
      )
    ) {
      const url = new URL(
        req.url,
        `http://${req.headers.host}`
      );

      const query =
        url.searchParams.get("q")?.trim();

      if (!query || query.length < 2) {
        res.writeHead(400, {
          "Content-Type":
            "application/json"
        });

        res.end(
          JSON.stringify({
            error:
              "Search query is required"
          })
        );

        return;
      }

      const now = Date.now();

      if (
        now - lastSearchTime <
        1100
      ) {
        res.writeHead(429, {
          "Content-Type":
            "application/json"
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

        const response =
          await fetch(apiUrl, {
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

        const data =
          await response.json();

        const results = data.map(
          (place) => ({
            id: `${place.osm_type}-${place.osm_id}`,

            name:
              place.name ||
              place.address?.city ||
              place.address?.town ||
              place.address?.village ||
              place.display_name.split(
                ","
              )[0],

            displayName:
              place.display_name,

            latitude:
              Number(place.lat),

            longitude:
              Number(place.lon),

            type: place.type,

            city:
              place.address?.city ||
              place.address?.town ||
              place.address?.village ||
              place.address?.municipality ||
              "",

            state:
              place.address?.state ||
              "",

            country:
              place.address?.country ||
              "India"
          })
        );

        res.writeHead(200, {
          "Content-Type":
            "application/json"
        });

        res.end(
          JSON.stringify(results)
        );

      } catch (error) {
        console.error(error);

        res.writeHead(500, {
          "Content-Type":
            "application/json"
        });

        res.end(
          JSON.stringify({
            error:
              "Unable to search locations"
          })
        );
      }

      return;
    }

    // ==========================================
    // HEALTH CHECK
    // ==========================================

    if (req.url === "/") {
      res.writeHead(200, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          status: "ok",
          service:
            "ShopBoost AI Backend",
          metaCallback:
            "/auth/meta/callback",
          supabase:
            Boolean(supabase)
        })
      );

      return;
    }

    // ==========================================
    // 404
    // ==========================================

    res.writeHead(404, {
      "Content-Type":
        "text/plain"
    });

    res.end("Not Found");
  }
);

server.listen(
  PORT,
  HOST,
  () => {
    console.log(
      `📍 ShopBoost AI Backend running on ${HOST}:${PORT}`
    );

    console.log(
      `🔐 Meta OAuth callback: ${META_REDIRECT_URI}`
    );

    console.log(
      `🗄️ Supabase configured: ${Boolean(
        supabase
      )}`
    );
  }
);
