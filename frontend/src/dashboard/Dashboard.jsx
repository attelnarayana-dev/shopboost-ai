import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          🚀
          <div>
            <h1>షాప్‌బూస్ట్ AI</h1>
            <p>మీ షాప్ మార్కెటింగ్ సహాయకుడు</p>
          </div>
        </div>

        <nav>
          <button className="active">🏠 డాష్‌బోర్డ్</button>
          <button>🏪 నా షాప్</button>
          <button>🎁 ఆఫర్లు</button>
          <button>🎨 పోస్టర్లు</button>
          <button>🎬 రీల్స్</button>
          <button>🎙️ వాయిస్</button>
          <button>📱 Facebook</button>
          <button>📸 Instagram</button>
          <button>🚀 ప్రకటనలు</button>
          <button>🎯 రిటార్గెటింగ్</button>
          <button>📁 లీడ్స్</button>
          <button>💬 WhatsApp</button>
          <button>📊 ఫలితాలు</button>
        </nav>

        <button className="settings">⚙️ సెట్టింగ్స్</button>
      </aside>

      <main className="content">
        <header>
          <div>
            <p>స్వాగతం 👋</p>
            <h2>మీ షాప్‌ను మరింతగా పెంచుదాం!</h2>
          </div>

          <div className="profile">
            <span>👤</span>
            <div>
              <strong>షాప్ యజమాని</strong>
              <small>నా ఖాతా</small>
            </div>
          </div>
        </header>

        <section className="hero">
          <div className="hero-content">
            <span className="badge">✨ AI మార్కెటింగ్</span>

            <h2>
              మీరు మాట్లాడండి...
              <br />
              <strong>మీ షాప్ మార్కెటింగ్ మేము సులభం చేస్తాం.</strong>
            </h2>

            <p>
              ఆఫర్ చెప్పండి. పోస్టర్, రీల్, వాయిస్ ఓవర్
              మరియు ప్రకటన కోసం కావాల్సినవి సిద్ధం చేసుకోండి.
            </p>

            <div className="buttons">
              <button className="primary">
                🎙️ మాట్లాడి ఆఫర్ సృష్టించండి
              </button>

              <button className="secondary">
                🎁 కొత్త ఆఫర్
              </button>
            </div>
          </div>

          <div className="phone">
            <div className="phone-title">షాప్‌బూస్ట్ AI</div>

            <div className="reel">
              🎬
              <strong>మీ ఆఫర్</strong>
              <small>రీల్ సిద్ధం చేయండి</small>
            </div>

            <div className="voice">🎙️ AI Voice</div>
          </div>
        </section>

        <section>
          <div className="section-title">
            <h3>త్వరిత చర్యలు</h3>
            <p>మీకు కావాల్సిన పని వెంటనే ప్రారంభించండి</p>
          </div>

          <div className="quick-grid">
            <button className="card">
              <span>🎁</span>
              <div>
                <h4>కొత్త ఆఫర్</h4>
                <p>మీ ఆఫర్ వివరాలు ఇవ్వండి</p>
              </div>
              <b>→</b>
            </button>

            <button className="card">
              <span>🎙️</span>
              <div>
                <h4>మాట్లాడి సృష్టించండి</h4>
                <p>మాట్లాడితే ఫారమ్ ఆటోమేటిక్‌గా నిండుతుంది</p>
              </div>
              <b>→</b>
            </button>

            <button className="card">
              <span>🎬</span>
              <div>
                <h4>రీల్ తయారు చేయండి</h4>
                <p>Facebook & Instagram కోసం</p>
              </div>
              <b>→</b>
            </button>

            <button className="card">
              <span>🚀</span>
              <div>
                <h4>ప్రకటన ప్రారంభించండి</h4>
                <p>Facebook & Instagram Reels</p>
              </div>
              <b>→</b>
            </button>
          </div>
        </section>

        <section>
          <div className="section-title">
            <h3>మీ మార్కెటింగ్</h3>
            <p>ఈ నెల పనితీరు</p>
          </div>

          <div className="stats">
            <div>
              <span>🎬</span>
              <p>యాక్టివ్ ప్రచారాలు</p>
              <strong>0</strong>
            </div>

            <div>
              <span>👥</span>
              <p>కొత్త లీడ్స్</p>
              <strong>0</strong>
            </div>

            <div>
              <span>👀</span>
              <p>రీల్ వీక్షణలు</p>
              <strong>0</strong>
            </div>

            <div>
              <span>💬</span>
              <p>WhatsApp లీడ్స్</p>
              <strong>0</strong>
            </div>
          </div>
        </section>

        <section className="empty">
          <div>📢</div>
          <h3>ఇంకా ప్రచారం ప్రారంభించలేదు</h3>
          <p>
            మీ మొదటి ఆఫర్ సృష్టించి, మీ షాప్ కోసం రీల్ ప్రకటన ప్రారంభించండి.
          </p>

          <button className="primary">
            🎁 మొదటి ఆఫర్ సృష్టించండి
          </button>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
