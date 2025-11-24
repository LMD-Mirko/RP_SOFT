export default function Card({title, value, note, valueClass}) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className={`big ${valueClass?valueClass:''}`}>{value}</p>
      <span className="note">{note}</span>
    </div>
  )
}
