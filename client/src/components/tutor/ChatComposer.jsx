import { Send, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';

function ChatComposer({ disabled, onSend }) {
  const [content, setContent] = useState('');
  const textareaRef = useRef(null);

  function resizeTextarea() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }

  function submit() {
    const message = content.trim();
    if (!message || disabled) return;
    onSend(message);
    setContent('');
    window.requestAnimationFrame(resizeTextarea);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <div className="border-t border-slate-800/80 bg-slate-900/80 p-3 backdrop-blur-md sm:p-4">
      <div className="glass-panel relative flex items-end gap-2 rounded-2xl p-2 focus-within:border-teal-500/60 focus-within:ring-2 focus-within:ring-teal-500/20">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            window.requestAnimationFrame(resizeTextarea);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows="1"
          placeholder="Ask a question or type your practice response..."
          className="max-h-40 min-h-8 flex-1 resize-none bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={submit}
          disabled={disabled || !content.trim()}
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 text-slate-950 shadow-md shadow-teal-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:brightness-100"
          title="Send message"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  );
}

export default ChatComposer;
