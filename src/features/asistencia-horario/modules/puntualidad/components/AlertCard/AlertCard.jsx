export default function AlertCard({title, time, items, onDetails, variant}) {
  return (
    <div className={`alert ${variant || ''}`}>
      <h3>{title}</h3>
      <p className="time">{time}</p>
      <ul>
        {items.map((it, i)=> <li key={i}>{it}</li>)}
      </ul>
      <button className="btn" onClick={onDetails}>Ver Detalles</button>
    </div>
  )
}
