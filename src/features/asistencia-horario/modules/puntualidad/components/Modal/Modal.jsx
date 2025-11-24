export default function Modal({onClose, title, items, note}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=> e.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="close" onClick={onClose}>✕</button>
        </header>
        <div className="modal-body">
          <p className="note">{note}</p>
          <ul>
            {items.map((it,i)=> <li key={i}>{it}</li>)}
          </ul>
        </div>
        <footer className="modal-footer">
          <button className="btn" onClick={onClose}>Cerrar</button>
        </footer>
      </div>
    </div>
  )
}
