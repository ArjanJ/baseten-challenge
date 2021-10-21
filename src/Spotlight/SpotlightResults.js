import { forwardRef } from 'react';

const SpotlightResults = forwardRef(
  (
    {
      activeItemIndex,
      activeTypeIndex,
      onResultClick,
      onResultKeyDown,
      results,
    },
    ref
  ) => {
    return (
      <ul
        className="spotlight-results"
        id="results"
        ref={ref}
        role="listbox"
        tabIndex="0"
      >
        {results?.map(({ items, type }, i) => {
          const isTypeActive = i === activeTypeIndex;

          return (
            <li className="spotlight-results-group" key={type}>
              <h4 className="spotlight-results-group-heading">{type}</h4>
              <ul className="spotlight-results-sublist">
                {items?.map((id, j) => {
                  const isItemActive = isTypeActive && j === activeItemIndex;

                  return (
                    <li
                      aria-selected={isItemActive}
                      className="spotlight-results-sublist-item"
                      data-item-index={j}
                      data-type-index={i}
                      key={id}
                      onClick={onResultClick}
                      onKeyDown={onResultKeyDown}
                      role="option"
                      tabIndex={isItemActive ? '0' : '-1'}
                    >
                      {id}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}

        {Array.isArray(results) && results.length === 0 && (
          <div className="spotlight-no-results">No results found</div>
        )}
      </ul>
    );
  }
);

export default SpotlightResults;