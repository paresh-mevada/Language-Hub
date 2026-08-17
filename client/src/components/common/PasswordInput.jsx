import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function PasswordInput({ id, name = id, label = 'Password', autoComplete, value, onChange, placeholder = 'Enter your password' }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div>
      <label className="mb-1 block text-xs font-bold text-slate-300" htmlFor={id}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isVisible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="glass-input h-11 w-full rounded-xl pl-3.5 pr-11 text-xs font-medium focus:ring-2 focus:ring-teal-500/20"
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 hover:text-slate-200 transition"
          aria-label={isVisible ? 'Hide password' : 'Show password'}
          title={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
