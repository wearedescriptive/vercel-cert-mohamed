"use client";

import type { ReactNode } from "react";
import { SearchResultsSkeleton } from "./search-results-skeleton";

type SearchFormPendingAreaProps = {
  children: ReactNode;
  /** True while the search server action is running (`useActionState` pending). */
  pending: boolean;
};

export function SearchFormPendingArea({
  children,
  pending,
}: SearchFormPendingAreaProps) {
  if (pending) {
    return <SearchResultsSkeleton />;
  }

  return <>{children}</>;
}
