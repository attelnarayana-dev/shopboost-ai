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

/* =========================================================
   META GRAPH API
========================================================= */

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
    console.error("Meta Graph API error:", {
      path,
      error: data.error || data
    });

    throw new Error(
      data.error?.message ||
        "Meta Graph API request failed"
    );
  }

  return data;
}

/* =========================================================
   EXCHANGE META AUTHORIZATION CODE
========================================================= */

async function exchangeMetaCode(code) {
  if (!META_APP_ID || !META_APP_SECRET) {
    throw new Error(
      "META_APP_ID or META_APP_SECRET is missing"
    );
  }

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
    console.error(
      "Meta token exchange failed:",
      data
    );

    throw new Error(
      data.error?.message ||
        "Unable to exchange Meta authorization code"
    );
  }

  return data;
}

/* =========================================================
   GET META USER
========================================================= */

async function getMetaUser(accessToken) {
  const data = await metaGraphRequest(
    "/me?fields=id,name",
    accessToken
  );

  return data;
}

/* =========================================================
   SAVE META CONNECTION
========================================================= */

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

  const {
    data: existingConnection,
    error: findError
  } = await supabase
    .from("meta_connections")
    .select("id, customer_id")
    .eq("meta_user_id", metaUser.id)
    .maybeSingle();

  if (findError) {
    throw findError;
  }

  /* =========================================
     EXISTING CONNECTION
  ========================================= */

  if (existingConnection) {
    const { error: updateError } =
      await supabase
        .from("meta_connections")
        .update({
          access_token: accessToken,

          token_expires_at: expiresIn
            ? new Date(
                Date.now() +
                  expiresIn * 1000
              ).toISOString()
            : null,

          updated_at:
            new Date().toISOString()
        })
        .eq(
          "id",
          existingConnection.id
        );

    if (updateError) {
      throw updateError;
    }

    console.log(
      "✅ Existing Meta connection updated"
    );

    return existingConnection.id;
  }

  /* =========================================
     CREATE CUSTOMER
  ========================================= */

  const {
    data: customer,
    error: customerError
  } = await supabase
    .from("customers")
    .insert({
      name:
        metaUser.name ||
        "Meta Customer"
    })
    .select("id")
    .single();

  if (customerError) {
    throw customerError;
  }

  /* =========================================
     CREATE META CONNECTION
  ========================================= */

  const {
    data: connection,
    error: connectionError
  } = await supabase
    .from("meta_connections")
    .insert({
      customer_id: customer.id,

      meta_user_id:
        metaUser.id,

      access_token:
        accessToken,

      token_expires_at:
        expiresIn
          ? new Date(
              Date.now() +
                expiresIn * 1000
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

/* =========================================================
   SYNC META BUSINESSES / AD ACCOUNTS / PAGES / INSTAGRAM
========================================================= */

async function getMetaAssets(connectionId) {
  if (!supabase) {
    throw new Error(
      "Supabase environment variables are missing"
    );
  }

  /* =========================================
     GET CONNECTION
  ========================================= */

  const {
    data: connection,
    error: connectionError
  } = await supabase
    .from("meta_connections")
    .select(
      "id, customer_id, meta_user_id, access_token"
    )
    .eq("id", connectionId)
    .single();

  if (connectionError || !connection) {
    throw new Error(
      "Meta connection was not found"
    );
  }

  const accessToken =
    connection.access_token;

  if (!accessToken) {
    throw new Error(
      "Meta access token is missing"
    );
  }

  console.log(
    "🔄 Fetching Meta businesses..."
  );

  /* =========================================
     BUSINESSES
  ========================================= */

  const businesses =
    await metaGraphRequest(
      "/me/businesses?fields=id,name&limit=100",
      accessToken
    );

  console.log(
    `✅ Businesses found: ${
      (businesses.data || []).length
    }`
  );

  /* =========================================
     AD ACCOUNTS
  ========================================= */

  console.log(
    "🔄 Fetching Meta ad accounts..."
  );

  const adAccounts =
    await metaGraphRequest(
      
"/me/adaccounts?fields=id,name,account_status,currency,account_id&limit=100",
      accessToken
    );

  console.log(
    `✅ Ad accounts found: ${
      (adAccounts.data || []).length
    }`
  );

  /* =========================================
     FACEBOOK PAGES
  ========================================= */

  console.log(
    "🔄 Fetching Facebook pages..."
  );

  const pages =
    await metaGraphRequest(
      "/me/accounts?fields=id,name&limit=100",
      accessToken
    );

  console.log(
    `✅ Facebook pages found: ${
      (pages.data || []).length
    }`
  );

  /* =========================================
     SAVE BUSINESSES
  ========================================= */

  for (
    const business of
    businesses.data || []
  ) {
    const {
      error
    } = await supabase
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
        "❌ Business save error:",
        error
      );
    }
  }

  /* =========================================
     SAVE AD ACCOUNTS
  ========================================= */

  for (
    const account of
    adAccounts.data || []
  ) {
    const {
      error
    } = await supabase
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
        "❌ Ad account save error:",
        error
      );
    }
  }

  /* =========================================
     SAVE FACEBOOK PAGES
  ========================================= */

  for (
    const page of
    pages.data || []
  ) {
    const {
      error
    } = await supabase
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
        "❌ Page save error:",
        error
      );
    }
  }

  /* =========================================
     INSTAGRAM BUSINESS ACCOUNTS
  ========================================= */

  console.log(
    "🔄 Fetching Instagram accounts..."
  );

  const instagramAccounts = [];

  for (
    const page of
    pages.data || []
  ) {
    try {
      const pageData =
        await metaGraphRequest(
          `/${page.id}?fields=instagram_business_account{id,username}`,
          accessToken
        );

      const instagram =
        pageData.instagram_business_account;

      if (!instagram) {
        continue;
      }

      instagramAccounts.push({
        id: instagram.id,
        username:
          instagram.username || null,
        pageId: page.id
      });

      const {
        error
      } = await supabase
        .from(
          "meta_instagram_accounts"
        )
        .upsert(
          {
            meta_connection_id:
              connection.id,

            instagram_id:
              instagram.id,

            username:
              instagram.username ||
              null
          },
          {
            onConflict:
              "meta_connection_id,instagram_id"
          }
        );

      if (error) {
        console.error(
          "❌ Instagram save error:",
          error
        );
      }
    } catch (error) {
      console.log(
        `ℹ️ No Instagram business account for page ${page.id}`
      );
    }
  }

  console.log(
    `✅ Instagram accounts found: ${instagramAccounts.length}`
  );

  return {
    businesses:
      businesses.data || [],

    adAccounts:
      adAccounts.data || [],

    pages:
      pages.data || [],

    instagramAccounts
  };
}

/* =========================================================
   HTTP SERVER
========================================================= */

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

    /* =========================================
       META OAUTH CALLBACK
    ========================================= */

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
          url.searchParams.get(
            "code"
          );

        const error =
          url.searchParams.get(
            "error"
          );

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

        /* =====================================
           EXCHANGE CODE FOR TOKEN
        ===================================== */

        const tokenData =
          await exchangeMetaCode(
            code
          );

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

        /* =====================================
           GET META USER
        ===================================== */

        const metaUser =
          await getMetaUser(
            accessToken
          );

        console.log(
          "✅ Meta user:",
          metaUser.id,
          metaUser.name
        );

        /* =====================================
           SAVE CUSTOMER + CONNECTION
        ===================================== */

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

        /* =====================================
           SYNC META ASSETS
        ===================================== */

        console.log(
          "🔄 Syncing Meta assets..."
        );

        const metaAssets =
          await getMetaAssets(
            connectionId
          );

        console.log(
          "✅ Meta assets synced:",
          {
            businesses:
              metaAssets.businesses.length,

            adAccounts:
              metaAssets.adAccounts.length,

            pages:
              metaAssets.pages.length,

            instagramAccounts:
              metaAssets.instagramAccounts
                .length
          }
        );

        /* =====================================
           SUCCESS PAGE
        ===================================== */

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
                font-family:
                  Arial,
                  sans-serif;

                text-align:
                  center;

                padding:
                  60px 20px;

                background:
                  #f5f7fb;
              }

              .card {
                max-width:
                  480px;

                margin:
                  auto;

                background:
                  white;

                padding:
                  40px;

                border-radius:
                  20px;

                box-shadow:
                  0 10px 40px
                  rgba(0,0,0,.1);
              }

              h1 {
                color:
                  #1877f2;
              }

              .stats {
                margin-top:
                  25px;

                text-align:
                  left;

                background:
                  #f5f7fb;

                padding:
                  20px;

                border-radius:
                  12px;
              }

              .stats p {
                margin:
                  8px 0;
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

              <div class="stats">

                <p>
                  🏢 Businesses:
                  <strong>
                    ${metaAssets.businesses.length}
                  </strong>
                </p>

                <p>
                  💰 Ad Accounts:
                  <strong>
                    ${metaAssets.adAccounts.length}
                  </strong>
                </p>

                <p>
                  📘 Facebook Pages:
                  <strong>
                    ${metaAssets.pages.length}
                  </strong>
                </p>

                <p>
                  📸 Instagram Accounts:
                  <strong>
                    ${metaAssets.instagramAccounts.length}
                  </strong>
                </p>

              </div>

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
          <!DOCTYPE html>

          <html>

          <head>
            <title>Meta Connection Failed</title>
          </head>

          <body>

            <h2>
              ❌ Meta Connection Failed
            </h2>

            <p>
              ${
                error.message ||
                "Unknown error"
              }
            </p>

          </body>

          </html>
        `);

        return;
      }
    }

    /* =========================================
       LOCATION SEARCH API
    ========================================= */

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
        url.searchParams
          .get("q")
          ?.trim();

      if (
        !query ||
        query.length < 2
      ) {
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

      const now =
        Date.now();

      if (
        now -
          lastSearchTime <
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

      lastSearchTime =
        now;

      try {
        const apiUrl =
          "https://nominatim.openstreetmap.org/search?" +
          new URLSearchParams({
            q: query,

            format:
              "jsonv2",

            addressdetails:
              "1",

            limit:
              "8",

            countrycodes:
              "in"
          });

        const response =
          await fetch(
            apiUrl,
            {
              headers: {
                "User-Agent":
                  "ShopBoost-AI/1.0 location-search"
              }
            }
          );

        if (!response.ok) {
          throw new Error(
            `Location API returned ${response.status}`
          );
        }

        const data =
          await response.json();

        const results =
          data.map(
            (place) => ({
              id:
                `${place.osm_type}-${place.osm_id}`,

              name:
                place.name ||
                place.address?.city ||
                place.address?.town ||
                place.address?.village ||
                place.display_name
                  .split(",")[0],

              displayName:
                place.display_name,

              latitude:
                Number(place.lat),

              longitude:
                Number(place.lon),

              type:
                place.type,

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
          JSON.stringify(
            results
          )
        );

      } catch (error) {
        console.error(
          error
        );

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

    /* =========================================
       HEALTH CHECK
    ========================================= */

    if (req.url === "/") {
      res.writeHead(200, {
        "Content-Type":
          "application/json"
      });

      res.end(
        JSON.stringify({
          status:
            "ok",

          service:
            "ShopBoost AI Backend",

          metaCallback:
            "/auth/meta/callback",

          supabaseConfigured:
            Boolean(supabase)
        })
      );

      return;
    }

    /* =========================================
       404
    ========================================= */

    res.writeHead(404, {
      "Content-Type":
        "text/plain"
    });

    res.end(
      "Not Found"
    );
  }
);

/* =========================================================
   START SERVER
========================================================= */

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
      `🗄️ Supabase configured: ${Boolean(supabase)}`
    );
  }
);
