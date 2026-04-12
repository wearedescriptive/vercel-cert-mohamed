"use client";

type SearchSubmitButtonProps = {
  pending: boolean;
};

export function SearchSubmitButton({ pending }: SearchSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 shrink-0 rounded-md bg-foreground px-5 text-sm font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Searching…" : "Search"}
    </button>
  );
}
