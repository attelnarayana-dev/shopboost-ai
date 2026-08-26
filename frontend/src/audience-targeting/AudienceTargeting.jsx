import { useState } from "react";
import "./AudienceTargeting.css";

const audienceTypes = [
  {
    id: "new",
    icon: "👥",
    title: "New Potential Customers",
    description: "Reach people who may be interested in your business.",
  },
  {
    id: "engaged",
    icon: "❤️",
    title: "People Who Engaged",
    description: "Reach people who interacted with your content.",
  },
  {
    id: "reel",
    icon: "👀",
    title: "Reel Viewers",
    description: "Reach people who watched your Reels.",
  },
  {
    id: "previous",
    icon: "🛒",
    title: "Previous Customers",
    description: "Reconnect with people who already purchased.",
  },
  {
    id: "retargeting",
    icon: "🔄",
    title: "Retargeting Audience",
    description: "Bring interested people back to your business.",
  },
];

const interests = [
  "Shopping",
  "Fashion",
  "Beauty",
  "Food",
  "Technology",
  "Fitness",
  "Travel",
  "Business",
  "Entertainment",
];

function AudienceTargeting() {
  const [audienceType, setAudienceType] = useState("new");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("45");
  const [gender, setGender] = useState("All");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const toggleInterest = (interest) => {
    setSelectedInterests((previous) =>
      previous.includes(interest)
        ? previous.filter((item) => item !== interest)
        : [...previous, interest]
    );
  };

  return (
    <div className="audience-targeting">

      <div className="audience-header">
        <div>
          <span className="audience-eyebrow">
            👥 AUDIENCE TARGETING
          </span>

          <h2>Who do you want to reach?</h2>

          <p>
            Choose the audience most likely to respond to your campaign.
          </p>
        </div>

        <div className="audience-ai-badge">
          🧠 AI Powered
        </div>

        <button
          type="button"
          onClick={() => {
            const appId = "1852755615887763";
            const redirectUri =
              "https://shopboost-ai-backend.onrender.com/auth/meta/callback";

            const scope = [
              "business_management",
              "pages_show_list",
              "pages_read_engagement",
              "ads_read",
              "ads_management"
            ].join(",");

            const metaUrl =
              `https://www.facebook.com/v25.0/dialog/oauth` +
              `?client_id=${encodeURIComponent(appId)}` +
              `&redirect_uri=${encodeURIComponent(redirectUri)}` +
              `&scope=${encodeURIComponent(scope)}` +
              `&response_type=code`;

            window.location.href = metaUrl;
          }}
        >
          🔵 Connect Meta
        </button>
      </div>

      <div className="audience-recommendation">
        <div className="recommendation-icon">✨</div>

        <div>
          <strong>AI Recommended Audience</strong>

          <p>
            Based on your campaign goal, location and creative,
            we recommend starting with New Potential Customers.
          </p>
        </div>
      </div>

      <div className="audience-section">
        <div className="section-heading">
          <span>🎯</span>

          <div>
            <strong>Audience Type</strong>
            <small>Choose who you want to reach</small>
          </div>
        </div>

        <div className="audience-options">
          {audienceTypes.map((audience) => (
            <button
              type="button"
              key={audience.id}
              className={`audience-option ${
                audienceType === audience.id ? "active" : ""
              }`}
              onClick={() => setAudienceType(audience.id)}
            >
              <span className="audience-option-icon">
                {audience.icon}
              </span>

              <span className="audience-option-content">
                <strong>{audience.title}</strong>
                <small>{audience.description}</small>
              </span>

              <span className="audience-check">
                {audienceType === audience.id ? "✓" : ""}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="audience-section">
        <div className="section-heading">
          <span>🎂</span>

          <div>
            <strong>Age & Gender</strong>
            <small>Define your ideal customer</small>
          </div>
        </div>

        <div className="audience-controls">

          <div className="audience-control">
            <label>Minimum Age</label>

            <select
              value={ageMin}
              onChange={(event) => setAgeMin(event.target.value)}
            >
              <option>18</option>
              <option>21</option>
              <option>25</option>
              <option>30</option>
              <option>35</option>
              <option>40</option>
              <option>45</option>
              <option>50</option>
            </select>
          </div>

          <div className="audience-control">
            <label>Maximum Age</label>

            <select
              value={ageMax}
              onChange={(event) => setAgeMax(event.target.value)}
            >
              <option>25</option>
              <option>30</option>
              <option>35</option>
              <option>40</option>
              <option>45</option>
              <option>50</option>
              <option>55</option>
              <option>65</option>
            </select>
          </div>

          <div className="audience-control">
            <label>Gender</label>

            <select
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            >
              <option>All</option>
              <option>Men</option>
              <option>Women</option>
            </select>
          </div>

        </div>
      </div>

      <div className="audience-section">
        <div className="section-heading">
          <span>💡</span>

          <div>
            <strong>Interests</strong>
            <small>
              Select interests related to your customers
            </small>
          </div>
        </div>

        <div className="interest-list">
          {interests.map((interest) => (
            <button
              type="button"
              key={interest}
              className={`interest-chip ${
                selectedInterests.includes(interest)
                  ? "selected"
                  : ""
              }`}
              onClick={() => toggleInterest(interest)}
            >
              {selectedInterests.includes(interest) ? "✓ " : ""}
              {interest}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="advanced-toggle"
        onClick={() => setExpanded((previous) => !previous)}
      >
        <span>
          ⚙️ Advanced Audience Settings
        </span>

        <span>{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="advanced-panel">
          <div>
            <strong>📍 Location</strong>
            <span>Uses your selected campaign locations</span>
          </div>

          <div>
            <strong>📱 Platform</strong>
            <span>Instagram + Facebook</span>
          </div>

          <div>
            <strong>🧠 AI Optimization</strong>
            <span>Audience can be optimized after campaign performance 
data is available.</span>
          </div>
        </div>
      )}

      <div className="audience-summary">
        <div>
          <span>👥 Audience</span>
          <strong>
            {audienceTypes.find(
              (item) => item.id === audienceType
            )?.title}
          </strong>
        </div>

        <div>
          <span>🎂 Age</span>
          <strong>
            {ageMin}–{ageMax}
          </strong>
        </div>

        <div>
          <span>⚥ Gender</span>
          <strong>{gender}</strong>
        </div>

        <div>
          <span>💡 Interests</span>
          <strong>
            {selectedInterests.length || "All relevant"}
          </strong>
        </div>
      </div>

    </div>
  );
}

export default AudienceTargeting;
