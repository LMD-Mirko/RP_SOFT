export function PlaceholderSection({ title, description }) {
  return (
    <div className="p-6">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-2 text-gray-600">
            {description}
          </p>
        )}

        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-white p-6 text-gray-500">
          Esta sección aún está en construcción. Utiliza el menú lateral para
          navegar entre las diferentes configuraciones disponibles dentro del módulo.
        </div>
      </div>
    </div>
  )
}

PlaceholderSection.defaultProps = {
  description: '',
}

