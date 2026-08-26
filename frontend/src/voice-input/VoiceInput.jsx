import { useRef, useState } from "react";
import "./VoiceInput.css";

function VoiceInput() {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("మైక్ నొక్కి మాట్లాడండి");

  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("ఈ బ్రౌజర్‌లో వాయిస్ సదుపాయం అందుబాటులో లేదు.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "te-IN";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setStatus("🎙️ వింటున్నాను... మాట్లాడండి");
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setText(transcript);
    };

    recognition.onerror = () => {
      setStatus("మైక్రోఫోన్‌లో సమస్య వచ్చింది. మళ్లీ ప్రయత్నించండి.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus("మాట పూర్తయింది. అవసరమైతే మళ్లీ మాట్లాడండి.");
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
  };

  const clearText = () => {
    setText("");
    setStatus("మైక్ నొక్కి మాట్లాడండి");
  };

  return (
    <div className="voice-input-page">
      <div className="voice-card">

        <div className="voice-header">
          <span className="voice-badge">🎙️ వాయిస్ ఇన్‌పుట్</span>

          <h1>మాట్లాడండి — టైప్ చేయాల్సిన అవసరం లేదు</h1>

          <p>
            మీ ఆఫర్ వివరాలను తెలుగులో మాట్లాడండి.
            మీ మాటలను టెక్స్ట్‌గా మార్చుకుంటాం.
          </p>
        </div>

        <button
          className={`mic-button ${isListening ? "listening" : ""}`}
          onClick={isListening ? stopListening : startListening}
        >
          <span>{isListening ? "⏹️" : "🎙️"}</span>
        </button>

        <div className="voice-status">
          {status}
        </div>

        <div className="text-box">
          <label>మీరు చెప్పిన వివరాలు</label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ఉదాహరణ: దసరా స్పెషల్ ఆఫర్. అన్ని చీరలపై 40 శాతం తగ్గింపు..."
          />

          {text && (
            <button className="clear-button" onClick={clearText}>
              ✕ క్లియర్
            </button>
          )}
        </div>

        <div className="example-box">
          <strong>💡 ఇలా చెప్పండి</strong>

          <p>
            “దసరా స్పెషల్ ఆఫర్. అన్ని చీరలపై 40 శాతం తగ్గింపు.
            7 రోజులు మాత్రమే.”
          </p>
        </div>

        <button className="continue-button" disabled={!text.trim()}>
          ➜ ఆఫర్ వివరాలకు కొనసాగించండి
        </button>

      </div>
    </div>
  );
}

export default VoiceInput;
