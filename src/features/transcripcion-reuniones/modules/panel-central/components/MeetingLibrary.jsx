import { useMemo, useState } from 'react'
import { Collapse, Input, List } from 'antd'
import { StatusTag } from './StatusTag'
import styles from '../pages/PanelCentralPage.module.css'

const dataSource = [
  {
    key: 'hoy',
    title: 'Hoy',
    dateLabel: '16 de octubre del 2025',
    roomsCount: 6,
    transcriptsCount: 9,
    items: [
      { title: 'Urbany 1', status: 'En Progreso' },
      { title: 'Av1', status: 'En Progreso' },
      { title: 'PHP Integracion', status: 'Finalizado' },
      { title: 'High level', status: 'Finalizado' },
      { title: 'Urbany 2', status: 'Finalizado' },
    ],
  },
  {
    key: 'ayer',
    title: 'Ayer',
    dateLabel: '18 de octubre del 2025',
    roomsCount: 5,
    transcriptsCount: 6,
    items: [
      { title: 'Revisión Front', status: 'En Progreso' },
      { title: 'Planning Equipo A', status: 'Finalizado' },
      { title: 'Soporte Cliente', status: 'Finalizado' },
    ],
  },
]

export function MeetingLibrary() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return dataSource
    return dataSource.map(section => ({
      ...section,
      items: section.items.filter(item => item.title.toLowerCase().includes(q)),
    }))
  }, [query])

  return (
    <div className={styles.libraryWrapper}>
      <div className={styles.libraryHeader}>
        <Input.Search
          placeholder="Buscar sala ..."
          allowClear
          onChange={(e) => setQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <Collapse defaultActiveKey={[filtered[0]?.key]}>
        {filtered.map(section => (
          <Collapse.Panel
            header={(
              <div className={styles.sectionHeader}>
                <div>
                  <div className={styles.sectionTitle}>{section.title}</div>
                  <div className={styles.sectionDate}>{section.dateLabel}</div>
                </div>
                <div className={styles.sectionSummary}>
                  <span>{section.roomsCount} Salas en total</span>
                  <span>{section.transcriptsCount} Transcripciones en total</span>
                </div>
              </div>
            )}
            key={section.key}
          >
            <List
              dataSource={section.items}
              renderItem={(item) => (
                <List.Item>
                  <div className={styles.listItem}>
                    <span>{item.title}</span>
                    <StatusTag status={item.status} />
                  </div>
                </List.Item>
              )}
            />
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  )
}