import { useState, useEffect, useRef } from 'react';
import TemperatureChart from './components/TemperatureChart';
import EnergyPanel from './components/EnergyPanel';
import { useCarbonMeter } from './hooks/useCarbonMeter';

type TempPoint = { minute: number; temperature: number };
type BackendMetrics = {
  cpu_usage_kWh: number;
  gpu_usage_kWh: number;
  ram_energy_kWh: number;
  energy_consumed: number;
  exec_time_in_seconds: number;
  result: number[];
};

export default function App() {
  const [data, setData] = useState<TempPoint[]>([]);
  const [backendMetrics, setBackendMetrics] = useState<BackendMetrics | null>(null);
  const [frontLastKWh, setFrontLastKWh] = useState(0);
  const [frontLastCO2, setFrontLastCO2] = useState(0);
  const [loading, setLoading] = useState(false);

  const { energyJoules: frontCumJ, co2Grams: frontCumCO2 } = useCarbonMeter(500);
  const prevFrontJ = useRef<number>(0);
  const prevFrontCO2 = useRef<number>(0);

  // Initialise un jeu de températures neutre
  // useEffect(() => {
  //   setData(Array.from({ length: 30 }, (_, i) => ({ minute: i, temperature: 25 })));
  // }, []);

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/compute', { method: 'POST' });
      if (!res.ok) throw new Error('Compute endpoint not ready');
      const json = (await res.json()) as BackendMetrics;

      // Mettre à jour le graphique avec les températures reçues
      const temps: TempPoint[] = json.result.map((temp, i) => ({
        minute: i,
        temperature: temp,
      }));
      setData(temps);

      setBackendMetrics(json);
    } catch (err) {
      console.error('Compute failed:', err);
    } finally {
      // Calcul du delta front en Joules → kWh
      const deltaJ = frontCumJ - prevFrontJ.current;
      setFrontLastKWh(deltaJ / 3_600_000);  // 1 kWh = 3.6e6 J
      setFrontLastCO2(frontCumCO2 - prevFrontCO2.current);

      prevFrontJ.current = frontCumJ;
      prevFrontCO2.current = frontCumCO2;
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
        🌡️ Simulation de température & Émissions
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
        }}
      >
        {loading
          ? <span style={{
              width: '1em',
              height: '1em',
              border: '2px solid #fff',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 1s linear infinite',
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
        width: '100%',
        maxWidth: 1200,
        padding: '0 1rem',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
      }}>
        {/* Graphique des températures */}
        <TemperatureChart data={data} />

        {/* Panneau envoi Front-end */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))',
          gap: '1rem',
        }}>
          <EnergyPanel
            title="Front-end (dernière sim.)"
            energyKWh={frontLastKWh}
            co2Grams={frontLastCO2}
            accentColor="#00c6ff"
          />
        </div>

        {backendMetrics && (
          <div style={{
            backgroundColor: '#1e1e2f',
            borderRadius: '1rem',
            padding: '1.5rem',
            color: '#ffffff',
            boxShadow: '0 0 20px rgba(255,107,107,0.3)',
            marginTop: '2rem',
            width: '100%',
          }}>
            <h2 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Détails Back-end</h2>
            <p>🖥️ CPU Usage : <strong>{backendMetrics.cpu_usage_kWh.toFixed(6)} kWh</strong></p>
            <p>🎮 GPU Usage : <strong>{backendMetrics.gpu_usage_kWh.toFixed(6)} kWh</strong></p>
            <p>🧠 RAM Energy : <strong>{backendMetrics.ram_energy_kWh.toFixed(6)} kWh</strong></p>
            <p>⚡ Énergie consommée : <strong>{backendMetrics.energy_consumed.toFixed(6)} kWh</strong></p>
            <p>⏱️ Exec Time : <strong>{backendMetrics.exec_time_in_seconds.toFixed(3)} s</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}
