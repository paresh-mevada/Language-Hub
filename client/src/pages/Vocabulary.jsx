import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Grid,
  Layers,
  Plus,
  RotateCw,
  Search,
  Shuffle,
  Sparkles,
  Star,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import useAuthStore from '../context/authStore.js';
import { getApiError } from '../services/api.js';
import {
  createVocabulary,
  deleteVocabulary,
  getVocabulary,
  toggleFavorite,
  toggleLearned,
  updateVocabulary,
} from '../services/vocabularyService.js';

const CATEGORIES = [
  'All',
  'Daily Life',
  'Travel',
  'Business',
  'Education',
  'Technology',
  'Food',
  'Family',
  'Health',
];

const LEVELS = [
  'All',
  'Beginner',
  'Elementary',
  'Intermediate',
  'Upper Intermediate',
  'Advanced',
];

const INITIAL_FORM = {
  word: '',
  meaning: '',
  example: '',
  category: 'Daily Life',
  level: 'Beginner',
};

export default function Vocabulary() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('library'); // 'library' | 'flashcards'
  const [words, setWords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [unlearnedOnly, setUnlearnedOnly] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  // Flashcards state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardDeck, setFlashcardDeck] = useState([]);
  const [speakingWord, setSpeakingWord] = useState('');

  useEffect(() => {
    fetchVocabulary();
  }, [categoryFilter, levelFilter, favoritesOnly, unlearnedOnly]);

  const fetchVocabulary = async () => {
    try {
      setIsLoading(true);
      setError('');
      const params = {};
      if (categoryFilter !== 'All') params.category = categoryFilter;
      if (levelFilter !== 'All') params.level = levelFilter;
      if (favoritesOnly) params.isFavorite = true;
      if (unlearnedOnly) params.isLearned = false;

      const data = await getVocabulary(params);
      setWords(data || []);
      setFlashcardDeck(data || []);
      setCardIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError(getApiError(err, 'Failed to load vocabulary words.'));
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onstart = () => setSpeakingWord(text);
    utterance.onend = () => setSpeakingWord('');
    utterance.onerror = () => setSpeakingWord('');
    window.speechSynthesis.speak(utterance);
  };

  const filteredWords = useMemo(() => {
    if (!search.trim()) return words;
    const term = search.toLowerCase().trim();
    return words.filter(
      (w) =>
        w.word.toLowerCase().includes(term) ||
        w.meaning.toLowerCase().includes(term) ||
        (w.example && w.example.toLowerCase().includes(term))
    );
  }, [words, search]);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      ...INITIAL_FORM,
      level: user?.level || 'Beginner',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      word: item.word,
      meaning: item.meaning,
      example: item.example || '',
      category: item.category || 'Daily Life',
      level: item.level || 'Beginner',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSaveWord = async (e) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.meaning.trim()) {
      setModalError('Word and meaning are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setModalError('');
      if (editingItem) {
        const updated = await updateVocabulary(editingItem._id, formData);
        setWords((prev) => prev.map((w) => (w._id === updated._id ? updated : w)));
      } else {
        const created = await createVocabulary(formData);
        setWords((prev) => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setModalError(getApiError(err, 'Failed to save word.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this word?')) return;
    try {
      await deleteVocabulary(id);
      setWords((prev) => prev.filter((w) => w._id !== id));
      setFlashcardDeck((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      alert(getApiError(err, 'Failed to delete word.'));
    }
  };

  const handleToggleLearned = async (id) => {
    try {
      const updated = await toggleLearned(id);
      setWords((prev) => prev.map((w) => (w._id === updated._id ? updated : w)));
      setFlashcardDeck((prev) => prev.map((w) => (w._id === updated._id ? updated : w)));
    } catch (err) {
      console.error('Failed to toggle learned:', err);
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const updated = await toggleFavorite(id);
      setWords((prev) => prev.map((w) => (w._id === updated._id ? updated : w)));
      setFlashcardDeck((prev) => prev.map((w) => (w._id === updated._id ? updated : w)));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleShuffleDeck = () => {
    const shuffled = [...filteredWords].sort(() => Math.random() - 0.5);
    setFlashcardDeck(shuffled);
    setCardIndex(0);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (flashcardDeck.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % flashcardDeck.length);
  };

  const handlePrevCard = () => {
    if (flashcardDeck.length === 0) return;
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + flashcardDeck.length) % flashcardDeck.length);
  };

  const currentFlashcard = flashcardDeck[cardIndex];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="bg-ambient-glow top-0 right-0 h-64 w-64 bg-teal-500/20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-300">
              <Sparkles className="size-3.5" />
              <span>Vocabulary Builder</span>
            </div>
            <h1 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
              Master New Terminology & Phrases
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-400 max-w-xl">
              Build your custom vocabulary deck, organize by context, audio practice, and test memory with interactive flashcards.
            </p>
          </div>

          {/* Action controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Switcher */}
            <div className="inline-flex rounded-2xl bg-slate-950/80 p-1 border border-slate-800">
              <button
                onClick={() => {
                  setActiveTab('library');
                  setIsFlipped(false);
                }}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === 'library' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeTab === 'library' && (
                  <motion.div
                    layoutId="vocabTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Grid className="size-3.5" />
                  <span>Word Grid</span>
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('flashcards');
                  setFlashcardDeck(filteredWords);
                  setCardIndex(0);
                  setIsFlipped(false);
                }}
                className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === 'flashcards' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {activeTab === 'flashcards' && (
                  <motion.div
                    layoutId="vocabTabPill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Layers className="size-3.5" />
                  <span>Flashcards</span>
                </span>
              </button>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition"
            >
              <Plus className="size-4" />
              <span>Add Term</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search words, definitions, or examples..."
              className="glass-input w-full rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium placeholder-slate-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="glass-input rounded-xl px-3.5 py-2 text-xs font-bold text-slate-200 cursor-pointer"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl} value={lvl} className="bg-slate-900 text-slate-200">
                  Level: {lvl}
                </option>
              ))}
            </select>

            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                favoritesOnly
                  ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className={`size-3.5 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => setUnlearnedOnly(!unlearnedOnly)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                unlearnedOnly
                  ? 'border-teal-500/40 bg-teal-500/15 text-teal-300'
                  : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="size-3.5" />
              <span>To Practice</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/80">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                categoryFilter === cat
                  ? 'border border-teal-500/30 bg-teal-500/15 text-teal-300 font-bold'
                  : 'border border-slate-800/60 bg-slate-950/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400">
          <AlertCircle className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Content */}
      {activeTab === 'library' ? (
        isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shimmer" />
            ))}
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 py-20 text-center space-y-3">
            <BookOpen className="mx-auto size-12 text-slate-600 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-200">No vocabulary words found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your active search filters or click "Add Term" to start building your custom word list.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWords.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ y: -4 }}
                className={`glass-card glass-card-hover relative flex flex-col justify-between rounded-2xl p-6 shadow-xl ${
                  item.isLearned ? 'opacity-85' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg border border-teal-500/20 bg-teal-500/10 px-2.5 py-1 text-[11px] font-bold text-teal-300">
                        {item.category}
                      </span>
                      <span className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-400">
                        {item.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => speakText(item.word)}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-teal-300 transition ${
                          speakingWord === item.word ? 'text-teal-400 animate-pulse' : ''
                        }`}
                        title="Listen Pronunciation"
                      >
                        <Volume2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleToggleFavorite(item._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 transition"
                        title="Toggle Favorite"
                      >
                        <Star
                          className={`size-4 ${item.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{item.word}</h3>
                    <p className="text-xs font-semibold text-teal-300 mt-1">{item.meaning}</p>
                  </div>

                  {item.example && (
                    <p className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3 text-xs italic text-slate-300">
                      "{item.example}"
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
                  <button
                    onClick={() => handleToggleLearned(item._id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                      item.isLearned
                        ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="size-3.5" />
                    <span>{item.isLearned ? 'Learned' : 'Mark Learned'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
                      title="Edit"
                    >
                      <Edit2 className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        /* FLASHCARD DECK PRACTICE */
        <div className="mx-auto max-w-xl py-4 space-y-6">
          {flashcardDeck.length === 0 ? (
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/40 py-20 text-center space-y-3">
              <Layers className="mx-auto size-12 text-slate-600 animate-pulse" />
              <h3 className="text-lg font-bold text-slate-200">No flashcards in active deck</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add vocabulary words or reset your category search filters to start practicing flashcards.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>
                  Card <strong className="text-white font-extrabold">{cardIndex + 1}</strong> of{' '}
                  <strong className="text-white font-extrabold">{flashcardDeck.length}</strong>
                </span>

                <button
                  onClick={handleShuffleDeck}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-slate-300 hover:border-slate-700 hover:text-white transition"
                >
                  <Shuffle className="size-3.5 text-teal-400" />
                  <span>Shuffle Deck</span>
                </button>
              </div>

              {/* Card Container */}
              <motion.div
                onClick={() => setIsFlipped(!isFlipped)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="relative h-80 cursor-pointer select-none rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-8 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                <div className="bg-ambient-glow -top-10 -right-10 h-48 w-48 bg-teal-500/10" />

                <div className="flex items-center justify-between relative z-10">
                  <span className="rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-300">
                    {currentFlashcard?.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakText(currentFlashcard?.word);
                      }}
                      className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-teal-300"
                    >
                      <Volume2 className="size-4" />
                    </button>
                    <span className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-400">
                      {currentFlashcard?.level}
                    </span>
                  </div>
                </div>

                {/* Card Content flip simulation */}
                <div className="text-center relative z-10 space-y-3">
                  {!isFlipped ? (
                    <div>
                      <h2 className="text-3xl font-black text-white sm:text-4xl tracking-tight">
                        {currentFlashcard?.word}
                      </h2>
                      <p className="text-xs font-semibold text-slate-500 mt-3">
                        Click card to reveal meaning & example sentence
                      </p>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-teal-400">Meaning</p>
                      <h3 className="text-xl font-bold text-white">{currentFlashcard?.meaning}</h3>
                      {currentFlashcard?.example && (
                        <p className="text-xs italic text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 mt-2">
                          "{currentFlashcard?.example}"
                        </p>
                      )}
                    </motion.div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 relative z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLearned(currentFlashcard._id);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                      currentFlashcard?.isLearned
                        ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="size-4" />
                    <span>{currentFlashcard?.isLearned ? 'Learned' : 'Mark Learned'}</span>
                  </button>

                  <span className="text-[11px] font-semibold text-slate-500 inline-flex items-center gap-1">
                    <RotateCw className="size-3.5 text-teal-400" />
                    <span>Click to Flip</span>
                  </span>
                </div>
              </motion.div>

              {/* Navigation controls */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevCard}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-700 transition"
                >
                  <ChevronLeft className="size-4 text-teal-400" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNextCard}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 transition"
                >
                  <span>Next Card</span>
                  <ChevronRight className="size-4 text-slate-950" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white">
                {editingItem ? 'Edit Vocabulary Term' : 'Add New Vocabulary Term'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-400">
                <AlertCircle className="size-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveWord} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Word or Phrase *
                </label>
                <input
                  type="text"
                  required
                  value={formData.word}
                  onChange={(e) => setFormData({ ...formData, word: e.target.value })}
                  placeholder="e.g. Eloquent"
                  className="glass-input w-full rounded-xl px-3.5 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Meaning & Definition *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.meaning}
                  onChange={(e) => setFormData({ ...formData, meaning: e.target.value })}
                  placeholder="e.g. Expressing oneself fluently and articulately."
                  className="glass-input w-full rounded-xl px-3.5 py-2 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Example Sentence (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.example}
                  onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                  placeholder="e.g. Her speech was eloquent and inspiring."
                  className="glass-input w-full rounded-xl px-3.5 py-2 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Difficulty Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="glass-input w-full rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 cursor-pointer"
                  >
                    {LEVELS.filter((l) => l !== 'All').map((lvl) => (
                      <option key={lvl} value={lvl} className="bg-slate-900 text-slate-200">
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-6 py-2 text-xs font-black text-slate-950 shadow-lg shadow-teal-500/20 hover:brightness-110 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingItem ? 'Save Changes' : 'Add Term'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
