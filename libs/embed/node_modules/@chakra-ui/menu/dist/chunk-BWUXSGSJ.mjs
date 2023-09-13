'use client'

// src/get-next-item-from-search.ts
function getNextItemFromSearch(items, searchString, itemToString, currentItem) {
  if (searchString == null) {
    return currentItem;
  }
  if (!currentItem) {
    const foundItem = items.find(
      (item) => itemToString(item).toLowerCase().startsWith(searchString.toLowerCase())
    );
    return foundItem;
  }
  const matchingItems = items.filter(
    (item) => itemToString(item).toLowerCase().startsWith(searchString.toLowerCase())
  );
  if (matchingItems.length > 0) {
    let nextIndex;
    if (matchingItems.includes(currentItem)) {
      const currentIndex = matchingItems.indexOf(currentItem);
      nextIndex = currentIndex + 1;
      if (nextIndex === matchingItems.length) {
        nextIndex = 0;
      }
      return matchingItems[nextIndex];
    }
    nextIndex = items.indexOf(matchingItems[0]);
    return items[nextIndex];
  }
  return currentItem;
}

export {
  getNextItemFromSearch
};
//# sourceMappingURL=chunk-BWUXSGSJ.mjs.map