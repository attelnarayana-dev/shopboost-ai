import { useState } from "react";
import "./AudienceDashboard.css";

function AudienceDashboard() {
  const [platform, setPlatform] = useState("All");
  const [audienceType, setAudienceType] = useState("All");

  const [audience] = useState([
    {
      id: 1,
      name: "Viewer",
      platform: "Instagram",
      action: "Watched Reel",
      engagement: "High",
      score: 92,
    },
    {
      id: 2,
      name: "Engaged User",
      platform: "Facebook",
      action: "Liked + Commented",
      engagement: "High",
      score: 96,
    },
    {
      id: 3,
      name: "Interested User",
      platform: "Instagram",
      action: "Liked Reel",
      engagement: "Medium",
      score: 74,
    },
    {
      id: 4,
      name: "Viewer",
      platform: "Facebook",
      action: "Watched Reel",
      engagement: "Low",
      score: 41,
    },
    {
      id: 5,
      name: "Engaged User",
      platform: "Instagram",
      action: "Commented",
      engagement: "High",
      score: 89,
    },
  ]);

  const filteredAudience = audience.filter((user) => {
    const platformMatch =
      platform === "All" || user.platform === platform;

    const typeMatch =
      audienceType === "All" ||
      user.engagement === audienceType;

    return platformMatch && typeMatch;
  });

  const highEngagement = audience.filter(
    (user) => user.engagement === "High"
  ).length;

  const totalViews = 12480;
  const totalLikes = 2840;
  const totalComments = 486;

  return (
    <div className="audience-page">

      <div className="audience-container">

        {/* HEADER */}

        <div className="audience-header">

          <div>
            <span>🎯 AUDIENCE & RETARGETING</span>

            <h1>మీ Social Media Audience</h1>

            <p>
              Facebook & Instagramలో మీ Contentతో Engage అయిన Audienceని
              ఒకే చోట చూడండి.
            </p>
          </div>

          <div className="connection-status">
            <span className="status-dot"></span>
            Meta Connection Ready
          </div>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">👀</div>
            <div>
              <span>Reel Views</span>
              <strong>{totalViews.toLocaleString()}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div>
              <span>Likes</span>
              <strong>{totalLikes.toLocaleString()}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div>
              <span>Comments</span>
              <strong>{totalComments.toLocaleString()}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div>
              <span>Highly Engaged</span>
              <strong>{highEngagement}</strong>
            </div>
          </div>

        </div>

        {/* RETARGETING CARD */}

        <div className="retarget-card">

          <div>

            <span>🎯 RETARGETING AUDIENCE</span>

            <h2>Highly Engaged Customers</h2>

            <p>
              Reelని Like, Comment లేదా ఎక్కువగా Watch చేసిన Audienceని
              Retargeting కోసం ఉపయోగించవచ్చు.
            </p>

          </div>

          <button>
            🔄 Create Audience
          </button>

        </div>

        {/* FILTERS */}

        <div className="audience-section">

          <div className="section-heading">

            <div>
              <h2>👥 Audience List</h2>
              <p>
                {filteredAudience.length} audience segments found
              </p>
            </div>

            <div className="filters">

              <select
                value={platform}
                onChange={(event) =>
                  setPlatform(event.target.value)
                }
              >
                <option value="All">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
              </select>

              <select
                value={audienceType}
                onChange={(event) =>
                  setAudienceType(event.target.value)
                }
              >
                <option value="All">All Engagement</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

            </div>

          </div>

          {/* TABLE */}

          <div className="audience-table-wrapper">

            <table className="audience-table">

              <thead>
                <tr>
                  <th>Audience</th>
                  <th>Platform</th>
                  <th>Action</th>
                  <th>Engagement</th>
                  <th>Score</th>
                  <th>Retarget</th>
                </tr>
              </thead>

              <tbody>

                {filteredAudience.map((user) => (

                  <tr key={user.id}>

                    <td>
                      <div className="user-cell">

                        <div className="user-avatar">
                          👤
                        </div>

                        <div>
                          <strong>{user.name}</strong>
                          <span>User #{user.id}</span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <span className="platform-badge">
                        {user.platform === "Instagram"
                          ? "📸 Instagram"
                          : "📘 Facebook"}
                      </span>
                    </td>

                    <td>{user.action}</td>

                    <td>

                      <span
                        className={`engagement-badge 
${user.engagement.toLowerCase()}`}
                      >
                        {user.engagement}
                      </span>

                    </td>

                    <td>
                      <strong>{user.score}%</strong>
                    </td>

                    <td>
                      <button className="retarget-button">
                        🎯 Add
                      </button>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AudienceDashboard;
