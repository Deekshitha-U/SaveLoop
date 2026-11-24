import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, DEMO_MODE, firebaseReady } from '../config/firebase';
import { api } from '../services/api';
import { demoSession } from '../services/demoService';
import * as authService from '../services/authService';
import { useBookmarkStore } from './bookmarkStore';
import { useAIStore } from './aiStore';
import { useCategoryStore } from './categoryStore';

let authChangeVersion = 0;

const userKey = (user) => user?.firebaseUid || user?._id || user?.uid || null;

// Remove private data from browser memory whenever a session ends.
function resetPrivateState() {
  useAIStore.getState().setSession(null);
  useBookmarkStore.getState().clear();
  useCategoryStore.getState().clear();
}

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  bootstrap: () => {
    if (DEMO_MODE) {
      const user = demoSession.get();
      useAIStore.getState().setSession(userKey(user));
      set({ user, loading: false });
      return () => {};
    }

    if (!firebaseReady) {
      resetPrivateState();
      set({ user: null, loading: false });
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      const version = ++authChangeVersion;

      if (!firebaseUser) {
        resetPrivateState();
        set({ user: null, loading: false });
        return;
      }

      // Changing from account A to account B must never reuse A's chat.
      if (userKey(get().user) && userKey(get().user) !== firebaseUser.uid) {
        useBookmarkStore.getState().clear();
        useCategoryStore.getState().clear();
        set({ user: null, loading: true });
      }
      useAIStore.getState().setSession(firebaseUser.uid);

      try {
        const { data } = await api.post('/users/sync');

        // A logout/account change may have happened during the request.
        if (
          version !== authChangeVersion ||
          auth.currentUser?.uid !== firebaseUser.uid
        ) return;

        set({ user: data.user, loading: false });
      } catch (error) {
        if (
          version !== authChangeVersion ||
          auth.currentUser?.uid !== firebaseUser.uid
        ) return;

        console.error('Auth profile sync failed', error);
        resetPrivateState();
        set({ user: null, loading: false });
      }
    });
  },

  login: async (email, password) => {
    const user = await authService.login(email, password);
    useAIStore.getState().setSession(userKey(user));
    set({ user, loading: false });
    return user;
  },

  signup: async (name, email, password) => {
    const user = await authService.signup(name, email, password);
    useAIStore.getState().setSession(userKey(user));
    set({ user, loading: false });
    return user;
  },

  logout: async () => {
    await authService.logout();
    ++authChangeVersion;
    resetPrivateState();
    set({ user: null, loading: false });
  },

  updateProfile: async (body) => {
    const user = await authService.saveProfile(body);
    set({ user });
    return user;
  },
}));
