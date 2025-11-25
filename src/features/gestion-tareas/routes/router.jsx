/**
 * Router del Módulo Gestión de Tareas
 * Define todas las rutas internas del módulo.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { Dashboard } from "../modules/dashboard/pages/Dashboard";
import { Backlog } from "../modules/backlog/pages/Backlog";
import { SprintBoard } from "../modules/sprint/pages/SprintBoard";
import { HistoryRepo } from "../modules/historias/pages/HistoryRepo";
import { Metrics } from "../modules/metricas/pages/Metrics";
import { User } from "../pages/User";
import { UserHome } from "../components/user/UserHome";
import { UserTasks } from "../components/user/UserTasks";
import { UserFeedback } from "../components/user/UserFeedback";
import { UserTeams } from "../components/user/UserTeams";
import { UserProfile } from "../components/user/UserProfile";
import Error404 from "@shared/interfaces/Error404";

/**
 * Router del Módulo
 * Layout envuelve todas las rutas para mantener el sidebar visible.
 * Las rutas se implementarán gradualmente según se desarrollen las vistas.
 */
export function ModuleRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />

        {/* Rutas de Gestión de Tareas */}
        <Route path="backlog" element={<Backlog />} />
        <Route path="sprint-board" element={<SprintBoard />} />
        <Route path="historias" element={<HistoryRepo />} />
        <Route path="metricas" element={<Metrics />} />
        <Route path="usuario" element={<User />}>
          <Route index element={<Navigate to="inicio" replace />} />
          <Route path="inicio" element={<UserHome />} />
          <Route path="mis-tareas" element={<UserTasks />} />
          <Route path="equipo" element={<UserTeams />} />
          <Route path="feedback" element={<UserFeedback />} />
          <Route path="perfil" element={<UserProfile />} />
        </Route>
      </Route>
      
      {/* Ruta 404 para rutas no encontradas (sin Layout) */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}
