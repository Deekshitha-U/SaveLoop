import { create } from 'zustand';

// Local visual preference only: no Firebase or MongoDB request is needed.
// New visitors start in light mode; existing visitors keep their last selection.
const THEME_KEY = 'saveloop-theme';

function readTheme() {
  if (typeof window === 'undefined') return 'light';
  try {
    return window.localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

function applyTheme(theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }
  if (typeof window !== 'undefined') {
    try { window.localStorage.setItem(THEME_KEY, theme); } catch { /* storage disabled */ }
  }
}

const initialTheme = readTheme();
applyTheme(initialTheme);

export const useUIStore = create((set, get) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    if (theme !== 'light' && theme !== 'dark') return;
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => get().setTheme(get().theme === 'light' ? 'dark' : 'light'),
  sidebarOpen: false,
  view: 'grid',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),
  setView: (view) => set({ view }),
}));
