import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from 'recharts'

function formatK(v) {
  return v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
}

function AnimatedAreaChart({ data }) {
  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.06} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={formatK} />
          <Tooltip formatter={(v) => Number(v).toLocaleString()} labelFormatter={(l) => l} />
          <Area
            type="monotone"
            dataKey="transcriptions"
            name="Transcripciones"
            stroke="#3b82f6"
            fill="url(#blueGradient)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={true}
            animationBegin={150}
            animationDuration={1200}
            animationEasing="ease-in-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnimatedAreaChart