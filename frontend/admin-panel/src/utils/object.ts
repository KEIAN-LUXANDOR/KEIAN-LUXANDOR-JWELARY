/** A copy of a record without its id — the starting values for an edit form. */
export const omitId = <T extends { id: string }>(item: T): Omit<T, 'id'> => {
  const { id, ...rest } = item;
  void id;
  return rest;
};
