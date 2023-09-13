// src/array.ts
function getFirstItem(array) {
  return array != null && array.length ? array[0] : void 0;
}
function getLastItem(array) {
  const length = array == null ? 0 : array.length;
  return length ? array[length - 1] : void 0;
}
function getPrevItem(index, array, loop = true) {
  const prevIndex = getPrevIndex(index, array.length, loop);
  return array[prevIndex];
}
function getNextItem(index, array, loop = true) {
  const nextIndex = getNextIndex(index, array.length, 1, loop);
  return array[nextIndex];
}
function removeIndex(array, index) {
  return array.filter((_, idx) => idx !== index);
}
function addItem(array, item) {
  return [...array, item];
}
function removeItem(array, item) {
  return array.filter((eachItem) => eachItem !== item);
}
function getNextIndex(currentIndex, length, step = 1, loop = true) {
  const lastIndex = length - 1;
  if (currentIndex === -1) {
    return step > 0 ? 0 : lastIndex;
  }
  const nextIndex = currentIndex + step;
  if (nextIndex < 0) {
    return loop ? lastIndex : 0;
  }
  if (nextIndex >= length) {
    if (loop)
      return 0;
    return currentIndex > length ? length : currentIndex;
  }
  return nextIndex;
}
function getPrevIndex(index, count, loop = true) {
  return getNextIndex(index, count, -1, loop);
}
function chunk(array, size) {
  return array.reduce((rows, currentValue, index) => {
    if (index % size === 0) {
      rows.push([currentValue]);
    } else {
      rows[rows.length - 1].push(currentValue);
    }
    return rows;
  }, []);
}
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
  getFirstItem,
  getLastItem,
  getPrevItem,
  getNextItem,
  removeIndex,
  addItem,
  removeItem,
  getNextIndex,
  getPrevIndex,
  chunk,
  getNextItemFromSearch
};
