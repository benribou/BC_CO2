import { useState } from 'react';
import TemperatureChart from './components/TemperatureChart';
import EnergyPanel from './components/EnergyPanel';

function App() {
  const [data, setData] = useState<{ minute: number; temperature: number }[]>([]);
  const [energy, setEnergy] = useState<{ energyJoules: number; co2Grams: number } | null>(null);

  const handleFakePrediction = () => {
    const simulatedTemps = Array.from({ length: 30 }, (_, i) => ({
      minute: i,
      temperature: 25 + Math.sin(i / 4) * 3 + i * 0.1,
    }));

    const simulatedEnergy = {
      energyJoules: 5 + Math.random() * 2,
      co2Grams: 1 + Math.random() * 0.5,
    };

    setData(simulatedTemps);
    setEnergy(simulatedEnergy);
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#12121b',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box',
    }}>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>🌡️ Simulation de température</h1>

      <button
        onClick={handleFakePrediction}
        style={{
          backgroundColor: '#00c6ff',
          color: '#fff',
          border: 'none',
          padding: '0.7rem 1.5rem',
          borderRadius: '999px',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 0 15px rgba(0,198,255,0.4)',
          marginBottom: '2rem'
        }}
      >
        Lancer la simulation
      </button>

      <div style={{ width: '100%', maxWidth: '1200px', padding: '0 1rem' }}>
        {data.length > 0 && (
          <>
            <TemperatureChart data={data} />
            {energy && <EnergyPanel {...energy} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
