import { useState } from "react";
import "./OfferConfirm.css";
import FieldVoice from "../field-voice/FieldVoice";

function OfferConfirm() {
  const [offer, setOffer] = useState({
    offerName: "దసరా స్పెషల్ ఆఫర్",
    category: "చీరలు",
    discount: "40%",
    price: "₹2999",
    duration: "7 రోజులు",
    description:
      "అన్ని చీరలపై 40% డిస్కౌంట్. ₹2999 నుంచి. 7 రోజులు మాత్రమే.",
  });

  const [status, setStatus] = useState("");

  const updateOffer = (field, value) => {
    setOffer((previous) => ({
      ...previous,
      [field]: value,
    }));

    setStatus("");
  };

  const confirmOffer = () => {
    setStatus("✅ మీ ఆఫర్ విజయవంతంగా Confirm అయింది!");
  };

  const cancelOffer = () => {
    setStatus("❌ ఆఫర్ Cancel చేయబడింది.");
  };

  return (
    <div className="offer-confirm-page">
      <div className="offer-confirm-container">

        <div className="confirm-header">
          <span>✅ OFFER CONFIRMATION</span>

          <h1>మీ ఆఫర్ సిద్ధంగా ఉంది</h1>

          <p>
            వివరాలను ఒకసారి చూసి అవసరమైతే మార్చి Confirm చేయండి.
          </p>
        </div>

        {/* OFFER PREVIEW */}

        <div className="offer-preview">

          <div className="preview-top">
            <div>
              <small>మీ షాప్ ఆఫర్</small>

              <h2>
                {offer.offerName || "ఆఫర్ పేరు"}
              </h2>
            </div>

            <div className="discount-badge">
              {offer.discount || "0%"}
            </div>
          </div>

          <div className="preview-grid">

            <div>
              <span>🏷️ కేటగిరీ</span>

              <strong>
                {offer.category || "-"}
              </strong>
            </div>

            <div>
              <span>💵 ధర</span>

              <strong>
                {offer.price || "-"}
              </strong>
            </div>

            <div>
              <span>📅 వ్యవధి</span>

              <strong>
                {offer.duration || "-"}
              </strong>
            </div>

          </div>

          <div className="preview-description">

            <span>📝 వివరణ</span>

            <p>
              {offer.description || "-"}
            </p>

          </div>

        </div>

        {/* EDIT SECTION */}

        <div className="edit-section">

          <h3>✏️ వివరాలు మార్చండి</h3>

          <div className="edit-grid">

            {/* OFFER NAME */}

            <div className="field">

              <label>
                🎁 ఆఫర్ పేరు
              </label>

              <FieldVoice
                value={offer.offerName}
                onChange={(value) =>
                  updateOffer("offerName", value)
                }
                placeholder="ఆఫర్ పేరు"
              />

            </div>

            {/* CATEGORY */}

            <div className="field">

              <label>
                🏷️ కేటగిరీ
              </label>

              <FieldVoice
                value={offer.category}
                onChange={(value) =>
                  updateOffer("category", value)
                }
                placeholder="కేటగిరీ"
              />

            </div>

            {/* DISCOUNT */}

            <div className="field">

              <label>
                💰 డిస్కౌంట్
              </label>

              <FieldVoice
                value={offer.discount}
                onChange={(value) =>
                  updateOffer("discount", value)
                }
                placeholder="డిస్కౌంట్"
              />

            </div>

            {/* PRICE */}

            <div className="field">

              <label>
                💵 ధర
              </label>

              <FieldVoice
                value={offer.price}
                onChange={(value) =>
                  updateOffer("price", value)
                }
                placeholder="ధర"
              />

            </div>

            {/* DURATION */}

            <div className="field">

              <label>
                📅 వ్యవధి
              </label>

              <FieldVoice
                value={offer.duration}
                onChange={(value) =>
                  updateOffer("duration", value)
                }
                placeholder="వ్యవధి"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="field full">

              <label>
                📝 వివరణ
              </label>

              <textarea
                value={offer.description}
                onChange={(event) =>
                  updateOffer(
                    "description",
                    event.target.value
                  )
                }
                placeholder="ఆఫర్ వివరణ"
              />

            </div>

          </div>

        </div>

        {/* ACTION BUTTONS */}

        <div className="confirm-actions">

          <button
            className="cancel-button"
            onClick={cancelOffer}
          >
            ❌ Cancel
          </button>

          <button
            className="confirm-button"
            onClick={confirmOffer}
          >
            ✅ Confirm Offer
          </button>

        </div>

        {/* STATUS */}

        {status && (
          <div className="status-message">
            {status}
          </div>
        )}

      </div>
    </div>
  );
}

export default OfferConfirm;
