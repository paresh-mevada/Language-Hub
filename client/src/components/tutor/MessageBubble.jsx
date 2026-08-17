import { Bot, Check, Copy, Lightbulb, RefreshCw, UserRound, Volume2 } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

function MessageBubble({ message, isRegenerating, onRegenerate }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isAssistant = message.role === 'assistant';

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1800);
    } catch {
      setIsCopied(false);
    }
  }

  function speakMessage() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <article className={`flex gap-3.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {/* Avatar Icon */}
      {isAssistant && (
        <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20">
          <Bot className="size-5" />
        </div>
      )}

      {/* Message Box */}
      <div
        className={`group relative max-w-[90%] rounded-2xl p-4 sm:max-w-[78%] shadow-xl backdrop-blur-md ${
          isAssistant
            ? 'glass-card border-slate-800 text-slate-100'
            : 'bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 text-slate-950 font-medium'
        }`}
      >
        {/* Assistant Header Toolbar */}
        {isAssistant && (
          <div className="mb-2.5 flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-teal-400">
              <span className="size-2 rounded-full bg-teal-400 animate-pulse" />
              AI Language Tutor
            </span>

            {/* Quick Action Toolbar */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={speakMessage}
                className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition ${
                  isSpeaking ? 'text-teal-300 bg-teal-500/20 animate-pulse' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Listen audio"
              >
                <Volume2 className="size-3.5" />
              </button>

              <button
                type="button"
                onClick={copyMessage}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
                title="Copy response"
              >
                {isCopied ? (
                  <>
                    <Check className="size-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {onRegenerate && (
                <button
                  type="button"
                  onClick={() => onRegenerate(message)}
                  disabled={isRegenerating}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition disabled:opacity-50"
                  title="Regenerate response"
                >
                  <RefreshCw className={`size-3.5 ${isRegenerating ? 'animate-spin text-teal-400' : ''}`} />
                  <span>Retry</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Markdown Content */}
        <div
          className={`prose prose-sm max-w-none break-words ${
            isAssistant
              ? 'text-slate-200 prose-p:my-1.5 prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-white prose-strong:text-teal-300 prose-code:rounded-lg prose-code:bg-slate-950 prose-code:px-2 prose-code:py-1 prose-code:text-teal-300 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none prose-blockquote:my-2 prose-blockquote:border-l-4 prose-blockquote:border-amber-400 prose-blockquote:bg-amber-500/10 prose-blockquote:p-3 prose-blockquote:rounded-r-xl prose-blockquote:text-slate-200 prose-ul:my-1.5 prose-li:my-0.5'
              : 'text-slate-950 prose-p:my-1 prose-p:leading-relaxed prose-strong:text-slate-950 prose-code:text-slate-950'
          }`}
        >
          <ReactMarkdown
            components={{
              blockquote: ({ children }) => (
                <div className="my-2 flex gap-2.5 rounded-r-xl border-l-4 border-amber-400 bg-amber-500/10 p-3 text-xs sm:text-sm text-amber-200">
                  <Lightbulb className="size-4 shrink-0 text-amber-400 mt-0.5" />
                  <div className="min-w-0 flex-1">{children}</div>
                </div>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold shadow-md">
          <UserRound className="size-5" />
        </div>
      )}
    </article>
  );
}

export default MessageBubble;
