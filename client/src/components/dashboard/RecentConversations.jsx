import { ChevronRight, MessageSquareText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function RecentConversations({ conversations = [] }) {
  const navigate = useNavigate();

  return (
    <section className="glass-card rounded-3xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-100">Recent AI Conversations</h2>
          <p className="text-xs text-slate-400">Continue practicing real scenario dialogs.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/tutor')}
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-300 hover:text-teal-200 transition"
        >
          <span>Open Tutor</span>
          <ChevronRight className="size-4" />
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <MessageSquareText className="mx-auto size-8 text-slate-600 animate-pulse" />
          <p className="text-xs text-slate-400">No recent conversations yet.</p>
          <button
            onClick={() => navigate('/tutor')}
            className="text-xs font-bold text-teal-400 hover:underline"
          >
            Start your first conversation →
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {conversations.map((conversation, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate('/tutor')}
              className="flex w-full items-start gap-3.5 py-3 text-left transition hover:bg-slate-800/40 rounded-xl px-2"
            >
              <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-300">
                <MessageSquareText className="size-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {conversation.title || 'Practice Dialogue'}
                  </span>
                  <span className="text-[10px] text-slate-400">{conversation.date || 'Today'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-teal-400 text-[11px] shrink-0">
                    {conversation.language || 'English'}
                  </span>
                  <span className="min-w-0 truncate text-slate-400 text-[11px]">
                    {conversation.lastMessage || 'Click to continue practice conversation.'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentConversations;
