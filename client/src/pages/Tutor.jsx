import { AlertCircle, Bot, Menu, MessageSquare, RotateCcw, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatComposer from '../components/tutor/ChatComposer.jsx';
import ConversationList from '../components/tutor/ConversationList.jsx';
import MessageBubble from '../components/tutor/MessageBubble.jsx';
import TypingIndicator from '../components/tutor/TypingIndicator.jsx';
import useAuthStore from '../context/authStore.js';
import {
  createConversation,
  getConversations,
  getMessages,
  regenerateMessage,
  removeConversation,
  sendMessage,
  updateConversation,
} from '../services/conversationService.js';
import { getApiError } from '../services/api.js';

const PROMPT_SUGGESTIONS = [
  'Help me practice ordering food at a restaurant',
  'Check and correct my past tense grammar',
  'Roleplay a job interview in English',
  'Explain the difference between "affect" and "effect"',
];

function Tutor({ openHistory = false }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [regeneratingMessageId, setRegeneratingMessageId] = useState(null);
  const isConversationsTab = location.pathname === '/conversations' || openHistory;
  const [isHistoryOpen, setIsHistoryOpen] = useState(isConversationsTab);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (isConversationsTab) {
      setIsHistoryOpen(true);
    }
  }, [location.pathname, isConversationsTab]);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending]);

  async function loadConversations(selectFirst = true) {
    setIsLoadingConversations(true);
    setError('');
    try {
      const nextConversations = await getConversations();
      setConversations(nextConversations);
      if (selectFirst && nextConversations.length > 0) await selectConversation(nextConversations[0]);
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to load your conversations.'));
    } finally {
      setIsLoadingConversations(false);
    }
  }

  async function selectConversation(conversation) {
    setActiveConversation(conversation);
    setMessages([]);
    setIsLoadingMessages(true);
    setError('');
    try {
      setMessages(await getMessages(conversation._id));
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to load this conversation.'));
    } finally {
      setIsLoadingMessages(false);
      setIsHistoryOpen(false);
    }
  }

  async function handleCreateConversation() {
    setError('');
    try {
      const conversation = await createConversation({
        language: user?.learningLanguage === 'Not selected' ? 'English' : user?.learningLanguage || 'English',
      });
      setConversations((current) => [conversation, ...current]);
      setActiveConversation(conversation);
      setMessages([]);
      setIsHistoryOpen(false);
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to create a conversation.'));
    }
  }

  async function handleRenameConversation(conversation) {
    const title = window.prompt('Rename conversation', conversation.title);
    if (!title?.trim() || title.trim() === conversation.title) return;
    try {
      const updatedConversation = await updateConversation(conversation._id, { title: title.trim() });
      setConversations((current) =>
        current.map((item) => (item._id === updatedConversation._id ? { ...item, ...updatedConversation } : item))
      );
      if (activeConversation?._id === updatedConversation._id) setActiveConversation(updatedConversation);
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to rename this conversation.'));
    }
  }

  async function handleDeleteConversation(conversation) {
    if (!window.confirm(`Delete "${conversation.title}"? This cannot be undone.`)) return;
    try {
      await removeConversation(conversation._id);
      const nextConversations = conversations.filter((item) => item._id !== conversation._id);
      setConversations(nextConversations);
      if (activeConversation?._id === conversation._id) {
        setActiveConversation(null);
        setMessages([]);
        if (nextConversations[0]) await selectConversation(nextConversations[0]);
      }
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to delete this conversation.'));
    }
  }

  async function handleSend(content) {
    setError('');
    let conversation = activeConversation;
    setIsSending(true);

    try {
      if (!conversation) {
        conversation = await createConversation({
          language: user?.learningLanguage === 'Not selected' ? 'English' : user?.learningLanguage || 'English',
        });
        setConversations((current) => [conversation, ...current]);
        setActiveConversation(conversation);
      }

      const optimisticMessage = { _id: `pending-${Date.now()}`, role: 'user', content };
      setMessages((current) => [...current, optimisticMessage]);
      const result = await sendMessage(conversation._id, content);
      setMessages((current) => [
        ...current.filter((message) => message._id !== optimisticMessage._id),
        result.message,
        result.assistantMessage,
      ]);
      setActiveConversation(result.conversation);
      setConversations((current) => [
        result.conversation,
        ...current.filter((item) => item._id !== result.conversation._id),
      ]);
    } catch (requestError) {
      setMessages((current) => current.filter((message) => !message._id.startsWith('pending-')));
      setError(getApiError(requestError, 'Unable to send your message.'));
    } finally {
      setIsSending(false);
    }
  }

  async function handleRegenerate(message) {
    if (!activeConversation || regeneratingMessageId) return;
    setRegeneratingMessageId(message._id);
    setError('');
    try {
      const regeneratedMessage = await regenerateMessage(activeConversation._id, message._id);
      setMessages((current) =>
        current.map((item) => (item._id === regeneratedMessage._id ? regeneratedMessage : item))
      );
    } catch (requestError) {
      setError(getApiError(requestError, 'Unable to regenerate this response.'));
    } finally {
      setIsRegeneratingMessageId(null);
    }
  }

  const historyPanel = (
    <ConversationList
      conversations={conversations}
      activeConversationId={activeConversation?._id}
      isLoading={isLoadingConversations}
      onCreate={handleCreateConversation}
      onDelete={handleDeleteConversation}
      onRename={handleRenameConversation}
      onSelect={selectConversation}
    />
  );

  return (
    <section className="-m-4 h-[calc(100vh-5rem)] overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 text-slate-100 shadow-2xl backdrop-blur-xl sm:-m-6 lg:-m-8">
      <div className="flex h-full">
        {/* Desktop Sidebar Panel */}
        <div className="hidden md:block">{historyPanel}</div>

        {/* Mobile History Drawer */}
        {isHistoryOpen && (
          <div className="absolute inset-0 z-40 flex md:hidden">
            <button
              type="button"
              onClick={() => setIsHistoryOpen(false)}
              className="flex-1 bg-slate-950/80 backdrop-blur-sm"
              aria-label="Close conversations"
            />
            <div className="h-full shadow-2xl z-10">{historyPanel}</div>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex min-w-0 flex-1 flex-col bg-slate-950/60">
          {/* Header Bar */}
          <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4 sm:px-6 backdrop-blur-md bg-slate-900/60">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setIsHistoryOpen(true)}
                className="grid size-9 place-items-center rounded-xl border border-slate-800 text-slate-400 hover:text-white md:hidden"
                title="Open conversations"
                aria-label="Open conversations"
              >
                <Menu className="size-5" />
              </button>
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-slate-100">
                  {activeConversation?.title || 'AI Conversational Tutor'}
                </h2>
                <p className="truncate text-xs text-teal-400 font-semibold">
                  Language: {activeConversation?.language || user?.learningLanguage || 'English'}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div role="alert" className="m-4 flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 p-4 text-xs font-semibold text-rose-400">
              <AlertCircle className="size-5 shrink-0" />
              <span>{error}</span>
              <button
                type="button"
                onClick={() => loadConversations(false)}
                className="ml-auto grid size-7 place-items-center rounded-lg hover:bg-rose-500/20"
                title="Retry"
              >
                <RotateCcw className="size-4" />
              </button>
            </div>
          )}

          {/* Chat Scroll Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {isLoadingMessages ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-xs text-slate-400 font-medium">Loading session dialogue...</p>
              </div>
            ) : messages.length > 0 ? (
              <div className="mx-auto flex max-w-3xl flex-col gap-6">
                {messages.map((message) => (
                  <MessageBubble
                    key={message._id}
                    message={message}
                    isRegenerating={regeneratingMessageId === message._id}
                    onRegenerate={handleRegenerate}
                  />
                ))}
                {isSending && <TypingIndicator />}
                <div ref={bottomRef} />
              </div>
            ) : (
              /* Empty state with prompt suggestions */
              <div className="mx-auto flex h-full max-w-lg flex-col items-center justify-center text-center space-y-6">
                <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-black shadow-xl shadow-teal-500/20">
                  <Bot className="size-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">Start Your AI Conversation</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Practice real-world dialogues, ask grammar questions, or roleplay scenarios in {activeConversation?.language || user?.learningLanguage || 'English'}.
                  </p>
                </div>

                {/* Prompt Suggestions */}
                <div className="w-full space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Try a starter prompt:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(suggestion)}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-left text-xs font-semibold text-slate-300 hover:border-teal-500/40 hover:text-teal-300 transition"
                      >
                        <Sparkles className="size-3 text-teal-400 mb-1 inline mr-1.5" />
                        "{suggestion}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <ChatComposer disabled={isSending || isLoadingMessages} onSend={handleSend} />
        </div>
      </div>
    </section>
  );
}

export default Tutor;
