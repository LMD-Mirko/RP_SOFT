export function Table({ children, className = '' }) {
  return (
    <div className={`w-full overflow-x-auto rounded-md border border-gray-200 ${className}`}>
      <table className="w-full text-sm text-left">
        {children}
      </table>
    </div>
  )
}

export function THead({ children }) {
  return <thead className="bg-gray-50 text-gray-600">{children}</thead>
}

export function TBody({ children }) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>
}

export function TR({ children }) {
  return <tr className="hover:bg-gray-50">{children}</tr>
}

export function TH({ children, className = '' }) {
  return <th className={`px-4 py-2 font-medium ${className}`}>{children}</th>
}

export function TD({ children, className = '' }) {
  return <td className={`px-4 py-2 ${className}`}>{children}</td>
}
