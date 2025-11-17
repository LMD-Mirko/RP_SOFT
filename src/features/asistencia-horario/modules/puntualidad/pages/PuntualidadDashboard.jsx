import { useState } from "react";
import {
  Users,
  UserCheck,
  GraduationCap,
  FileCheck,
  FileX,
  Clock,
  Info,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Bell,
  Activity,
  Search,
  Filter
} from "lucide-react";
import './PuntualidadDashboard.css';
import Justificaciones from './Justificaciones';
import Recuperacion from './Recuperacion';

export default function App() {
  const [activeTab, setActiveTab] = useState("vista");

  return (
    <div className="page">
      <header className="header">
        <h1>Puntualidad y Asistencia</h1>
        <p className="subtext">
          Control diario de asistencia con auto-exclusión y alertas automáticas
        </p>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "vista" ? "active" : ""}
          onClick={() => setActiveTab("vista")}
        >
          Vista Hoy
        </button>
        <button
          className={activeTab === "justificaciones" ? "active" : ""}
          onClick={() => setActiveTab("justificaciones")}
        >
          Justificaciones
        </button>
        <button
          className={activeTab === "recuperacion" ? "active" : ""}
          onClick={() => setActiveTab("recuperacion")}
        >
          Recuperación
        </button>
      </div>

      {activeTab === "vista" && (
        <>
          <div className="header-update">
            <span>
              Última actualización: <strong>7:45 a.m.</strong>
            </span>
          </div>

          {/* === Resumen de Asistencia === */}
          <section className="grid-resume">
            <div className="card">
              <div className="card-icon blue"><Users size={22} /></div>
              <h3>Deben Asistir Hoy</h3>
              <div className="big">128</div>
              <p className="note">Excluye los que tienen clases</p>
            </div>

            <div className="card">
              <div className="card-icon green"><UserCheck size={22} /></div>
              <h3>Presentes</h3>
              <div className="big">118 <span className="small">(92%)</span></div>
              <p className="note">&nbsp;</p>
            </div>

            <div className="card">
              <div className="card-icon purple"><GraduationCap size={22} /></div>
              <h3>Con Clases Hoy</h3>
              <div className="big">24</div>
              <p className="note">Auto-excluidos del registro</p>
            </div>

            <div className="card">
              <div className="card-icon orange"><FileCheck size={22} /></div>
              <h3>Ausentes Justificados</h3>
              <div className="big">6</div>
              <p className="note">Con ticket aprobado</p>
            </div>

            <div className="card">
              <div className="card-icon red"><FileX size={22} /></div>
              <h3>Ausentes Sin Justificar</h3>
              <div className="big">4</div>
              <p className="note">Requieren atención</p>
            </div>

            <div className="card">
              <div className="card-icon yellow"><Clock size={22} /></div>
              <h3>Tardanzas</h3>
              <div className="big">8</div>
              <p className="note">Llegaron después de 8:05</p>
            </div>
          </section>

          {/* === Autoexclusión === */}
          <div className="auto">
            <div className="auto-icon"><Info size={22} /></div>
            <div>
              <h4>Auto-exclusión diaria activada</h4>
              <p>
                A las <strong>7:45 a.m.</strong> se generó automáticamente la lista de practicantes que deben asistir hoy,
                excluyendo a los 24 que tienen clases programadas en su calendario.
              </p>
            </div>
            <div className="auto-status"><Activity size={16} /> Sistema activo</div>
          </div>

          {/* === Alertas === */}
          <div className="alerts">
            <h2>Alertas Automáticas</h2>

            <div className="alerts-grid">
              <div className="alert yellow">
                <div className="alert-header">
                  <div className="icon-wrap yellow"><AlertTriangle size={20} /></div>
                  <h3>Tardanza potencial detectada</h3>
                  <div className="count">3</div>
                </div>
                <p className="time">8:05 a.m. • Gracia de 5 minutos aplicada</p>
                <ul>
                  <li>Carlos Mendoza</li>
                  <li>Ana Torres</li>
                  <li>Luis Ramírez</li>
                </ul>
                <button className="btn secondary">Ver detalles</button>
              </div>

              <div className="alert red">
                <div className="alert-header">
                  <div className="icon-wrap red"><AlertOctagon size={20} /></div>
                  <h3>Ausencias sin clase registrada</h3>
                  <div className="count">2</div>
                </div>
                <p className="time">8:30 a.m. • No tienen clases programadas hoy</p>
                <ul>
                  <li>María González</li>
                  <li>Pedro Sánchez</li>
                </ul>
                <button className="btn secondary">Ver detalles</button>
              </div>

              <div className="alert orange">
                <div className="alert-header">
                  <div className="icon-wrap orange"><ShieldAlert size={20} /></div>
                  <h3>Practicantes en riesgo</h3>
                  <div className="count">1</div>
                </div>
                <p className="time">9:15 a.m. • 3er ticket del mes alcanzado</p>
                <ul>
                  <li>Jorge Vega</li>
                </ul>
                <button className="btn secondary">Ver detalles</button>
              </div>
            </div>
          </div>

          {/* === Configuración === */}
          <div className="config">
            <div className="config-header">
              <Bell size={18} /> <h3>Configuración de alertas</h3>
            </div>
            <ul>
              <li>8:05 a.m. – Alerta de tardanza potencial (gracia 5 min)</li>
              <li>8:30 a.m. – Alerta de ausencia sin clase registrada</li>
              <li>3er ticket del mes – Alerta de practicante en riesgo</li>
              <li>Sin Daily del equipo – Bandera en asistencia (cruce automático)</li>
            </ul>
          </div>

          {/* ⭐⭐⭐ CONTROL DE ASISTENCIA DIARIA (AGREGADO SIN AFECTAR NADA) ⭐⭐⭐ */}
          <div className="control-diario">
            <h2>Control de Asistencia Diaria</h2>

            <div className="control-wrap">
              <div className="controls">
                <div className="search-box">
                  <Search size={18} />
                  <input type="text" placeholder="Buscar por nombre..." />
                </div>

                <button className="filter-btn">
                  <Filter size={18} /> Todos los servidores
                </button>

                <select>
                  <option>Todos los estados</option>
                  <option>Presente</option>
                  <option>Tardanza</option>
                  <option>Ausente</option>
                </select>

                <span className="badge">5 practicantes deben asistir hoy</span>
              </div>

              {/* === Lista === */}
              <div className="list">

                {/* 1 */}
                <div className="person-card">
                  <div className="person-left">
                    <div className="person-name">
                      Carlos Mendoza <span className="tag">Rpsoft</span> <span className="tag">Team Alpha</span>
                    </div>
                    <div className="person-meta">Hora de Ingreso: <strong>8:02 a.m.</strong> • Horas semanales: <strong>24/30</strong></div>

                    <div className="progress">
                      <div className="progress-bar" style={{ width: "85%", background: "#facc15" }}></div>
                    </div>
                  </div>

                  <div className="person-right">
                    <div className="status present">Presente</div>
                    <button className="btn secondary">Ver detalles</button>
                  </div>
                </div>

                {/* 2 */}
                <div className="person-card">
                  <div className="person-left">
                    <div className="person-name">
                      Ana Torres <span className="tag">Innovacion</span> <span className="tag">Team Beta</span>
                    </div>
                    <div className="person-meta">Hora de Ingreso: <strong>8:12 a.m.</strong> • Horas semanales: <strong>18/30</strong></div>

                    <div className="progress">
                      <div className="progress-bar" style={{ width: "70%", background: "#ef4444" }}></div>
                    </div>
                  </div>

                  <div className="person-right">
                    <div className="status tardanza">Tardanza</div>
                    <button className="btn secondary">Ver detalles</button>
                  </div>
                </div>

                {/* 3 */}
                <div className="person-card">
                  <div className="person-left">
                    <div className="person-name">
                      María González <span className="tag">Laboratorios</span> <span className="tag">Team Gamma</span>
                    </div>
                    <div className="person-meta">Hora de Ingreso: — • Horas semanales: <strong>12/30</strong></div>

                    <div className="progress">
                      <div className="progress-bar" style={{ width: "40%", background: "#ef4444" }}></div>
                    </div>
                  </div>

                  <div className="person-right">
                    <div className="status ausente">Ausente (Sin justificar)</div>
                    <button className="btn secondary">Ver detalles</button>
                  </div>
                </div>

                {/* 4 */}
                <div className="person-card">
                  <div className="person-left">
                    <div className="person-name">
                      Pedro Sánchez <span className="tag">MiniBootcamp</span> <span className="tag">Team Delta</span>
                    </div>
                    <div className="person-meta">Hora de Ingreso: — • Horas semanales: <strong>18/30</strong></div>

                    <div className="progress">
                      <div className="progress-bar" style={{ width: "60%", background: "#ef4444" }}></div>
                    </div>

                    <div className="warning">
                      Ticket #1234 – Cita médica
                    </div>
                  </div>

                  <div className="person-right">
                    <div className="status ausenteJ">Ausente (Justificado)</div>
                    <button className="btn secondary">Ver detalles</button>
                  </div>
                </div>

                {/* 5 */}
                <div className="person-card">
                  <div className="person-left">
                    <div className="person-name">
                      Luis Ramírez <span className="tag">Rpsoft</span> <span className="tag">Team Alpha</span>
                    </div>
                    <div className="person-meta">Hora de Ingreso: <strong>7:58 a.m.</strong> • Horas semanales: <strong>30/30</strong></div>

                    <div className="progress">
                      <div className="progress-bar" style={{ width: "100%", background: "#16a34a" }}></div>
                    </div>

                    <div className="warning">
                      ⚠ Sin Daily del equipo registrado hoy
                    </div>
                  </div>

                  <div className="person-right">
                    <div className="status present">Presente</div>
                    <button className="btn secondary">Ver detalles</button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* ⭐⭐⭐ FIN DEL CONTROL DIARIO ⭐⭐⭐ */}

        </>
      )}

      {activeTab === "justificaciones" && <Justificaciones />}

      {activeTab === "recuperacion" && <Recuperacion />}
    </div>
  );
}
