/* Theme-aware class sets for status / badge colours.
   Built on the --tone-* CSS variables (defined per theme in work.css), so the
   same classes read correctly in light and dark. */

export type Tone =
  | "neutral"
  | "info"
  | "progress"
  | "warn"
  | "positive"
  | "muted"
  | "primary";

export const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-border text-muted-foreground",
  info: "border-tone-info/30 bg-tone-info/10 text-tone-info",
  progress: "border-tone-progress/30 bg-tone-progress/10 text-tone-progress",
  warn: "border-tone-warn/30 bg-tone-warn/10 text-tone-warn",
  positive: "border-tone-positive/30 bg-tone-positive/10 text-tone-positive",
  muted: "border-border/60 text-muted-foreground/70",
  primary: "border-primary/30 bg-primary/10 text-primary",
};

export const TONE_DOT: Record<Tone, string> = {
  neutral: "bg-muted-foreground",
  info: "bg-tone-info",
  progress: "bg-tone-progress",
  warn: "bg-tone-warn",
  positive: "bg-tone-positive",
  muted: "bg-muted-foreground/60",
  primary: "bg-primary",
};
