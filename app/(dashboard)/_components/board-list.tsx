"use client";

import { EmptySearch } from "./empty-search";
import { EmptyFavorite } from "./empty-favorite";
import { EmptyBoard } from "./empty-board";

interface BoardListProps {
  orgId: string;
  query: {
    search?: string;
    favorite?: string;
  };
}

export function BoardList({ orgId, query }: BoardListProps) {
  const data = []; // TODO: Change to API call
  if (!data?.length && query.search) {
    return <EmptySearch />;
  }
  if (!data?.length && query.favorite) {
    return <EmptyFavorite />;
  }
  if (!data?.length) {
    return <EmptyBoard />;
  }
  return <div>{JSON.stringify(query)}</div>;
}
