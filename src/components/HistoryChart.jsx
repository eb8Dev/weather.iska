import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

export default function HistoryChart({ historyData }) {
  if (!historyData || !historyData.hourly) return null;

  const { time, temperature_2m } = historyData.hourly;
  
  // Combine time and temperature arrays into an array of objects for Recharts
  // We'll filter to show only 1 point every 6 hours to keep the graph clean
  const chartData = time.map((t, index) => ({
    time: t,
    temp: temperature_2m[index],
  })).filter((_, index) => index % 6 === 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-white/20 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <p className="text-white/70 text-sm mb-1">{format(parseISO(label), 'MMM d, h:mm a')}</p>
          <p className="text-white font-bold text-lg">{payload[0].value.toFixed(1)}°C</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 glass p-6 rounded-3xl animate-in fade-in duration-700">
      <div className="mb-6">
        <h3 className="text-xl font-medium text-white/90">7-Day Temperature History</h3>
        <p className="text-sm text-white/60">Historical temperature trend across recent days</p>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              tickFormatter={(tick) => format(parseISO(tick), 'MMM d')}
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              minTickGap={30}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="temp" 
              stroke="#60a5fa" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#tempGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
