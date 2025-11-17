import { Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react";

export default function Justificaciones() {
  const justifications = [
    {
      id: "TKT-1234",
      practitioner: "Pedro Sánchez",
      server: "MiniBootcamp",
      date: "2025-01-06",
      reason: "Cita médica",
      status: "approved",
      submittedAt: "8:15 a.m.",
      reviewedAt: "9:30 a.m.",
      slaRemaining: null,
      evidence: true,
      monthlyCount: 2,
    },
    {
      id: "TKT-1235",
      practitioner: "María González",
      server: "Laboratorios",
      date: "2025-01-06",
      reason: "Emergencia familiar",
      status: "pending",
      submittedAt: "8:45 a.m.",
      reviewedAt: null,
      slaRemaining: "14h 15m",
      evidence: false,
      monthlyCount: 3,
    },
    {
      id: "TKT-1236",
      practitioner: "Jorge Vega",
      server: "Rpsoft",
      date: "2025-01-05",
      reason: "Trámite personal",
      status: "rejected",
      submittedAt: "9:00 a.m.",
      reviewedAt: "10:15 a.m.",
      slaRemaining: null,
      evidence: false,
      monthlyCount: 3,
      rejectionReason: "Sin evidencia adjunta",
    },
    {
      id: "TKT-1237",
      practitioner: "Ana Torres",
      server: "Innovacion",
      date: "2025-01-06",
      reason: "Problema de transporte",
      status: "expired",
      submittedAt: "Ayer 8:30 a.m.",
      reviewedAt: null,
      slaRemaining: "Vencido",
      evidence: false,
      monthlyCount: 1,
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        label: "Aprobado",
        icon: CheckCircle,
        className: "status-approved",
      },
      pending: {
        label: "Pendiente",
        icon: Clock,
        className: "status-pending",
      },
      rejected: {
        label: "Rechazado",
        icon: XCircle,
        className: "status-rejected",
      },
      expired: {
        label: "Vencido",
        icon: AlertCircle,
        className: "status-expired",
      },
    };
    return configs[status];
  };

  return (
    <div className="justifications-container">
      <div className="justifications-header">
        <h2>Gestión de Justificaciones</h2>
        <button className="btn-primary">Nueva justificación</button>
      </div>

      <div className="info-card sla-info">
        <div className="info-icon">
          <Clock size={20} />
        </div>
        <div className="info-content">
          <p className="info-title">SLA de tickets: ≤24 horas</p>
          <p className="info-text">
            Los tickets deben ser revisados en máximo 24 horas. Si vencen sin evidencia adjunta, se rechazan
            automáticamente. Límite: <strong>3 tickets por mes</strong>.
          </p>
        </div>
      </div>

      <div className="justifications-list">
        {justifications.map((ticket) => {
          const statusConfig = getStatusConfig(ticket.status);
          const StatusIcon = statusConfig.icon;
          const isAtLimit = ticket.monthlyCount >= 3;

          return (
            <div key={ticket.id} className="justification-card">
              <div className="justification-content">
                <div className="justification-header-row">
                  <h3>{ticket.practitioner}</h3>
                  <span className="badge-outline">{ticket.server}</span>
                  <span className="badge-outline">{ticket.id}</span>
                  {isAtLimit && (
                    <span className="badge-danger">
                      <AlertCircle size={12} />
                      Límite alcanzado
                    </span>
                  )}
                </div>

                <div className="justification-details">
                  <p><strong>Motivo:</strong> {ticket.reason}</p>
                  <p><strong>Fecha:</strong> {ticket.date}</p>
                  <p><strong>Enviado:</strong> {ticket.submittedAt}</p>
                  {ticket.reviewedAt && (
                    <p><strong>Revisado:</strong> {ticket.reviewedAt}</p>
                  )}
                  {ticket.rejectionReason && (
                    <p className="rejection-reason">
                      <strong>Motivo de rechazo:</strong> {ticket.rejectionReason}
                    </p>
                  )}
                </div>

                <div className="justification-badges">
                  {ticket.evidence ? (
                    <span className="badge-success">
                      <FileText size={12} />
                      Con evidencia
                    </span>
                  ) : (
                    <span className="badge-gray">
                      <FileText size={12} />
                      Sin evidencia
                    </span>
                  )}
                  <span className="badge-outline">
                    {ticket.monthlyCount}/3 tickets este mes
                  </span>
                </div>

                {ticket.slaRemaining && ticket.status === "pending" && (
                  <div className="sla-warning">
                    <Clock size={14} />
                    <span>SLA: {ticket.slaRemaining} restantes</span>
                  </div>
                )}
              </div>

              <div className="justification-actions">
                <span className={`status-badge ${statusConfig.className}`}>
                  <StatusIcon size={14} />
                  {statusConfig.label}
                </span>
                {ticket.status === "pending" && (
                  <div className="action-buttons">
                    <button className="btn-approve">Aprobar</button>
                    <button className="btn-reject">Rechazar</button>
                  </div>
                )}
                {ticket.status === "approved" && (
                  <button className="btn-secondary">Ver recuperación</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
