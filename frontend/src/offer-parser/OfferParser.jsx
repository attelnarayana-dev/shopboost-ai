import { useState } from "react";
import "./OfferParser.css";

function OfferParser() {
  const [offerText, setOfferText] = useState("");

  const [form, setForm] = useState({
    offerName: "",
    category: "",
    discount: "",
    price: "",
    duration: "",
    description: "",
  });

  const extractOffer = () => {
    const text = offerText.trim();

    if (!text) return;

    const discountMatch = text.match(/(\d+)\s*%/);
    const priceMatch = text.match(/₹\s*([\d,]+)/);
    const daysMatch = text.match(/(\d+)\s*(రోజులు|రోజు|days?)/i);

    setForm({
      offerName:
        text.split(/[.!?]/)[0]?.trim() || "కొత్త ఆఫర్",

      category:
        text.includes("చీర")
          ? "చీరలు"
          : text.includes("షర్ట")
          ? "షర్ట్స్"
          : text.includes("షూ")
          ? "షూస్"
          : "",

      discount: discountMatch
        ? `${discountMatch[1]}%`
        : "",

      price: priceMatch
        ? `₹${priceMatch[1]}`
        : "",

      duration: daysMatch
        ? `${daysMatch[1]} రోజులు`
        : "",

      description: text,
    });
  };

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const clearAll = () => {
    setOfferText("");

    setForm({
      offerName: "",
      category: "",
      discount: "",
      price: "",
      duration: "",
      description: "",
    });
  };

  return (
    <div className="offer-parser-page">
      <div className="offer-parser-container">

        <div className="parser-header">
          <span>🧠 AI OFFER PARSER</span>

          <h1>మీ ఆఫర్ వివరాలను ఆటోమేటిక్‌గా తయారు చేయండి</h1>

          <p>
            మీరు మాట్లాడిన లేదా టైప్ చేసిన వివరాలను
            ఆఫర్ ఫీల్డ్స్‌గా మార్చండి.
          </p>
        </div>

        <div className="input-section">

          <label>🗣️ మీ ఆఫర్ వివరాలు</label>

          <textarea
            value={offerText}
            onChange={(event) => setOfferText(event.target.value)}
            placeholder="ఉదాహరణ: దసరా స్పెషల్ ఆఫర్. అన్ని చీరలపై 40% డిస్కౌంట్. ₹2999 
నుంచి. 7 రోజులు మాత్రమే."
          />

          <div className="input-actions">

            <button
              className="extract-button"
              onClick={extractOffer}
            >
              ✨ వివరాలు ఆటో ఫిల్ చేయండి
            </button>

            <button
              className="clear-button"
              onClick={clearAll}
            >
              క్లియర్
            </button>

          </div>
        </div>

        <div className="fields-section">

          <div className="field">
            <label>🎁 ఆఫర్ పేరు</label>

            <input
              value={form.offerName}
              onChange={(event) =>
                updateField("offerName", event.target.value)
              }
              placeholder="ఉదా: దసరా స్పెషల్ ఆఫర్"
            />
          </div>

          <div className="field">
            <label>🏷️ కేటగిరీ</label>

            <input
              value={form.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
              placeholder="ఉదా: చీరలు"
            />
          </div>

          <div className="field">
            <label>💰 డిస్కౌంట్</label>

            <input
              value={form.discount}
              onChange={(event) =>
                updateField("discount", event.target.value)
              }
              placeholder="ఉదా: 40%"
            />
          </div>

          <div className="field">
            <label>💵 ప్రారంభ ధర</label>

            <input
              value={form.price}
              onChange={(event) =>
                updateField("price", event.target.value)
              }
              placeholder="ఉదా: ₹2999"
            />
          </div>

          <div className="field">
            <label>📅 ఆఫర్ వ్యవధి</label>

            <input
              value={form.duration}
              onChange={(event) =>
                updateField("duration", event.target.value)
              }
              placeholder="ఉదా: 7 రోజులు"
            />
          </div>

          <div className="field full">
            <label>📝 వివరణ</label>

            <textarea
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              placeholder="ఆఫర్ వివరణ"
            />
          </div>

        </div>

        <div className="parser-footer">

          <div>
            <strong>✏️ అవసరమైతే మార్చుకోవచ్చు</strong>
            <p>
              AI తయారు చేసిన వివరాలను మీరు స్వయంగా edit చేయవచ్చు.
            </p>
          </div>

          <button
            className="confirm-button"
            disabled={!form.offerName}
          >
            ✅ ఆఫర్ Confirm చేయండి
          </button>

        </div>

      </div>
    </div>
  );
}

export default OfferParser;
