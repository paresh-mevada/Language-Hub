import { Construction } from 'lucide-react';

function FeaturePlaceholder({ title }) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-4xl items-center justify-center text-center">
      <div>
        <span className="mx-auto grid size-12 place-items-center rounded-lg bg-amber-100 text-amber-700"><Construction className="size-6" /></span>
        <h2 className="mt-5 text-2xl font-bold text-slate-950">{title}</h2>
        <p className="mt-2 text-slate-600">This workspace is prepared for its upcoming learning tools.</p>
      </div>
    </section>
  );
}

export default FeaturePlaceholder;
