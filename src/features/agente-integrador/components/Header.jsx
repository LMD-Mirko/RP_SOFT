import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const agents = [
    { id: 'integrador', title: 'AGENTE INTEGRADOR' },
    { id: 'seleccion', title: 'AGENTE SELECCION PRACTICANTES' },
    { id: 'transcripcion', title: 'AGENTE TRANSCRIPCION REUNIONES' },
    { id: 'tareas', title: 'AGENTE GESTION TAREAS' },
    { id: 'asistencia', title: 'AGENTE ASISTENCIA HORARIOS' },
    { id: 'evaluacion', title: 'AGENTE EVALUACION 360' },
    { id: 'convenios', title: 'AGENTE CONVENIOS CONSTANCIAS' },
  ];

  const [selectedAgent, setSelectedAgent] = useState('integrador');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.headerContainer} ref={dropdownRef}>
      <button
        className={styles.modelSelector}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.modelText}>AGENTE INTEGRADOR</span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.dropdownSectionTitle}>MODELOS DISPONIBLES</div>
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`${styles.dropdownItem} ${selectedAgent === agent.id ? styles.dropdownItemActive : ''}`}
              onClick={() => {
                setSelectedAgent(agent.id);
                setIsOpen(false);
              }}
            >
              <div className={styles.itemContent}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemTitle}>{agent.title}</span>
                  {selectedAgent === agent.id && <span className={styles.checkmark}>✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
