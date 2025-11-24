import {useState} from 'react'

const initial = [
  { id:1, name:'Carlos Mendoza', team:'Team Alpha', role:'Rpsoft', check:'8:02 a.m.', hours:'24/30', status:'Presente', statusType:'present' },
  { id:2, name:'Ana Torres', team:'Team Beta', role:'Innovacion', check:'8:12 a.m.', hours:'18/30', status:'Tardanza', statusType:'tardanza' },
  { id:3, name:'María González', team:'Team Gamma', role:'Laboratorios', check:'-', hours:'12/30', status:'Ausente (Sin justificar)', statusType:'ausente' },
  { id:4, name:'Pedro Sánchez', team:'Team Delta', role:'MiniBootcamp', check:'-', hours:'18/30', status:'Ausente (Justificado)', statusType:'ausenteJ' },
  { id:5, name:'Luis Ramírez', team:'Team Alpha', role:'Rpsoft', check:'7:58 a.m.', hours:'30/30', status:'Presente', statusType:'present', note:'Sin Daily del equipo registrado hoy' }
]

export default function ControlList({onOpenDetails}){
  const [query, setQuery] = useState('')
  const [filterServer, setFilterServer] = useState('Todos los servidores')
  const [filterState, setFilterState] = useState('Todos los estados')
  const [items] = useState(initial)

  const filtered = items.filter(i=> {
    const q = query.toLowerCase()
    if(q && !i.name.toLowerCase().includes(q)) return false
    if(filterState !== 'Todos los estados' && i.status !== filterState) return false
    return true
  })

  return (
    <div className="control-wrap">
      <div className="controls">
        <input placeholder="Buscar por nombre..." value={query} onChange={e=> setQuery(e.target.value)} />
        <select value={filterServer} onChange={e=> setFilterServer(e.target.value)}>
          <option>Todos los servidores</option>
          <option>Rpsoft</option>
          <option>Innovacion</option>
        </select>
        <select value={filterState} onChange={e=> setFilterState(e.target.value)}>
          <option>Todos los estados</option>
          <option>Presente</option>
          <option>Tardanza</option>
          <option>Ausente (Sin justificar)</option>
          <option>Ausente (Justificado)</option>
        </select>
        <div className="badge">5 practicantes deben asistir hoy</div>
      </div>

      <div className="list">
        {filtered.map(p=> (
          <div className="person-card" key={p.id}>
            <div className="person-left">
              <div className="person-name">
                {p.name}
                <span className="tag">{p.role}</span>
                <span className="tag">{p.team}</span>
              </div>
              <div className="person-meta">
                Check-in: <strong>{p.check}</strong>  &nbsp;
                Horas semanales: <strong className={p.hours==='30/30'?'green':''}>{p.hours}</strong>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{width: `${Math.min(100, (parseInt(p.hours)||0)/30*100)}%`}}
                ></div>
              </div>
              {p.note && <div className="warning">{p.note}</div>}
            </div>
            <div className="person-right">
              <div className={`status ${p.statusType}`}>{p.status}</div>
              <button className="btn" onClick={()=> onOpenDetails({
                title:p.name,
                items:[p],
                note:p.note||''
              })}>Ver detalles</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
