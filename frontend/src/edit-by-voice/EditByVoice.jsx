import { useState } from "react";
import "./EditByVoice.css";

function EditByVoice() {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");

  const [changes, setChanges] = useState({
    offerName: "",
    discount: "",
    price: "",
    duration: "",
    category: "",
  });

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage("ఈ బ్రౌజర్‌లో Voice Recognition అందుబాటులో లేదు.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "te-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setMessage("🎙️ వింటున్నాను... మీ మార్పులు చెప్పండి.");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      setCommand(text);
      processCommand(text);
    };

    recognition.onerror = () => {
      setMessage("Voiceలో సమస్య వచ్చింది. మళ్లీ ప్రయత్నించండి.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processCommand = (text) => {
    const lowerText = text.toLowerCase();

    const discountMatch = text.match(/(\d+)\s*%/);
    const priceMatch = text.match(/₹\s*([\d,]+)/);
    const daysMatch = text.match(/(\d+)\s*(రోజులు|రోజు|days?)/i);

    const updated = {};

    if (discountMatch) {
      updated.discount = `${discountMatch[1]}%`;
    }

    if (priceMatch) {
      updated.price = `₹${priceMatch[1]}`;
    }

    if (daysMatch) {
      updated.duration = `${daysMatch[1]} రోజులు`;
    }

    if (
      lowerText.includes("చీర") ||
      lowerText.includes("చీరలు")
    ) {
      updated.category = "చీరలు";
    }

    if (Object.keys(updated).length > 0) {
      setChanges((previous) => ({
        ...previous,
        ...updated,
      }));

      setMessage("✅ మీరు చెప్పిన మార్పులు గుర్తించబడ్డాయి.");
    } else {
      setMessage(
        "మార్పు గుర్తించలేదు. ఉదాహరణ: “డిస్కౌంట్ 50 శాతం చేయండి.”"
      );
    }
  };

  const clearChanges = () => {
    setCommand("");
    setMessage("");

    setChanges({
      offerName: "",
      discount: "",
      price: "",
      duration: "",
      category: "",
    });
  };

  return (
    <div className="edit-voice-page">
      <div className="edit-voice-card">

        <div className="edit-voice-header">
          <span>🎙️ VOICE EDIT</span>

          <h1>మాట్లాడి ఆఫర్ మార్చండి</h1>

          <p>
            మీరు మార్చాలనుకున్న వివరాలను తెలుగులో చెప్పండి.
          </p>
        </div>

        <button
          className={`edit-mic ${isListening ? "active" : ""}`}
          onClick={startVoice}
        >
          {isListening ? "⏹️" : "🎙️"}
        </button>

        <div className="voice-status">
          {isListening
            ? "వింటున్నాను..."
            : "మైక్ నొక్కి మార్పులు చెప్పండి"}
        </div>

        <div className="command-box">
          <label>🗣️ మీరు చెప్పింది</label>

          <div>
            {command || "ఇక్కడ మీ voice command కనిపిస్తుంది..."}
          </div>
        </div>

        <div className="examples">

          <h3>💡 ఉదాహరణలు</h3>

          <div>
            🎙️ “డిస్కౌంట్ 50 శాతం చేయండి.”
          </div>

          <div>
            🎙️ “ధర ₹2499 చేయండి.”
          </div>

          <div>
            🎙️ “ఆఫర్ 10 రోజులు పెట్టండి.”
          </div>

          <div>
            🎙️ “కేటగిరీ చీరలు పెట్టండి.”
          </div>

        </div>

        <div className="detected-changes">

          <h3>✨ గుర్తించిన మార్పులు</h3>

          <div className="change-grid">

            <div>
              <span>🏷️ కేటగిరీ</span>
              <strong>
                {changes.category || "—"}
              </strong>
            </div>

            <div>
              <span>💰 డిస్కౌంట్</span>
              <strong>
                {changes.discount || "—"}
              </strong>
            </div>

            <div>
              <span>💵 ధర</span>
              <strong>
                {changes.price || "—"}
              </strong>
            </div>

            <div>
              <span>📅 వ్యవధి</span>
              <strong>
                {changes.duration || "—"}
              </strong>
            </div>

          </div>
        </div>

        {message && (
          <div className="edit-message">
            {message}
          </div>
        )}

        <button
          className="clear-changes"
          onClick={clearChanges}
        >
          🗑️ క్లియర్
        </button>

      </div>
    </div>
  );
}

export default EditByVoice;
