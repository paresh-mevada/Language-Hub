import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Volume2,
  XCircle,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getApiError } from '../services/api.js';
import { getLessonById, submitLessonExercises } from '../services/lessonService.js';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Active view tab: 'theory' | 'exercises'
  const [activeTab, setActiveTab] = useState('theory');

  // Exercise responses state
  const [answers, setAnswers] = useState({});

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Submission result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getLessonById(id);
      setLesson(data);
      if (data?.userProgress?.answers) {
        setAnswers(data.userProgress.answers || {});
      }
    } catch (err) {
      setError(getApiError(err, 'Failed to load lesson details.'));
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!lesson?.exercises || lesson.exercises.length === 0) return;

    try {
      setIsSubmitting(true);
      setSubmitError('');
      const result = await submitLessonExercises(id, answers);
      setSubmitResult(result);

      if (result.isCompleted) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2dd4bf', '#10b981', '#6366f1', '#f59e0b'],
        });
      }
    } catch (err) {
      setSubmitError(getApiError(err, 'Failed to submit answers.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSubmitResult(null);
    setAnswers({});
    setActiveTab('exercises');
  };

  if (isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="size-10 animate-spin text-teal-400" />
          <p className="text-xs font-semibold text-slate-400">Loading lesson content...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <AlertCircle className="mx-auto size-12 text-rose-400 animate-bounce" />
        <h2 className="mt-4 text-xl font-bold text-slate-200">Unable to load lesson</h2>
        <p className="mt-1 text-xs text-slate-400">{error || 'Lesson not found.'}</p>
        <button
          onClick={() => navigate('/lessons')}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Lessons</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Back Button & Top Header */}
      <div>
        <button
          onClick={() => navigate('/lessons')}
          className="mb-4 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs font-bold text-slate-400 hover:border-slate-700 hover:text-slate-200 backdrop-blur-md transition"
        >
          <ArrowLeft className="size-4 text-teal-400" />
          <span>Back to Lessons</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-300">
                {lesson.category}
              </span>
              <span className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-400">
                {lesson.level}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="size-3.5 text-slate-500" />
                <span>{lesson.duration || '15 mins'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{lesson.title}</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">{lesson.description}</p>
          </div>

          {/* Audio Listen Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => speakText(`${lesson.title}. ${lesson.description}`)}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
                isSpeaking
                  ? 'border-teal-400 bg-teal-500/20 text-teal-300 animate-pulse'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-teal-500/40 hover:text-white'
              }`}
              title="Listen to lesson title and summary"
            >
              <Volume2 className="size-4" />
              <span>{isSpeaking ? 'Reading Aloud...' : 'Listen Audio'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Animated Tabs Bar */}
      <div className="flex gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveTab('theory')}
          className={`relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold transition-colors ${
            activeTab === 'theory' ? 'text-teal-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeTab === 'theory' && (
            <motion.div
              layoutId="lessonDetailTab"
              className="absolute inset-0 rounded-xl bg-teal-500/10 border border-teal-500/30"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <BookOpen className="size-4" />
          <span>1. Lesson Content & Theory</span>
        </button>

        <button
          onClick={() => setActiveTab('exercises')}
          className={`relative inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold transition-colors ${
            activeTab === 'exercises' ? 'text-teal-300' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {activeTab === 'exercises' && (
            <motion.div
              layoutId="lessonDetailTab"
              className="absolute inset-0 rounded-xl bg-teal-500/10 border border-teal-500/30"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <HelpCircle className="size-4" />
          <span>2. Practice Exercises ({lesson.exercises?.length || 0})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === 'theory' ? (
          <motion.div
            key="theory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            <div className="prose prose-invert max-w-none prose-teal text-xs sm:text-sm leading-relaxed">
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-800/80">
              <button
                onClick={() => setActiveTab('exercises')}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-3 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition"
              >
                <span>Continue to Practice Exercises</span>
                <Sparkles className="size-4 text-slate-950" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="exercises"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {submitResult ? (
              /* RESULTS DISPLAY */
              <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="text-center pb-6 border-b border-slate-800/80 space-y-3">
                  <div className="grid size-16 place-items-center mx-auto rounded-2xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-400 shadow-xl">
                    <Award className="size-8 animate-bounce" />
                  </div>
                  <h2 className="text-2xl font-black text-white">
                    {submitResult.isCompleted ? 'Awesome Job! Lesson Passed' : 'Keep Going & Try Again!'}
                  </h2>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">{submitResult.message}</p>
                  
                  <div className="inline-flex items-center gap-4 rounded-2xl bg-slate-950/80 px-6 py-3 border border-slate-800 shadow-inner">
                    <span className="text-3xl font-black text-teal-300">
                      {submitResult.percentage}%
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      ({submitResult.score} / {submitResult.maxScore} Correct)
                    </span>
                  </div>
                </div>

                {/* Review Questions */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Question Breakdown
                  </h3>
                  {submitResult.results.map((res, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl border p-4 text-xs space-y-2 ${
                        res.isCorrect
                          ? 'border-emerald-500/30 bg-emerald-950/20'
                          : 'border-rose-500/30 bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {res.isCorrect ? (
                          <CheckCircle2 className="size-5 shrink-0 text-emerald-400 mt-0.5" />
                        ) : (
                          <XCircle className="size-5 shrink-0 text-rose-400 mt-0.5" />
                        )}
                        <div className="space-y-1 flex-1">
                          <p className="font-bold text-slate-100">
                            {i + 1}. {res.question}
                          </p>
                          <p className="text-slate-300">
                            <span className="text-slate-400 font-medium">Your Answer:</span>{' '}
                            <strong className={res.isCorrect ? 'text-emerald-300 font-extrabold' : 'text-rose-300 font-extrabold'}>
                              {res.userAnswer || '(No answer provided)'}
                            </strong>
                          </p>
                          {!res.isCorrect && (
                            <p className="text-slate-300">
                              <span className="text-slate-400 font-medium">Correct Answer:</span>{' '}
                              <strong className="text-emerald-400 font-extrabold">{res.correctAnswer}</strong>
                            </p>
                          )}
                          {res.explanation && (
                            <p className="mt-2 text-slate-400 italic bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                              Explanation: {res.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-6">
                  <button
                    onClick={handleRetake}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 transition"
                  >
                    <RotateCcw className="size-4 text-teal-400" />
                    <span>Retake Exercises</span>
                  </button>

                  <button
                    onClick={() => navigate('/lessons')}
                    className="rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition"
                  >
                    Back to Lessons
                  </button>
                </div>
              </div>
            ) : (
              /* QUESTION CARDS FORM */
              <div className="space-y-6">
                {submitError && (
                  <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400">
                    <AlertCircle className="size-5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {lesson.exercises?.map((exercise, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-6 shadow-xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                        Exercise #{index + 1}
                      </span>
                      <button
                        onClick={() => speakText(exercise.question)}
                        className="text-slate-400 hover:text-teal-300 transition"
                        title="Read Question Aloud"
                      >
                        <Volume2 className="size-4" />
                      </button>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-100">{exercise.question}</h3>

                    <div className="pt-2">
                      {exercise.type === 'multiple_choice' ? (
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                          {exercise.options?.map((option, optIdx) => {
                            const isSelected = answers[index] === option;
                            return (
                              <button
                                key={optIdx}
                                type="button"
                                onClick={() => handleAnswerChange(index, option)}
                                className={`rounded-xl border p-4 text-left text-xs font-semibold transition-all duration-200 ${
                                  isSelected
                                    ? 'border-teal-400 bg-teal-500/15 text-teal-200 shadow-md ring-1 ring-teal-500/40'
                                    : 'border-slate-800/80 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={answers[index] || ''}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          placeholder="Type your answer here..."
                          className="glass-input w-full max-w-lg rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-teal-500/20"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}

                <div className="flex justify-end pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-400 px-8 py-3 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin text-slate-950" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4 text-slate-950" />
                        <span>Submit Answers & View Score</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
