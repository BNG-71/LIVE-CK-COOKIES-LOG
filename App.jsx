import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

const App = () => {
  const [uids, setUids] = useState('');
  const [liveUids, setLiveUids] = useState([]);
  const [deadUids, setDeadUids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const toggleTheme = () => setDarkMode(!darkMode);

  const get_uid = (data) => {
    if (data && data.includes('|')) return data.split('|')[0];
    return data;
  };

  const startChecking = async () => {
    setLoading(true);
    setLiveUids([]);
    setDeadUids([]);

    const lines = uids.trim().split('\n').filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const uid = get_uid(lines[i]);
      try {
        const res = await fetch('https://bng71-api.up.railway.app/api/check-live-uids', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid })
        });
        const result = await res.json();
        if (result.live) {
          setLiveUids(prev => [...prev, lines[i]]);
        } else {
          setDeadUids(prev => [...prev, lines[i]]);
        }
      } catch {
        setDeadUids(prev => [...prev, lines[i]]);
      }
    }
    setLoading(false);
  };

  const downloadTextFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="header">
        <img src={logo} alt="BNG Logo" className="logo" />
        <h1 className="title">BNG71 - Facebook UID Live Checker</h1>
        <p className="subtitle">By Md Jihad Hasan | Team: BNG-৭১</p>
        <button className="toggle-btn" onClick={toggleTheme}>
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      <main className="main">
        <textarea
          className="textarea"
          rows="8"
          placeholder="Enter UIDs (one per line or uid|pass format)..."
          value={uids}
          onChange={e => setUids(e.target.value)}
        ></textarea>

        <button className="check-btn" onClick={startChecking} disabled={loading}>
          {loading ? 'Checking...' : '🔥 Start Live Check'}
        </button>

        <div className="results">
          <div className="box">
            <h3>✅ Live UIDs ({liveUids.length})</h3>
            <pre>{liveUids.join('\n')}</pre>
            <button onClick={() => navigator.clipboard.writeText(liveUids.join('\n'))}>📋 Copy Live UIDs</button>
            <button onClick={() => downloadTextFile('live_uids.txt', liveUids.join('\n'))}>⬇️ Download Live UIDs</button>
          </div>

          <div className="box">
            <h3>❌ Dead UIDs ({deadUids.length})</h3>
            <pre>{deadUids.join('\n')}</pre>
            <button onClick={() => navigator.clipboard.writeText(deadUids.join('\n'))}>📋 Copy Dead UIDs</button>
            <button onClick={() => downloadTextFile('dead_uids.txt', deadUids.join('\n'))}>⬇️ Download Dead UIDs</button>
          </div>
        </div>
      </main>

      <footer className="footer">
        &copy; 2025 <strong>Md Jihad Hasan</strong> — Team BNG-৭১ <br />
        <a href="mailto:mdjihadhasanbd177@gmail.com">📧 Email</a> |
        <a href="https://github.com/BNG-71" target="_blank" rel="noreferrer">🐱 GitHub</a> |
        <a href="https://facebook.com/mdjihadhossainbd.71" target="_blank" rel="noreferrer">📘 Facebook</a>
      </footer>
    </div>
  );
};

export default App;
