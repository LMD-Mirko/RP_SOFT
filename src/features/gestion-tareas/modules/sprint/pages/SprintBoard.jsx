import { SprintBoard as SprintBoardView } from '../components/SprintBoard'
import { ToastProvider } from '../../../components/ui/ToastProvider'

export function SprintBoard() {
  return (
    <ToastProvider>
      <div className="p-0">
        <SprintBoardView />
      </div>
    </ToastProvider>
  )
}