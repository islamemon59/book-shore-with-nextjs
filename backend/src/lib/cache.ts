import NodeCache from "node-cache";

// A light in-memory cache is enough for frequently-read catalog queries.
export const appCache = new NodeCache({
  stdTTL: 60 * 10,
  checkperiod: 60,
  useClones: false,
});

export const cacheKeys = {
  categories: "catalog:categories",
  featured: "catalog:featured",
  homepage: "catalog:homepage",
  books: (queryKey: string) => `catalog:books:${queryKey}`,
  book: (slug: string) => `catalog:book:${slug}`,
};
