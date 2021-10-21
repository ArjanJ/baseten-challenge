import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import AuthorIcon from './AuthorIcon';

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
                {items?.map(({ author, id, modified }, j) => {
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
                      <p className="spotlight-results-sublist-item-id">
                        <span>{id}</span>
                        <span>
                          <AuthorIcon className="spotlight-results-sublist-item-author-icon" />
                          <span className="spotlight-results-sublist-item-author">
                            {author}
                          </span>
                        </span>
                      </p>
                      <p className="spotlight-results-sublist-item-date">
                        Updated: {new Date(modified).toLocaleString()}
                      </p>
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

SpotlightResults.propTypes = {
  activeItemIndex: PropTypes.number.isRequired,
  activeTypeIndex: PropTypes.number.isRequired,
  onResultClick: PropTypes.func.isRequired,
  onResultKeyDown: PropTypes.func.isRequired,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          author: PropTypes.string,
          id: PropTypes.string,
          modified: PropTypes.number,
        })
      ).isRequired,
      type: PropTypes.string.isRequired,
    })
  ),
};

export default SpotlightResults;
