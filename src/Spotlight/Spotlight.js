import './spotlight.css';
import { useEffect, useCallback, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { search } from '../API';
import * as KEYS from '../keys';
import SearchIcon from './SearchIcon';
import SpotlightResults from './SpotlightResults';
import { sortResultsByType } from './spotlightUtils';

const Spotlight = ({ setSelected, spotlightVisible, setSpotlightVisible }) => {
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState(null);
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  // Handle global hotkey events.
  const handleKeydown = useCallback(
    (event) => {
      const { ctrlKey, metaKey, which } = event;

      if (which === KEYS.ESC_KEY) {
        setSpotlightVisible(false);
      }

      if ((metaKey || ctrlKey) && which === KEYS.K_KEY) {
        setSpotlightVisible(!spotlightVisible);
      }
    },
    [spotlightVisible, setSpotlightVisible]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeydown);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  useEffect(() => {
    // Focus the input when it becomes visible to save the user an extra click.
    if (spotlightVisible) {
      focusTextInput(true);
    }
  }, [spotlightVisible]);

  // Fetch search results only when the debounced query value changes.
  useEffect(() => {
    if (typeof debouncedQuery === 'string') {
      // Clear results if query is cleared/empty.
      if (!debouncedQuery) {
        return setResults(null);
      }

      // Assuming that an array will always be returned from 'search'.
      const searchResponse = search(debouncedQuery);
      const sortedResults = sortResultsByType(searchResponse);
      setResults(sortedResults);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    focusResultItemNode(activeTypeIndex, activeItemIndex);
  }, [activeItemIndex, activeTypeIndex]);

  useEffect(() => {
    /**
     * Reset the scroll position and active indices when query
     * results are updated.
     */
    if (resultsRef.current) {
      focusTextInput();
      focusResultItemNode(0, 0);
    }
  }, [results]);

  const handleInputChange = ({ target }) => {
    if (!target) return;
    setQuery(target.value);

    /**
     * Debounce updating value to avoid too many network requests
     * if this was a real situation.
     */
    debouncedHandleInputChange(target.value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleInputChange = useCallback(
    debounce((value) => setDebouncedQuery(value), 200),
    []
  );

  const focusTextInput = (selectText = false) => {
    inputRef.current.focus();
    resultsRef.current.scrollTop = 0;

    if (selectText) {
      inputRef.current.select();
    }

    setActiveTypeIndex(0);
    setActiveItemIndex(0);
  };

  /**
   * Finds the currently highlighted list item DOM node
   * inside the active "type" and focuses it.
   */
  const focusResultItemNode = (typeIndex = 0, itemIndex = 0) => {
    resultsRef?.current?.children[typeIndex]
      ?.getElementsByTagName('ul')[0]
      ?.children[itemIndex].focus();
  };

  const handleInputKeyDown = (event) => {
    switch (event.which) {
      case KEYS.ENTER_KEY: {
        setSelected(results[activeTypeIndex].items[activeItemIndex].id);
        break;
      }
      case KEYS.ARROW_UP_KEY: {
        // Prevent default scroll behavior.
        event.preventDefault();

        const isFirstItemOfType = activeItemIndex === 0;
        const hasPreviousType = !!results[activeTypeIndex - 1];

        if (isFirstItemOfType && !hasPreviousType) {
          // If at top of list, focus back to text input.
          focusTextInput(true);
        } else if (isFirstItemOfType && hasPreviousType) {
          // Move focus to previous "type" in results.
          setActiveTypeIndex(activeTypeIndex - 1);
          setActiveItemIndex(results[activeTypeIndex - 1].items.length - 1);
        } else {
          setActiveItemIndex(activeItemIndex - 1);
        }

        break;
      }
      case KEYS.ARROW_DOWN_KEY: {
        // Prevent default scroll behavior.
        event.preventDefault();

        const isLastItemOfType =
          activeItemIndex === results[activeTypeIndex].items.length - 1;

        const hasNextType = !!results[activeTypeIndex + 1];

        if (isLastItemOfType && hasNextType) {
          // Move focus to next "type" in results.
          setActiveTypeIndex(activeTypeIndex + 1);
          setActiveItemIndex(0);
        } else if (isLastItemOfType && !hasNextType) {
          // If last item and type, focus back to top of list.
          setActiveTypeIndex(0);
          setActiveItemIndex(0);
        } else {
          setActiveItemIndex(activeItemIndex + 1);
        }

        break;
      }
      default:
        // Continue typing in text input...
        inputRef.current.focus();
    }
  };

  const handleInputClick = ({ target }) => target.select();

  const handleResultClick = ({ currentTarget }) => {
    // Convert string to number to avoid '9'+1 = 91.
    const typeIndex = Number(currentTarget.getAttribute('data-type-index'));
    const itemIndex = Number(currentTarget.getAttribute('data-item-index'));

    setSelected(results[typeIndex].items[itemIndex].id);
    setActiveItemIndex(itemIndex);
    setActiveTypeIndex(typeIndex);
  };

  /**
   * I Would never handle classnames like this in real project, I would use
   * a lib like 'classnames', or CSS-in-JS (styled-components, emotion etc...)
   */
  const spotlightClassName = `spotlight ${
    spotlightVisible ? 'spotlight-visible' : ''
  }`;

  return (
    <div className={spotlightClassName}>
      <input
        aria-autocomplete="list"
        autoComplete="off"
        className="spotlight-text-input"
        onChange={handleInputChange}
        onClick={handleInputClick}
        onKeyDown={handleInputKeyDown}
        placeholder="Spotlight search"
        ref={inputRef}
        role="searchbox"
        type="text"
        value={query}
      />

      <SearchIcon className="spotlight-search-icon" />

      <SpotlightResults
        activeItemIndex={activeItemIndex}
        activeTypeIndex={activeTypeIndex}
        onResultClick={handleResultClick}
        onResultKeyDown={handleInputKeyDown}
        ref={resultsRef}
        results={results}
      />
    </div>
  );
};

Spotlight.propTypes = {
  setSelected: PropTypes.func.isRequired,
  setSpotlightVisible: PropTypes.func.isRequired,
  spotlightVisible: PropTypes.bool.isRequired,
};

export default Spotlight;
