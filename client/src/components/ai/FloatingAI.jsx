import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Sparkles, ArrowUpRight, RotateCcw } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { isSafeExternalUrl } from '../../utils/platformUtils';
import { recordBookmarkVisit } from '../../utils/bookmarkVisit';

export default function FloatingAI() {
  const { open, toggle, loading, messages, send, clear, sessionKey } = useAIStore();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const [text, setText] = useState('');
  const [completedIds, setCompletedIds] = useState({});
  const currentSession = useRef(sessionKey);
  currentSession.current = sessionKey;

  // Never carry drafts or displayed results into another account's session.
  useEffect(() => {
    setText('');
    setCompletedIds({});
  }, [sessionKey]);

  function submit(event) {
    event.preventDefault();
    if (!text.trim() || loading || !sessionKey) return;
    send(text.trim());
    setText('');
  }

  function getCurrentStatus(bookmark) {
    const id = bookmark._id || bookmark.id;
    const stored = bookmarks.find((item) => item._id === id);
    return completedIds[id] || stored?.status || bookmark.status;
  }

  const onOpenOriginal = (bookmark) => {
    const id = bookmark._id || bookmark.id;
    const clickedSession = currentSession.current;
    recordBookmarkVisit({ ...bookmark, status: getCurrentStatus(bookmark) }, (updated) => {
      if (currentSession.current !== clickedSession) return;
      // AI result cards should also show Completed immediately after the update.
      setCompletedIds((old) => ({ ...old, [id]: updated.status }));
    });
  };

  return (
    <div className="ai-root">
      <AnimatePresence>
        {open && (
          <motion.section
            className="ai-panel"
            role="dialog"
            aria-label="SaveLoop AI assistant"
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.95 }}
          >
            <div className="ai-header">
              <div className="ai-avatar"><Bot size={23} /></div>
              <div>
                <strong>SaveLoop AI</strong>
                <small>Search your saved universe</small>
              </div>
              <button className="icon-btn" onClick={clear} title="Reset visible chat" aria-label="Reset visible chat">
                <RotateCcw size={17} />
              </button>
              <button className="icon-btn" onClick={toggle} aria-label="Close AI chat">
                <X size={19} />
              </button>
            </div>

            <div className="ai-messages">
              {messages.map((message) => (
                <div className={`chat-line chat-${message.role}`} key={message.id}>
                  {message.role === 'assistant' && (
                    <span className="chat-avatar"><Sparkles size={14} /></span>
                  )}
                  <div>
                    <div className="chat-bubble">{message.text}</div>
                    {message.bookmarks?.length > 0 && (
                      <div className="ai-results">
                        {message.bookmarks.map((bookmark) => {
                          const id = bookmark.id || bookmark._id;
                          const safe = isSafeExternalUrl(bookmark.url);
                          const status = getCurrentStatus(bookmark);
                          return (
                            <a
                              key={id}
                              href={safe ? bookmark.url : '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-disabled={!safe}
                              onClick={(event) => {
                                if (!safe) event.preventDefault();
                                else onOpenOriginal(bookmark);
                              }}
                            >
                              <span>
                                <strong>{bookmark.title}</strong>
                                <small>{bookmark.platform} · {status}</small>
                              </span>
                              <ArrowUpRight size={16} />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-line chat-assistant">
                  <span className="chat-avatar"><Sparkles size={14} /></span>
                  <div className="typing"><i /><i /><i /></div>
                </div>
              )}
            </div>

            <div className="ai-prompts">
              <button onClick={() => send('Find my saved React resources')} disabled={loading}>
                Find React saves
              </button>
              <button onClick={() => send('Show pending bookmarks')} disabled={loading}>
                Pending items
              </button>
            </div>

            <form className="ai-composer" onSubmit={submit}>
              <input
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Ask about your saved links..."
                maxLength={500}
              />
              <button aria-label="Send message" disabled={loading || !text.trim() || !sessionKey}>
                <Send size={17} />
              </button>
            </form>
            <small className="ai-disclaimer">Answers come from your saved bookmark metadata.</small>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        className="ai-fab"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={toggle}
      >
        {open ? <X size={25} /> : <><Sparkles size={22} /><span className="fab-spark" /></>}
      </motion.button>
    </div>
  );
}
