import { Sparkles } from 'lucide-react';

export default function PageLoader() {
  return (
    <main className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 select-none">
      <Sparkles
        className="size-12 animate-pulse text-teal-400 drop-shadow-[0_0_16px_rgba(45,212,191,0.7)]"
        aria-label="Loading..."
      />
    </main>
  );
}
