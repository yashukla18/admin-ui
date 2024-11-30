export const returnPresentKeyVals = (obj?: unknown) => {
  if (!obj) return {};

  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        acc[key] =
          typeof value === 'object' || typeof value === 'boolean'
            ? (JSON.stringify(value) as typeof obj)
            : (value as typeof obj);
      }
      return acc;
    },
    {} as Record<string, typeof obj>,
  );
};
