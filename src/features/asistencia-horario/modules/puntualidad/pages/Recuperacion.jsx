import { Clock, CheckCircle, Calendar, Trello, ListChecks, ExternalLink } from "lucide-react";

export default function Recuperacion() {
  const recoveries = [
    {
      id: 1,
      practitioner: "Pedro Sánchez",
      server: "MiniBootcamp",
      hoursToRecover: 6,
      hoursRecovered: 4,
      linkedTicket: "TKT-1234",
      scheduledDate: "2025-01-08",
      scheduledTime: "3:00 p.m. - 7:00 p.m.",
      status: "in-progress",
      evidenceType: "trello",
      trelloCard: {
        name: "Implementar módulo de autenticación",
        list: "Recuperación",
        progress: 75,
        url: "https://trello.com/c/abc123",
        completedAt: null,
      },
      maxDailyHours: 4,
    },
    {
      id: 2,
      practitioner: "María González",
      server: "Laboratorios",
      hoursToRecover: 6,
      hoursRecovered: 0,
      linkedTicket: "TKT-1235",
      scheduledDate: "2025-01-11",
      scheduledTime: "Sábado 9:00 a.m. - 1:00 p.m.",
      status: "scheduled",
      evidenceType: "checklist",
      checklist: {
        total: 5,
        completed: 0,
        items: [
          { id: 1, text: "Revisar documentación de API", done: false },
          { id: 2, text: "Implementar endpoints REST", done: false },
          { id: 3, text: "Escribir tests unitarios", done: false },
          { id: 4, text: "Realizar code review", done: false },
          { id: 5, text: "Documentar cambios", done: false },
        ],
        assignedBy: "Carlos Ruiz (Scrum Master)",
      },
      maxDailyHours: 4,
    },
    {
      id: 3,
      practitioner: "Jorge Vega",
      server: "Rpsoft",
      hoursToRecover: 12,
      hoursRecovered: 12,
      linkedTicket: "TKT-1230",
      scheduledDate: "2025-01-06",
      scheduledTime: "3:00 p.m. - 7:00 p.m.",
      status: "completed",
      evidenceType: "trello",
      trelloCard: {
        name: "Refactorizar componentes de UI",
        list: "Done",
        progress: 100,
        url: "https://trello.com/c/xyz789",
        completedAt: "2025-01-06 18:45",
      },
      maxDailyHours: 4,
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      scheduled: {
        label: "Programado",
        icon: Calendar,
        className: "status-scheduled",
      },
      "in-progress": {
        label: "En progreso",
        icon: Clock,
        className: "status-in-progress",
      },
      completed: {
        label: "Completado",
        icon: CheckCircle,
        className: "status-completed",
      },
    };
    return configs[status];
  };

  return (
    <div className="recovery-container">
      <div className="recovery-header">
        <h2>Recuperación de Horas</h2>
        <button className="btn-primary">Programar recuperación</button>
      </div>

      <div className="info-card evidence-info">
        <div className="info-icon">
          <Clock size={20} />
        </div>
        <div className="info-content">
          <p className="info-title">Fuentes de evidencia válidas</p>
          <div className="evidence-sources">
            <div className="evidence-item">
              <Trello size={16} />
              <div>
                <p className="evidence-title">Tareas en Trello</p>
                <p className="evidence-description">
                  Vinculadas a listas "Recuperación" o "Pendientes Extra". Se validan automáticamente cuando la
                  tarjeta pasa a "Done" o el checklist está al 100%.
                </p>
              </div>
            </div>
            <div className="evidence-item">
              <ListChecks size={16} />
              <div>
                <p className="evidence-title">Checklist interno del Módulo de Tareas</p>
                <p className="evidence-description">
                  Asignado por Scrum Master o líder técnico. Al completar todos los ítems, las horas se suman
                  automáticamente.
                </p>
              </div>
            </div>
          </div>
          <div className="evidence-limits">
            <p><strong>Límites:</strong> Máximo 4 horas por día • Horarios: tardes (3:00 p.m. - 10:00 p.m.) o sábados</p>
          </div>
        </div>
      </div>

      <div className="recovery-list">
        {recoveries.map((recovery) => {
          const statusConfig = getStatusConfig(recovery.status);
          const StatusIcon = statusConfig.icon;
          const progress = (recovery.hoursRecovered / recovery.hoursToRecover) * 100;

          return (
            <div key={recovery.id} className="recovery-card">
              <div className="recovery-content">
                <div className="recovery-header-row">
                  <h3>{recovery.practitioner}</h3>
                  <span className="badge-outline">{recovery.server}</span>
                  <span className="badge-outline">{recovery.linkedTicket}</span>
                </div>

                <div className="recovery-progress">
                  <div className="progress-header">
                    <span>Progreso de recuperación</span>
                    <span className="progress-value">
                      {recovery.hoursRecovered}/{recovery.hoursToRecover} horas
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="recovery-details">
                  <p><strong>Fecha programada:</strong> {recovery.scheduledDate}</p>
                  <p><strong>Horario:</strong> {recovery.scheduledTime}</p>
                </div>

                {recovery.evidenceType === "trello" && recovery.trelloCard && (
                  <div className="evidence-card trello-card">
                    <div className="evidence-header">
                      <Trello size={16} />
                      <div className="evidence-info-text">
                        <p className="evidence-label">Evidencia: Tarjeta de Trello</p>
                        <p className="evidence-name">{recovery.trelloCard.name}</p>
                        <div className="trello-meta">
                          <span className="badge-white">{recovery.trelloCard.list}</span>
                          <span className="progress-text">{recovery.trelloCard.progress}% completado</span>
                        </div>
                        {recovery.trelloCard.completedAt && (
                          <div className="completed-info">
                            <CheckCircle size={12} />
                            <span>Completado: {recovery.trelloCard.completedAt}</span>
                          </div>
                        )}
                        <a href={recovery.trelloCard.url} target="_blank" rel="noopener noreferrer" className="trello-link">
                          Ver en Trello <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {recovery.evidenceType === "checklist" && recovery.checklist && (
                  <div className="evidence-card checklist-card">
                    <div className="evidence-header">
                      <ListChecks size={16} />
                      <div className="evidence-info-text">
                        <p className="evidence-label">Evidencia: Checklist Interno</p>
                        <p className="assigned-by">Asignado por: {recovery.checklist.assignedBy}</p>
                        <div className="checklist-items">
                          {recovery.checklist.items.map((item) => (
                            <div key={item.id} className="checklist-item">
                              <div className={`checkbox ${item.done ? 'checked' : ''}`}>
                                {item.done && <CheckCircle size={12} />}
                              </div>
                              <span className={item.done ? 'done' : ''}>{item.text}</span>
                            </div>
                          ))}
                        </div>
                        <div className="checklist-progress">
                          {recovery.checklist.completed}/{recovery.checklist.total} completados
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="recovery-actions">
                <span className={`status-badge ${statusConfig.className}`}>
                  <StatusIcon size={14} />
                  {statusConfig.label}
                </span>
                <button className="btn-secondary">Ver detalles</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
