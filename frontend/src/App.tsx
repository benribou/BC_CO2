// src/App.tsx
import { useState, useEffect } from 'react';
import TemperatureChart from './components/TemperatureChart';
import EnergyPanel from './components/EnergyPanel';
import { useCarbonMeter } from './hooks/useCarbonMeter';

type TempPoint = { minute: number; temperature: number };
type BackendStats = { energyJoules: number; co2Grams: number };

export default function App() {
  const [data, setData] = useState<TempPoint[]>([]);
  const [backendStats, setBackendStats] = useState<BackendStats | null>(null);
  const [loading, setLoading] = useState(false);

  // stats front
  const { energyJoules: frontJ, co2Grams: frontCO2 } = useCarbonMeter(500);

  // génère un jeu « neutre » au montage
  useEffect(() => {
    setData(Array.from({ length: 30 }, (_, i) => ({
      minute: i,
      temperature: 25,
    })));
  }, []);

// src/App.tsx (extrait de handleLaunch)
const handleLaunch = async () => {
  setLoading(true);
  try {
    const res = await fetch('/api/simulate', { method: 'POST' });
    if (!res.ok) throw new Error('Not implemented');
    const json = await res.json() as {
      temperatures: TempPoint[];
      energyJoules: number;
      co2Grams: number;
    };
    setData(json.temperatures);
    setBackendStats({
      energyJoules: json.energyJoules,
      co2Grams: json.co2Grams,
    });

  } catch (err) {
    console.warn('Backend simulate not available, falling back to mock', err);

    // --- MOCK ---
    await new Promise((r) => setTimeout(r, 2000)); 
    const fakeTemps = Array.from({ length: 30 }, (_, i) => ({
      minute: i,
      temperature: 25 + Math.cos(i / 5) * 2,
    }));
    setData(fakeTemps);
    setBackendStats({
      energyJoules: 1200 + Math.random() * 400,
      co2Grams: 0.8 + Math.random() * 0.4,
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#12121b',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem',
      boxSizing: 'border-box',
    }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>
        🌡️ Simulation de température
      </h1>

      <button
        onClick={handleLaunch}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#555' : '#00c6ff',
          color: '#fff',
          padding: '0.7rem 1.5rem',
          borderRadius: '999px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '2rem',
          position: 'relative',
        }}
      >
        {loading
          ? <span style={{
              width: '1em', height: '1em', border: '2px solid #fff',
              borderTop: '2px solid transparent', borderRadius: '50%',
              display: 'inline-block', animation: 'spin 1s linear infinite'
            }} />
          : 'Lancer la simulation'}
      </button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
      `}</style>

      <div style={{
        width: '100%', maxWidth: 1200, padding: '0 1rem',
        display: 'grid', gridTemplateColumns: '1fr', gap: '2rem'
      }}>
        <TemperatureChart data={data} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: backendStats ? '1fr 1fr' : '1fr',
          gap: '1rem'
        }}>
          <EnergyPanel
            title="Front-end"
            energyJoules={frontJ}
            co2Grams={parseFloat(frontCO2.toFixed(4))}
            accentColor="#00c6ff"
          />

          {backendStats && (
            <EnergyPanel
              title="Back-end"
              energyJoules={backendStats.energyJoules}
              co2Grams={parseFloat(backendStats.co2Grams.toFixed(4))}
              accentColor="#ff6b6b"
            />
          )}
        </div>
      </div>
    </div>
  );
}
