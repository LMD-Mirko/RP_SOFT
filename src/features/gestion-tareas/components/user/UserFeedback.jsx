import { Star } from 'lucide-react'
import { useUserFeedback } from '../../hooks/useUserFeedback'
import { Textarea } from '../ui/Textarea'
import { Button } from '../ui/Button'

export function UserFeedback() {
  const { loading, evaluaciones, mensaje, setMensaje, sending, send } = useUserFeedback()

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 bg-gray-50/60">
          <Star size={18} className="text-gray-700" />
          <div className="font-semibold text-gray-900">Evaluaciones de Desempeño</div>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-gray-600">Cargando...</div>
        ) : (
          <div className="p-5 space-y-4">
            {evaluaciones.map((e) => (
              <div key={e.id} className="rounded-lg border border-gray-200">
                <div className="flex items-start gap-3 px-4 py-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-gray-900">{e.autor}</div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{e.nota}</div>
                        <div className="text-[10px] text-gray-500">/10</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{e.fecha}</div>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="rounded-md bg-gray-100 text-gray-800 px-3 py-3 text-sm">
                    {e.comentario}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200 bg-gray-50/60">
          <div className="font-semibold text-gray-900">Tu Feedback</div>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-600 mb-3">Comparte tu opinión sobre el programa de prácticas. Tu feedback es valioso para mejorar.</p>
          <Textarea placeholder="Escribe tu Feedback aquí..." value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
          <div className="pt-3">
            <Button variant="dark" disabled={sending || !mensaje.trim()} onClick={send} className="w-full">Enviar el Feedback</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
