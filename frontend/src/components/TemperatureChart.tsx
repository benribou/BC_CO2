import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  data: { minute: number; temperature: number }[];
};

export default function TemperatureChart({ data }: Props) {
  return (
    <div style={{
      backgroundColor: '#1e1e2f',
      borderRadius: '1rem',
      padding: '1rem',
      color: '#ffffff',
      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
      width: '100%',
      marginBottom: '2rem'
    }}>
      <h2 style={{ marginBottom: '1rem', color: '#fff' }}>Évolution de la température</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00c6ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#0072ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="minute" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <CartesianGrid strokeDasharray="3 3" stroke="#2c2c3d" />
          <Tooltip contentStyle={{ backgroundColor: '#2c2c3d', border: 'none', color: '#fff' }} />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="#00c6ff"
            fillOpacity={1}
            fill="url(#colorTemp)"
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
