import { ChatPanel as SharedChatPanel } from '@shared/components/ChatPanel'

// Re-export the shared ChatPanel to avoid duplicated code and keep
// compatibility with existing imports that expect a named export `ChatPanel`.
export { SharedChatPanel as ChatPanel }
export default SharedChatPanel



