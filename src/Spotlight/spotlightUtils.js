const alphabetize = (path) => (a, b) =>
  path ? a[path].localeCompare(b[path]) : a.localeCompare(b);

/**
 * Takes list of results from API and groups them by type
 * into this model:
 *
 * [
 *  {
 *    items: ['facebook/224', 'facebook/384'],
 *    type: 'image-classification'
 *   }
 * ]
 *
 * Note:
 * This code could be further optimized by using a
 * sorting algorithm if performance was a bottleneck.
 */
export const sortResultsByType = (results = []) => {
  const types = {};

  return results
    .reduce((acc, curr) => {
      const { type: currType } = curr.item;

      // Handle new "type".
      if (!types[currType]) {
        types[currType] = { type: currType, items: [curr.item] };
        acc = [...acc, types[currType]];
      } else {
        // Handle previously encountered "type".
        types[currType].items = [...types[currType].items, curr.item].sort(
          alphabetize('id')
        );
      }

      return acc;
    }, [])
    .sort(alphabetize('type'));
};
