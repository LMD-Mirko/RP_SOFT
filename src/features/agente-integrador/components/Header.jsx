import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ selectedAgent = 'integrador', onAgentChange }) {
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

  const currentAgent = agents.find(agent => agent.id === selectedAgent) || agents[0];

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

  const handleAgentSelect = (agentId) => {
    if (onAgentChange) {
      onAgentChange(agentId);
    }
    setIsOpen(false);
  };

  return (
    <div className={styles.headerContainer} ref={dropdownRef}>
      <button
        className={styles.modelSelector}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.modelText}>{currentAgent.title}</span>
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
              onClick={() => handleAgentSelect(agent.id)}
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
