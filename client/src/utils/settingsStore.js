const SETTINGS_KEY = 'language_hub_settings';

export const DEFAULT_SETTINGS = {
  theme: 'dark', // 'dark' | 'light' | 'system'
  dailyGoal: 30, // 15 | 30 | 45 | 60
  notifications: {
    dailyReminder: true,
    lessonReminder: true,
    achievementAlerts: true,
  },
};

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      notifications: {
        ...DEFAULT_SETTINGS.notifications,
        ...(parsed.notifications || {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(newSettings) {
  try {
    const current = getStoredSettings();
    const updated = {
      ...current,
      ...newSettings,
      notifications: {
        ...current.notifications,
        ...(newSettings.notifications || {}),
      },
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    applyThemeSetting(updated.theme);
    return updated;
  } catch (err) {
    console.error('Failed to save settings:', err);
    return newSettings;
  }
}

export function applyThemeSetting(theme) {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else if (theme === 'dark') {
    root.classList.remove('light');
    root.classList.add('dark');
  } else if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      root.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }
}

// Auto-apply theme on load
if (typeof window !== 'undefined') {
  applyThemeSetting(getStoredSettings().theme);
}
