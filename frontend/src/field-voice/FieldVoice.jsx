import { useState } from "react";
import "./FieldVoice.css";

function FieldVoice({
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("ఈ browserలో Voice Recognition అందుబాటులో లేదు.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "te-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript.trim();

      onChange(spokenText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="field-voice-wrapper">

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />

      <button
        type="button"
        className={`field-voice-button ${
          isListening ? "listening" : ""
        }`}
        onClick={startListening}
        title="మాట్లాడి ఈ field fill చేయండి"
      >
        {isListening ? "🔴" : "🎙️"}
      </button>

    </div>
  );
}

export default FieldVoice;
