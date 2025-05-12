export type ListerProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  itemsPerPage?: number;
};