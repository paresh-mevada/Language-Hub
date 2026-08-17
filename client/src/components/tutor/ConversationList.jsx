import { MessageSquarePlus, Pencil, Trash2 } from 'lucide-react';

function ConversationList({ conversations, activeConversationId, isLoading, onCreate, onDelete, onRename, onSelect }) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-800/80 bg-slate-900/90 backdrop-blur-xl">
      <div className="border-b border-slate-800/80 p-3">
        <button
          type="button"
          onClick={onCreate}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 px-4 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition"
        >
          <MessageSquarePlus className="size-4" />
          <span>New Practice Session</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <p className="px-3 py-4 text-xs text-slate-400">Loading history...</p>
        ) : conversations.length === 0 ? (
          <p className="px-3 py-4 text-xs leading-5 text-slate-400">
            No previous conversations. Start a new session to begin.
          </p>
        ) : (
          conversations.map((conversation) => {
            const isActive = conversation._id === activeConversationId;
            return (
              <div
                key={conversation._id}
                className={`group flex items-center rounded-xl transition ${
                  isActive
                    ? 'border border-teal-500/30 bg-teal-500/10 text-teal-300 font-bold'
                    : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelect(conversation)}
                  className="min-w-0 flex-1 px-3.5 py-3 text-left"
                >
                  <span className="block truncate text-xs font-bold">{conversation.title}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-400 font-semibold">
                    {conversation.language}
                  </span>
                </button>
                <div className="mr-1.5 flex shrink-0 items-center opacity-0 group-hover:opacity-100 transition">
                  <button
                    type="button"
                    onClick={() => onRename(conversation)}
                    className="grid size-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
                    title="Rename"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(conversation)}
                    className="grid size-7 place-items-center rounded-lg text-slate-500 hover:bg-rose-500/20 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}

export default ConversationList;
