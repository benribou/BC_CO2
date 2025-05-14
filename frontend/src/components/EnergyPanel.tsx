type Props = {
  energyJoules: number;
  co2Grams: number;
};

export default function EnergyPanel({ energyJoules, co2Grams }: Props) {
  return (
    <div style={{
      backgroundColor: '#1e1e2f',
      borderRadius: '1rem',
      padding: '1.5rem',
      color: '#ffffff',
      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
      width: '100%',
      maxWidth: 800
    }}>
      <h2 style={{ marginBottom: '1rem' }}>Impact Écologique</h2>
      <p>⚡ Énergie consommée : <strong>{energyJoules.toFixed(2)} J</strong></p>
      <p>🌍 Émissions CO₂ : <strong>{co2Grams.toFixed(2)} g</strong></p>
    </div>
  );
}
