// Global PostCSS config required by Tailwind v4.
// This is a no-op for `app/globals.css` (the public marketing site) because that
// file contains no Tailwind directives (@import "tailwindcss", @theme, @apply).
// Tailwind only compiles `app/work/work.css`, which is scoped to the /work module.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
