import { Tag } from 'antd'

const COLORS = {
  'En Progreso': 'green',
  'Finalizado': 'blue',
  'Pendiente': 'gold',
}

export function StatusTag({ status }) {
  return <Tag color={COLORS[status] || 'default'}>{status}</Tag>
}