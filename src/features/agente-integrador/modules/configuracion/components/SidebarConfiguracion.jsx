import { NavLink, useLocation } from 'react-router-dom'
import { NAVIGATION_ITEMS } from '../routes'

/**
 * Sidebar del módulo Configuración
 * Muestra las opciones de navegación del módulo (Lista, Crear, etc.)
 */
export function SidebarConfiguracion() {
  const location = useLocation()
  
  // Construir la ruta base del módulo
  const basePath = location.pathname.split('/configuracion')[0] + '/configuracion'

  return (
    <aside
      style={{
        width: '220px',
        backgroundColor: '#fafafa',
        padding: '20px',
        borderRight: '1px solid #ddd',
      }}
    >
      <h3 style={{ marginBottom: '15px', fontSize: '16px', fontWeight: 'bold', color: '#666' }}>
        Configuración
      </h3>
      
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {NAVIGATION_ITEMS.map((item) => {
            const fullPath = `${basePath}/${item.path}`
            const isActive = location.pathname === fullPath || 
                            (item.path === '' && location.pathname === basePath)

            return (
              <li key={item.id} style={{ marginBottom: '8px' }}>
                <NavLink
                  to={item.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    textDecoration: 'none',
                    color: isActive ? '#007bff' : '#555',
                    backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : 'normal',
                  }}
                >
                  <span style={{ marginRight: '8px', fontSize: '18px' }}>
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

