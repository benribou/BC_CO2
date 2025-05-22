// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import TemperatureChart from './components/TemperatureChart';
import EnergyPanel from './components/EnergyPanel';
import { useCarbonMeter } from './hooks/useCarbonMeter';

type TempPoint = { minute: number; temperature: number };
type BackendStats = { energyKWh: number; co2Grams: number };

export default function App() {
  const [data, setData] = useState<TempPoint[]>([]);
  const [backendStats, setBackendStats] = useState<BackendStats | null>(null);
  const [frontLastKWh, setFrontLastKWh] = useState(0);
  const [frontLastCO2, setFrontLastCO2] = useState(0);
  const [loading, setLoading] = useState(false);

  // FRONT cumulé depuis le montage (en Joules et en CO₂)
  const { energyJoules: frontCumJ, co2Grams: frontCumCO2 } = useCarbonMeter(500);
  const prevFrontJ = useRef<number>(0);
  const prevFrontCO2 = useRef<number>(0);

  // donne un jeu de données neutre au démarrage
  useEffect(() => {
    setData(Array.from({ length: 30 }, (_, i) => ({ minute: i, temperature: 25 })));
  }, []);

  const handleLaunch = async () => {
    setLoading(true);

    try {
      // 1) Récupération des températures
      // const simRes = await fetch('http://localhost:8000/api/simulate', { method: 'POST' });
      // if (!simRes.ok) throw new Error('Simulation endpoint not ready');
      // const { temperatures } = (await simRes.json()) as { temperatures: TempPoint[] };
      // setData(temperatures);

      // 2) Récupération des émissions back
      const emisRes = await fetch('http://localhost:8000/emissions');
      if (!emisRes.ok) throw new Error('Emissions endpoint error');
      const [e] = (await emisRes.json()) as Array<{
        energy_consumed: string; // kWh
        emissions: string;       // kg CO₂e
      }>;

      const beKWh = parseFloat(e.energy_consumed);
      const beCO2 = parseFloat(e.emissions) * 1000;

      setBackendStats({ energyKWh: beKWh, co2Grams: beCO2 });
    } catch (err) {
      console.error('Simulation/emissions failed:', err);
    } finally {
      
      const deltaJ = frontCumJ - prevFrontJ.current;
      setFrontLastKWh(deltaJ / 3_600_000);  // 3.6e6 J = 1 kWh
      setFrontLastCO2(frontCumCO2 - prevFrontCO2.current);

      prevFrontJ.current = frontCumJ;
      prevFrontCO2.current = frontCumCO2;
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100vw', minHeight: '100vh',
      backgroundColor: '#12121b', color: '#fff',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '2rem',
      boxSizing: 'border-box'
    }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>
        🌡️ Simulation de température
      </h1>

      <button
        onClick={handleLaunch}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#555' : '#00c6ff',
          color: '#fff', padding: '0.7rem 1.5rem',
          borderRadius: '999px', border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '2rem'
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
        width: '100%', maxWidth: 1200,
        padding: '0 1rem',
        display: 'grid', gridTemplateColumns: '1fr', gap: '2rem'
      }}>
        <TemperatureChart data={data} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))',
          gap: '1rem'
        }}>
          <EnergyPanel
            title="Front-end"
            energyKWh={frontLastKWh}
            co2Grams={frontLastCO2}
            accentColor="#00c6ff"
          />
          {backendStats && (
            <EnergyPanel
              title="Back-end"
              energyKWh={backendStats.energyKWh}
              co2Grams={backendStats.co2Grams}
              accentColor="#ff6b6b"
            />
          )}
        </div>
      </div>
    </div>
  );
}
