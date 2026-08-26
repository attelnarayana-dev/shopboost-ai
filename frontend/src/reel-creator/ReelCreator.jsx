import { useState } from "react";
import "./ReelCreator.css";

function ReelCreator() {
  const [duration, setDuration] = useState("15");
  const [status, setStatus] = useState("");

  const [reel, setReel] = useState({
    title: "దసరా స్పెషల్ ఆఫర్",
    discount: "40% OFF",
    category: "చీరలు",
    price: "₹2999",
    duration: "7 రోజులు మాత్రమే",
    cta: "ఇప్పుడే షాప్‌ని సందర్శించండి!",
  });

  const updateReel = (field, value) => {
    setReel((previous) => ({
      ...previous,
      [field]: value,
    }));

    setStatus("");
  };

  const createReel = () => {
    setStatus("🎬 మీ Reel Preview సిద్ధంగా ఉంది!");
  };

  const resetReel = () => {
    setReel({
      title: "దసరా స్పెషల్ ఆఫర్",
      discount: "40% OFF",
      category: "చీరలు",
      price: "₹2999",
      duration: "7 రోజులు మాత్రమే",
      cta: "ఇప్పుడే షాప్‌ని సందర్శించండి!",
    });

    setDuration("15");
    setStatus("");
  };

  return (
    <div className="reel-creator-page">

      <div className="reel-creator-container">

        <div className="reel-header">

          <span>🎬 REEL CREATOR</span>

          <h1>మీ Social Media Reel</h1>

          <p>
            మీ ఆఫర్‌తో Instagram & Facebook కోసం Vertical Reel సిద్ధం చేయండి.
          </p>

        </div>

        <div className="reel-layout">

          {/* REEL PREVIEW */}

          <div className="reel-preview-section">

            <h3>👀 Reel Preview</h3>

            <div className="phone-frame">

              <div className="reel-screen">

                <div className="reel-glow"></div>

                <div className="reel-top-text">
                  🔥 SPECIAL OFFER
                </div>

                <div className="reel-title">
                  {reel.title || "మీ ఆఫర్"}
                </div>

                <div className="reel-discount">
                  {reel.discount || "0% OFF"}
                </div>

                <div className="reel-category">
                  🏷️ {reel.category || "-"}
                </div>

                <div className="reel-price">
                  {reel.price || "-"}
                </div>

                <div className="reel-duration">
                  ⏳ {reel.duration || "-"}
                </div>

                <div className="reel-cta">
                  {reel.cta || "SHOP NOW"}
                </div>

                <div className="reel-instagram">
                  Instagram • Facebook
                </div>

              </div>

            </div>

          </div>

          {/* SETTINGS */}

          <div className="reel-settings-section">

            <h3>⚙️ Reel Settings</h3>

            <div className="reel-field">

              <label>🎁 Offer Title</label>

              <input
                value={reel.title}
                onChange={(event) =>
                  updateReel("title", event.target.value)
                }
              />

            </div>

            <div className="reel-field">

              <label>🔥 Discount</label>

              <input
                value={reel.discount}
                onChange={(event) =>
                  updateReel("discount", event.target.value)
                }
              />

            </div>

            <div className="reel-field">

              <label>🏷️ Category</label>

              <input
                value={reel.category}
                onChange={(event) =>
                  updateReel("category", event.target.value)
                }
              />

            </div>

            <div className="reel-field">

              <label>💵 Price</label>

              <input
                value={reel.price}
                onChange={(event) =>
                  updateReel("price", event.target.value)
                }
              />

            </div>

            <div className="reel-field">

              <label>⏳ Offer Duration</label>

              <input
                value={reel.duration}
                onChange={(event) =>
                  updateReel("duration", event.target.value)
                }
              />

            </div>

            <div className="reel-field">

              <label>🚀 Call To Action</label>

              <input
                value={reel.cta}
                onChange={(event) =>
                  updateReel("cta", event.target.value)
                }
              />

            </div>

            <div className="reel-field">

              <label>⏱️ Reel Duration</label>

              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              >
                <option value="10">10 Seconds</option>
                <option value="15">15 Seconds</option>
                <option value="20">20 Seconds</option>
                <option value="30">30 Seconds</option>
              </select>

            </div>

            <div className="reel-actions">

              <button
                className="reset-reel-button"
                onClick={resetReel}
              >
                ↩️ Reset
              </button>

              <button
                className="create-reel-button"
                onClick={createReel}
              >
                🎬 Create Reel
              </button>

            </div>

            {status && (
              <div className="reel-status">
                {status}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default ReelCreator;
