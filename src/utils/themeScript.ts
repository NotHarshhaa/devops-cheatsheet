// Runs before paint (inlined in the root layout <head>) so the correct
// theme class is on <html> from the very first frame — no flash, and the
// server HTML always renders.
export const themeScript = `
  (function() {
    try {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = storedTheme || (prefersDark ? 'dark' : 'light');

      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Ignore any errors accessing localStorage
    }
  })();
`;
