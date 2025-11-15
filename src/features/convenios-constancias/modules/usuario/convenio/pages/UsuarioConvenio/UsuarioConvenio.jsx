import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './UsuarioConvenio.module.css'
import { Tag, Button } from 'antd'

export function UsuarioConvenio() {
  const usuario = useMemo(() => ({ nombre: 'Carlos Vivez' }), [])
  const STATUS = { NO_INICIADO: 'no_iniciado', INICIADO: 'iniciado' }
  const [estado, setEstado] = useState(STATUS.NO_INICIADO)
  const navigate = useNavigate()

  const statusLabel = estado === STATUS.INICIADO ? 'Iniciado' : 'No Iniciado'
  const statusColor = estado === STATUS.INICIADO ? 'success' : 'warning'
  const statusClass =
    estado === STATUS.INICIADO ? styles.pulseSuccess : styles.pulseWarn

  const iniciarConvenio = () => {
    // mock: transición simple de estado con animación
    setEstado(STATUS.INICIADO)
    // navegar a la carga de documentos
    navigate('/convenios-constancias/usuario/convenio/carga-documentos')
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Convenios de Prácticas</h1>
        <p className={styles.subtitle}>
          Sistema automatizado de gestión de convenios
        </p>
      </header>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            Bienvenido, {usuario.nombre}
          </h2>

          <Tag
            className={`${styles.statusTag} ${statusClass}`}
            color={statusColor}
          >
            Estado: {statusLabel}
          </Tag>
        </div>

        <p className={styles.description}>
          Inicia el proceso de tu convenio de prácticas profesionales. Este
          sistema te guiará paso a paso para completar toda la documentación
          necesaria.
        </p>

        <div className={styles.list}>
          <div className={styles.listTitle}>Documentos Requeridos</div>
          <ul className={styles.ul}>
            <li>Convenio de Prácticas (formato institucional)</li>
            <li>Documento PEA (Plan de Entrenamiento y Aprendizaje)</li>
            <li>Carta de Presentación de la empresa</li>
          </ul>
        </div>

        <div className={styles.actions}>
          <Button
            type="primary"
            size="large"
            className={styles.startButton}
            onClick={iniciarConvenio}
            disabled={estado === STATUS.INICIADO}
          >
            Iniciar Convenio
          </Button>
        </div>
      </div>
    </section>
  )
}
