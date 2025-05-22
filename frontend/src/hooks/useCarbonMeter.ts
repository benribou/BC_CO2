// src/hooks/useCarbonMeter.ts
import { useState, useEffect, useRef } from 'react';
import { co2 as CO2 } from '@tgwf/co2';


export type CarbonStats = {
  energyJoules: number;
  co2Grams: number;
};

const ENERGY_PER_BYTE = 0.81; // J/byte

export function useCarbonMeter(pollInterval = 1000): CarbonStats {
  const [stats, setStats] = useState<CarbonStats>({
    energyJoules: 0,
    co2Grams: 0,
  });

  const meterRef = useRef(new CO2({ country: 'FR', year: new Date().getFullYear() }));
  const bytesSoFar = useRef(0);
  const gramsSoFar = useRef(0);

  useEffect(() => {
    const realFetch = window.fetch.bind(window);

    window.fetch = async (...args) => {
      const response = await realFetch(...args);
      const buffer = await response.clone().arrayBuffer();
      const bytes = buffer.byteLength;

      bytesSoFar.current += bytes;

      // perByte peut renvoyer un number ou un objet CO2EstimateComponents
      const raw = meterRef.current.perByte(bytes, false);
      const delta = typeof raw === 'number'
        ? raw
        : // si objet, on prend la prop grams ou co2
          ('grams' in raw ? raw.grams : ('co2' in raw ? raw.co2 : 0));

      gramsSoFar.current += delta;
      return response;
    };

    const id = setInterval(() => {
      const joules = bytesSoFar.current * ENERGY_PER_BYTE;
      setStats({ energyJoules: joules, co2Grams: gramsSoFar.current });
    }, pollInterval);

    return () => {
      clearInterval(id);
      window.fetch = realFetch;
    };
  }, [pollInterval]);

  return stats;
}
