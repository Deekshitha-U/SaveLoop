import { create } from 'zustand';
import { aiService } from '../services/aiService';

// Only the greeting is shown when a new account/session starts.
const welcomeMessages = () => [
  {
    id: 'hello',
    role: 'assistant',
    text: 'Hi! 👋 Ask me to find a bookmark you saved.',
  },
];

export const useAIStore = create((set, get) => ({
  open: false,
  loading: false,
  messages: welcomeMessages(),
  sessionKey: null,
  requestVersion: 0,

  // Called on login, account change and logout.
  // Changing the session invalidates responses from previous accounts.
  setSession: (userId) => {
    const newKey = userId ? String(userId) : null;
    set((state) => {
      if (state.sessionKey === newKey) return state;
      return {
        sessionKey: newKey,
        requestVersion: state.requestVersion + 1,
        messages: welcomeMessages(),
        loading: false,
        open: false,
      };
    });
  },

  toggle: () => set((state) => ({ open: !state.open })),
  setOpen: (open) => set({ open: Boolean(open) }),

  send: async (message) => {
    const text = String(message ?? '').trim();
    const { sessionKey, requestVersion } = get();
    if (!text || !sessionKey || get().loading) return;

    const isCurrentSession = () =>
      get().sessionKey === sessionKey &&
      get().requestVersion === requestVersion;

    set((state) => ({
      loading: true,
      messages: [
        ...state.messages,
        { id: `${Date.now()}-user`, role: 'user', text },
      ],
    }));

    try {
      const data = await aiService.chat(text);
      if (!isCurrentSession()) return;

      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: `${Date.now()}-assistant`,
            role: 'assistant',
            text: data.answer,
            bookmarks: data.bookmarks || [],
          },
        ],
      }));
    } catch (error) {
      if (!isCurrentSession()) return;

      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: `${Date.now()}-error`,
            role: 'assistant',
            text: `Sorry, search is unavailable: ${error.message}`,
          },
        ],
      }));
    } finally {
      // Never write a previous user's result into a new login session.
      if (isCurrentSession()) set({ loading: false });
    }
  },

  // Clears the visible conversation without deleting server-stored history.
  clear: () =>
    set((state) => ({
      messages: welcomeMessages(),
      loading: false,
      requestVersion: state.requestVersion + 1,
    })),
}));
