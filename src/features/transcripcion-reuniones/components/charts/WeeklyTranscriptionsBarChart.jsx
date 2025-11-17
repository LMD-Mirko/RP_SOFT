import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function formatK(v) {
  return v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`
}

function useWeeklyData() {
  return useMemo(() => {
    const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
    const base = [7, 12, 12, 10, 6]
    return labels.map((label, i) => ({
      label,
      transcriptions: Math.max(0, base[i] + Math.round((Math.random() - 0.5) * 4)),
    }))
  }, [])
}

export default function WeeklyTranscriptionsBarChart() {
  const data = useWeeklyData()
  return (
    <div style={{ width: '100%', height: 340 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="barBlueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.6} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" />
          <YAxis tickFormatter={formatK} />
          <Tooltip formatter={(v) => Number(v).toLocaleString()} labelFormatter={(l) => l} />
          <Bar
            dataKey="transcriptions"
            name="Transcripciones por día"
            fill="url(#barBlueGradient)"
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
            animationBegin={200}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}