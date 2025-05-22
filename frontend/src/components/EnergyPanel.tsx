// src/components/EnergyPanel.tsx
import React from 'react';

type Props = {
  title: string;
  energyKWh: number;
  co2Grams: number;
  accentColor?: string;
};

export default function EnergyPanel({
  title,
  energyKWh,
  co2Grams,
  accentColor = '#00c6ff',
}: Props) {
  return (
    <div style={{
      backgroundColor: '#1e1e2f',
      borderRadius: '1rem',
      padding: '1.5rem',
      color: '#ffffff',
      boxShadow: `0 0 20px ${accentColor}33`,
      border: `2px solid ${accentColor}`,
      width: '100%',
      maxWidth: 400
    }}>
      <h2 style={{ color: accentColor, marginBottom: '1rem' }}>{title}</h2>
      <p>⚡ Énergie consommée : <strong>{energyKWh.toFixed(4)} kWh</strong></p>
      <p>🌍 Émissions CO₂ : <strong>{co2Grams.toFixed(4)} g</strong></p>
    </div>
  );
}
