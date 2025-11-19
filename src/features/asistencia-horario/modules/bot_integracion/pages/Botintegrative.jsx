import styles from './Botintegrative.module.css'
import {
  Server, Clock, Zap, TrendingUp,
  Wifi, Calendar, Signal, Users,
  Hash, CheckCircle, Smartphone
} from 'lucide-react'

// Datos para las tarjetas
const summaryData = [
  {
    id: 1,
    label: 'Servidores Conectados',
    value: '5',
    icon: <Server size={20} />,
    color: 'blue'
  },
  {
    id: 2,
    label: 'Última Sincronización',
    value: '5 min',
    icon: <Clock size={20} />,
    color: 'purple'
  },
  {
    id: 3,
    label: 'Eventos Procesado hoy',
    value: '1,230',
    icon: <Zap size={20} />,
    color: 'green'
  },
  {
    id: 4,
    label: 'Uptime',
    value: '99.8%',
    icon: <TrendingUp size={20} />,
    color: 'orange'
  }
];

const statusData = [
  {
    id: 1,
    label: 'Estado',
    value: 'Operativo',
    badge: 'Online',
    icon: <Wifi size={18} />,
    color: 'green'
  },
  {
    id: 2,
    label: 'Uptime',
    value: '15d 8h 23m',
    badge: '24/7',
    icon: <Calendar size={18} />,
    color: 'blue'
  },
  {
    id: 3,
    label: 'Latencia',
    value: '45 ms',
    badge: 'Rápido',
    icon: <Zap size={18} />,
    color: 'purple'
  },
  {
    id: 4,
    label: 'Última conexión',
    value: 'Hace 2 min',
    badge: 'Estable',
    icon: <Signal size={18} />,
    color: 'lightOrange'
  }
];

const serverData = [
  { id: 1, name: 'RPSOTF', members: 87, channels: 12, icon: <Server size={18} />, color: 'blue' },
  { id: 2, name: 'RPSF', members: 87, channels: 12, icon: <Server size={18} />, color: 'green' },
  { id: 3, name: 'RPSF', members: 87, channels: 12, icon: <Smartphone size={18} />, color: 'pink' },
  { id: 4, name: 'RPSF', members: 87, channels: 12, icon: <Users size={18} />, color: 'orange' },
  { id: 5, name: 'RPSF', members: 87, channels: 12, icon: <Users size={18} />, color: 'orange' },
];

export function Botintegrative() {
  return (
    <div className={styles.botPage}>
      {/* --- Encabezado --- */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Bot & Integración</h1>
          <p className={styles.subtitle}>Gestión y monitoreo del bot de Discord en los 5 servidores</p>
        </div>
      </header>

      {/* --- Resumen Global --- */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Resumen Global</h2>
            <div className={styles.statusBadgeWrapper}>
              <span className={styles.activeDot}></span>
              Activo
            </div>
          </div>
          <div className={styles.summaryGrid}>
            {summaryData.map(item => (
              <div key={item.id} className={styles.summaryCard}>
                <div className={`${styles.summaryIcon} ${styles[item.color]}`}>
                  {item.icon}
                </div>
                <div className={styles.summaryContent}>
                  <div className={styles.summaryValue}>{item.value}</div>
                  <div className={styles.summaryLabel}>{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Estado en Tiempo Real --- */}
      <section className={styles.section}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitle}>Estado del Bot en Tiempo Real</h2>
          <div className={styles.statusGrid}>
            {statusData.map(item => (
              <div key={item.id} className={`${styles.statusCard} ${styles[item.color]}`}>
                <div className={styles.statusHeader}>
                  {item.icon}
                  <span>{item.label}</span>
                  <span className={styles.statusBadge}>{item.badge}</span>
                </div>
                <div className={styles.statusValue}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Lista de Servidores --- */}
      <section className={styles.section}>
        <div className={styles.serverGrid}>
          {serverData.map(server => (
            <div key={server.id} className={styles.serverCard}>
              <div className={`${styles.serverHeader} ${styles[server.color]}`}>
                {server.icon}
                <span>{server.name}</span>
                <CheckCircle size={18} className={styles.checkIcon} />
              </div>
              <div className={styles.serverBody}>
                <div className={styles.serverRow}>
                  <div className={styles.serverInfo}>
                    <Users size={16} />
                    <span>Miembros</span>
                  </div>
                  <strong>{server.members}</strong>
                </div>
                <div className={styles.serverRow}>
                  <div className={styles.serverInfo}>
                    <Hash size={16} />
                    <span>Canales</span>
                  </div>
                  <strong>{server.channels}</strong>
                </div>
              </div>
              <div className={styles.serverFooter}>
                <select className={styles.statusSelect}>
                  <option value="conectado">Conectado</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Botintegrative