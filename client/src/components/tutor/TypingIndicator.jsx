function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-3 rounded-2xl bg-slate-900 border border-slate-800 w-fit" aria-label="Tutor is typing">
      <span className="size-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.3s]" />
      <span className="size-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.15s]" />
      <span className="size-2 animate-bounce rounded-full bg-teal-400" />
    </div>
  );
}

export default TypingIndicator;
