/**
 * Componente Tabs
 * Sistema de pestañas con contadores
 */

import styles from '../styles/Dashboard.module.css'

export function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className={styles.tabsContainer}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  )
}
