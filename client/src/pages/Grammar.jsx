import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  History,
  Lightbulb,
  LoaderCircle,
  MessageSquare,
  Sparkles,
  Trash2,
  Volume2,
  Wand2,
} from 'lucide-react';
import useAuthStore from '../context/authStore.js';
import { getApiError } from '../services/api.js';
import {
  checkGrammar,
  clearGrammarHistory,
  deleteGrammarCheck,
  getGrammarHistory,
} from '../services/grammarService.js';

const SAMPLE_SENTENCES = [
  'I goes to school yesterday and see my friend.',
  "She don't like apples, but he love them.",
  'He have three dogs and two cats in his house.',
  'They was playing football when it started raining heavily.',
];

export default function Grammar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const [language, setLanguage] = useState(
    user?.learningLanguage && user.learningLanguage !== 'Not selected'
      ? user.learningLanguage
      : 'English',
  );
  const [currentCheck, setCurrentCheck] = useState(null);
  const [history, setHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await getGrammarHistory();
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load grammar history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleAnalyze = async (textToAnalyze = text) => {
    const targetText = textToAnalyze.trim();
    if (!targetText) {
      setError('Please enter a sentence or text to analyze.');
      return;
    }

    try {
      setError('');
      setIsAnalyzing(true);
      const result = await checkGrammar(targetText, language);
      setCurrentCheck(result);
      await loadHistory();
    } catch (err) {
      setError(getApiError(err, 'Failed to analyze text. Please try again.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakText = (content) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleDeleteHistoryItem = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteGrammarCheck(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
      if (currentCheck?._id === id) {
        setCurrentCheck(null);
      }
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleClearAllHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all grammar history?')) return;
    try {
      await clearGrammarHistory();
      setHistory([]);
      setCurrentCheck(null);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const handleSelectHistoryItem = (item) => {
    setCurrentCheck(item);
    setText(item.originalText);
    setShowHistoryMobile(false);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="bg-ambient-glow top-0 right-0 h-64 w-64 bg-violet-500/20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
                <Sparkles className="size-3.5" />
                <span>AI Grammar Assistant</span>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                {language}
              </span>
            </div>

            <h1 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Real-time Grammar & Syntax Checker
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-2xl">
              Paste your sentences to get instant AI error detection, step-by-step rule explanations, and natural phrasing alternatives.
            </p>
          </div>

          <button
            onClick={() => setShowHistoryMobile(!showHistoryMobile)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-700 lg:hidden transition"
          >
            <History className="size-4 text-teal-400" />
            <span>History ({history.length})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Input & Analysis Panel */}
        <div className="space-y-6 lg:col-span-8">
          <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="grammar-input" className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Your Text to Check
              </label>
              <span className="text-[11px] text-slate-400 font-medium">{text.length} / 2000 chars</span>
            </div>

            <textarea
              id="grammar-input"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your sentence here (e.g. 'I goes to school yesterday and see my friends...')"
              maxLength={2000}
              className="glass-input w-full rounded-2xl p-4 text-xs sm:text-sm placeholder-slate-500 focus:ring-2 focus:ring-teal-500/20"
            />

            {error && (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400">
                <AlertCircle className="size-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Sample Chips */}
            <div className="space-y-2 pt-2">
              <p className="text-[11px] font-semibold text-slate-400">Quick Test Samples:</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SENTENCES.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setText(sample);
                      handleAnalyze(sample);
                    }}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-[11px] text-slate-300 hover:border-teal-500/40 hover:text-teal-300 transition"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>

            {/* Toolbar Action */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
              <button
                type="button"
                onClick={() => {
                  setText('');
                  setCurrentCheck(null);
                  setError('');
                }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                Clear Text
              </button>

              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing || !text.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 px-6 py-3 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin text-slate-950" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="size-4 text-slate-950" />
                    <span>Analyze Sentence</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Cards Display */}
          <AnimatePresence mode="wait">
            {currentCheck && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="glass-card rounded-3xl p-6 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    AI Analysis Results
                  </span>
                  {currentCheck.hasErrors ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
                      <AlertCircle className="size-3.5" />
                      Corrections Applied
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="size-3.5" />
                      Perfect Grammar
                    </span>
                  )}
                </div>

                {/* Original Text */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Original</p>
                  <p className="text-xs sm:text-sm text-slate-300 line-through decoration-rose-500/70">
                    {currentCheck.originalText}
                  </p>
                </div>

                {/* Corrected Text Card */}
                <div className="rounded-2xl border border-teal-500/30 bg-teal-950/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Corrected Phrasing</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => speakText(currentCheck.correctedText)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-teal-300 transition"
                        title="Listen Corrected Text"
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(currentCheck.correctedText)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-[11px] font-bold text-teal-300 hover:bg-teal-500/20 transition"
                      >
                        {copied ? (
                          <>
                            <Check className="size-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-teal-100">{currentCheck.correctedText}</p>
                </div>

                {/* Grammar Explanation */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Lightbulb className="size-4" />
                    <p className="text-xs font-bold text-amber-300">Why this fix?</p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{currentCheck.explanation}</p>
                </div>

                {/* Natural Alternative */}
                {currentCheck.alternativeSentence && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Sparkles className="size-4" />
                      <p className="text-xs font-bold text-emerald-300">Native Speaker Alternative</p>
                    </div>
                    <p className="text-xs sm:text-sm italic text-slate-200 font-medium">
                      "{currentCheck.alternativeSentence}"
                    </p>
                  </div>
                )}

                {/* Discuss with AI Tutor */}
                <div className="pt-2">
                  <button
                    onClick={() => navigate('/tutor')}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition"
                  >
                    <MessageSquare className="size-4 text-teal-400" />
                    <span>Practice this topic with AI Tutor →</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Sidebar */}
        <div className={`lg:col-span-4 ${showHistoryMobile ? 'block' : 'hidden lg:block'}`}>
          <div className="glass-card rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <History className="size-4 text-teal-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">History</h2>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-400">
                  {history.length}
                </span>
              </div>
              {history.length > 0 && (
                <button
                  onClick={handleClearAllHistory}
                  className="text-xs font-bold text-rose-400 hover:text-rose-300 transition"
                >
                  Clear All
                </button>
              )}
            </div>

            {isLoadingHistory ? (
              <div className="flex py-8 justify-center">
                <LoaderCircle className="size-6 animate-spin text-teal-400" />
              </div>
            ) : history.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-500">No grammar checks saved yet.</p>
              </div>
            ) : (
              <div className="max-h-[480px] space-y-2 overflow-y-auto pr-1">
                {history.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleSelectHistoryItem(item)}
                    className={`group relative flex cursor-pointer flex-col rounded-xl border p-3.5 transition-all duration-200 ${
                      currentCheck?._id === item._id
                        ? 'border-teal-400/50 bg-teal-500/10'
                        : 'border-slate-800/80 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-xs text-slate-200 font-semibold">
                        {item.originalText}
                      </p>
                      <button
                        onClick={(e) => handleDeleteHistoryItem(item._id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                        title="Delete entry"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      {item.hasErrors ? (
                        <span className="text-amber-400">Corrected</span>
                      ) : (
                        <span className="text-emerald-400">Perfect</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
