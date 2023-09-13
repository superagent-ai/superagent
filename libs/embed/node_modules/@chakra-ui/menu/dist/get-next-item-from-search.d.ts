/**
 * Gets the next item based on a search string
 *
 * @param items array of items
 * @param searchString the search string
 * @param itemToString resolves an item to string
 * @param currentItem the current selected item
 */
declare function getNextItemFromSearch<T>(items: T[], searchString: string, itemToString: (item: T) => string, currentItem: T): T | undefined;

export { getNextItemFromSearch };
