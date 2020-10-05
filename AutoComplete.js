import React, { useState, useEffect } from 'react'

const Search = () => {
    const [searchTerm, updateSearchTerm] = useState('');
    const [filteredResults, updateFilteredResults] = useState([]);
    const [searchResults, updateSearchResults] = useState([]);
    const [displayResults, updateDisplayResults] = useState(false);
    const [focusIndex, updateFocusIndex] = useState(-1);
    const linkRefs = [];
    const keys = {
        ENTER: 13,
        UP: 38,
        DOWN: 40
    };

    useEffect(() => {
        const getSearchResults = async () => {
            // ⚠️ This is where you should pull data in from your server
            const searchResultsResponse = await getSearchResults();

            updateSearchResults(searchResultsResponse);
        };
       
        getSearchResults();
    }, []);

    const updateSearch = e => {
        updateSearchTerm(e.target.value);
        updateFilteredResults(searchResults.filter(result => result.title.match(new RegExp(e.target.value, 'gi'))))
    };

    const hideAutoSuggest = e => {
        e.persist();

        if (e.relatedTarget && e.relatedTarget.className === 'autosuggest-link') {
            return;
        }

        updateDisplayResults(true);
        updateFocusIndex(-1);
    };

    const showAutoSuggest = () => {
        updateDisplayResults(false);
    };

    const handleNavigation = e => {
        switch (e.keyCode) {
            case keys.ENTER:
                if (focusIndex !== -1)  {
                    window.open(linkRefs[focusIndex].href);
                }

                hideAutoSuggest(e);
            break;
            case keys.UP:

                if (focusIndex > -1) {
                    updateFocusIndex(focusIndex - 1);
                }
            break;
            case keys.DOWN:

                if (focusIndex < filteredResults.length - 1) {
                    updateFocusIndex(focusIndex + 1);
                }
            break;
        }
    };

    const SearchResults = () => {
        const Message = ({ text }) => (
            <div className="search-results-message">
                <h2>{text}</h2>
                <hr />
            </div>
        );

        if (!displayResults) {
            return null;
        }

        if (!searchResults.length) {
            return <Message text="Loading search results" />
        }

        if (!searchTerm) {
            return <Message text="Try to search for something..." />
        }

        if (!filteredResults.length) {
            return <Message text="We couldn't find anything for your search term." />
        }

        return (
            <ul className="search-results">
                {filteredResults.map((article, index) => (
                    <li key={index}>
                        {/* ⚠️ You may want to outsource this part to make the component less heavy */}
                        <Card model={article} />
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section className="search">
            <h1>Search {searchTerm.length ? `results for: ${searchTerm}` : null}</h1>
            <input type="text"
                    placeholder="Search for tutorials..."
                    onKeyUp={updateSearch}
                    onKeyDown={handleNavigation}
                    onBlur={hideAutoSuggest}
                    onFocus={showAutoSuggest} />
            <ul className="search-suggestions">
                {(!displayResults && searchTerm) && <li key="-1" className={focusIndex === -1 ? 'active' : null}>{`Search for ${searchTerm}`}</li>}
                {!displayResults && filteredResults.map((article, index) => (
                    <li key={index} className={focusIndex === index ? 'active' : null}>
                        <a href={article.link} target="_blank" className="autosuggest-link"
                            ref={link => {linkRefs[index] = link}}>
                            {article.title}
                        </a>
                    </li>
                ))}
            </ul>
            <SearchResults />
        </section>
    );
}

export default Search;