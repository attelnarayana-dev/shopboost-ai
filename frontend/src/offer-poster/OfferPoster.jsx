import { useState } from "react";
import "./OfferPoster.css";

function OfferPoster() {
  const [offer, setOffer] = useState({
    offerName: "దసరా స్పెషల్ ఆఫర్",
    category: "చీరలు",
    discount: "50%",
    price: "₹2999",
    duration: "7 రోజులు",
    description:
      "అన్ని చీరలపై 50% డిస్కౌంట్. ₹2999 నుంచి. 7 రోజులు మాత్రమే.",
  });

  const [posterStatus, setPosterStatus] = useState("");

  const updateOffer = (field, value) => {
    setOffer((previous) => ({
      ...previous,
      [field]: value,
    }));

    setPosterStatus("");
  };

  const preparePoster = () => {
    setPosterStatus("✅ మీ ఆఫర్ పోస్టర్ సిద్ధంగా ఉంది!");
  };

  const resetPoster = () => {
    setOffer({
      offerName: "దసరా స్పెషల్ ఆఫర్",
      category: "చీరలు",
      discount: "50%",
      price: "₹2999",
      duration: "7 రోజులు",
      description:
        "అన్ని చీరలపై 50% డిస్కౌంట్. ₹2999 నుంచి. 7 రోజులు మాత్రమే.",
    });

    setPosterStatus("");
  };

  return (
    <div className="offer-poster-page">

      <div className="offer-poster-container">

        <div className="poster-header">

          <span>🎨 OFFER POSTER STUDIO</span>

          <h1>మీ ఆఫర్ పోస్టర్</h1>

          <p>
            మీ ఆఫర్ వివరాలతో Social Media కోసం పోస్టర్ సిద్ధం చేయండి.
          </p>

        </div>

        <div className="poster-layout">

          {/* POSTER PREVIEW */}

          <div className="poster-preview-section">

            <h3>👀 పోస్టర్ Preview</h3>

            <div className="poster-card">

              <div className="poster-top-label">
                🔥 SPECIAL OFFER
              </div>

              <div className="poster-offer-name">
                {offer.offerName || "మీ ఆఫర్ పేరు"}
              </div>

              <div className="poster-discount">
                {offer.discount || "0%"}
              </div>

              <div className="poster-discount-text">
                వరకు డిస్కౌంట్
              </div>

              <div className="poster-info">

                <div>
                  <span>🏷️</span>
                  <strong>
                    {offer.category || "-"}
                  </strong>
                </div>

                <div>
                  <span>💵</span>
                  <strong>
                    {offer.price || "-"}
                  </strong>
                </div>

                <div>
                  <span>📅</span>
                  <strong>
                    {offer.duration || "-"}
                  </strong>
                </div>

              </div>

              <div className="poster-description">
                {offer.description || "మీ ఆఫర్ వివరాలు ఇక్కడ కనిపిస్తాయి."}
              </div>

              <div className="poster-button">
                SHOP NOW
              </div>

              <div className="poster-footer">
                LIMITED PERIOD OFFER
              </div>

            </div>

          </div>

          {/* EDIT PANEL */}

          <div className="poster-edit-section">

            <h3>✏️ Poster Details</h3>

            <div className="poster-field">

              <label>🎁 ఆఫర్ పేరు</label>

              <input
                value={offer.offerName}
                onChange={(event) =>
                  updateOffer("offerName", event.target.value)
                }
              />

            </div>

            <div className="poster-field">

              <label>🏷️ కేటగిరీ</label>

              <input
                value={offer.category}
                onChange={(event) =>
                  updateOffer("category", event.target.value)
                }
              />

            </div>

            <div className="poster-field">

              <label>💰 డిస్కౌంట్</label>

              <input
                value={offer.discount}
                onChange={(event) =>
                  updateOffer("discount", event.target.value)
                }
              />

            </div>

            <div className="poster-field">

              <label>💵 ధర</label>

              <input
                value={offer.price}
                onChange={(event) =>
                  updateOffer("price", event.target.value)
                }
              />

            </div>

            <div className="poster-field">

              <label>📅 వ్యవధి</label>

              <input
                value={offer.duration}
                onChange={(event) =>
                  updateOffer("duration", event.target.value)
                }
              />

            </div>

            <div className="poster-field">

              <label>📝 వివరణ</label>

              <textarea
                value={offer.description}
                onChange={(event) =>
                  updateOffer("description", event.target.value)
                }
              />

            </div>

            <div className="poster-actions">

              <button
                className="reset-poster-button"
                onClick={resetPoster}
              >
                ↩️ Reset
              </button>

              <button
                className="prepare-poster-button"
                onClick={preparePoster}
              >
                🎨 Prepare Poster
              </button>

            </div>

            {posterStatus && (
              <div className="poster-status">
                {posterStatus}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default OfferPoster;
