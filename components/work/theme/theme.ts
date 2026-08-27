export type Theme = "light" | "dark" | "system";
export const THEME_KEY = "orkwork-theme";

/** Resolves a Theme preference to the concrete mode to apply right now. */
export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return theme;
}

/** Inline script that sets the theme class on [data-orkwork] before paint. */
export const THEME_BOOTSTRAP = `(function(){var el=(document.currentScript&&document.currentScript.parentElement)||document.querySelector('[data-orkwork]');if(!el)return;var d=true;try{var t=localStorage.getItem('${THEME_KEY}')||'system';d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);}catch(e){}el.classList.remove('dark','light');el.classList.add(d?'dark':'light');})();`;
