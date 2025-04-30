export const content = [
  './app/**/*.{js,ts,jsx,tsx,mdx}', 
  './components/**/*.{js,ts,jsx,tsx,mdx}'
];
export const mode = 'jit';
export const theme = {
  extend: {
    textColor: {
      foreground: 'var(--foreground)',
      background: 'var(--background)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      accent: 'var(--accent)',
      muted: 'var(--muted)',
      accentForeground: 'var(--accent-foreground)',
      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',
      sidebarPrimary: 'var(--sidebar-primary)',
    },
    backgroundColor: {
      background: 'var(--background)',
      foreground: 'var(--foreground)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      accent: 'var(--accent)',
      muted: 'var(--muted)',
      accentForeground: 'var(--accent-foreground)',
      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',
      sidebarPrimary: 'var(--sidebar-primary)',

    }
  }
};
export const plugins = [];
