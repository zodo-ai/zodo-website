export type ListerProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemsPerPage?: number;
  // New props for API-based pagination
  hasMore?: boolean;
  loading?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  // Legacy mode for backward compatibility
  useLegacyPagination?: boolean;
};