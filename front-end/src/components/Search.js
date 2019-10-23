import React, { PureComponent } from 'react';

import { fetchKeywordSuggestions } from '../requests/Requests';

import { Select } from './Select';
import { Recommendations } from './Recommendations';

export default class Search extends PureComponent {

    state = {
        term: '',
        value: '',
        genre: null,
        selector: null,
        data: null,
    };
    
    changeState = (e, key, value) => {
        if (e !== null) e.preventDefault();

        let state = { [key]: value };

        switch (key) {
            case 'selector':
                if (this.state[key] === value) {
                    // reset the selector if clicked again
                    state = {
                        selector: null,
                    };
                } else {
                    // reset the rest of the data if we selected another category
                    state = {
                        selector: value,
                        term: '',
                        value: '',
                        data: null,
                    }
                }
                break;
            
            case 'value':
                if (value !== null && value !== '' && value !== 'All years') {
                    const { selector } = this.state;
                    // fetch the data based on the Select configuration
                    fetchKeywordSuggestions(
                        selector,
                        this.changeState,
                        'data',
                        selector === 'artists'
                            ? (
                                value === 'All genres'
                                    ? ''
                                    : `?terms=${value}`
                            ) : (
                                `/year/${value}`
                            )

                    );
                    state = {
                        ...state,
                        genre: null,
                    };
                } else if (value === 'All years') {
                    // Reset the genre if it has been selected
                    state = {
                        ...state,
                        genre: '',
                    };
                }
                break;

            case 'genre':
                if (value !== '') {
                    // fetch data based on Genre
                    fetchKeywordSuggestions(
                        this.state.selector,
                        this.changeState,
                        'data',
                        value === 'All Genres'
                            ? ''
                            : `/artists/terms/${value}`
                    );
                }
                
                break;

            default:
                break;
        }

        this.setState(state);
    }

    /**
     * Filter the array of elements that we are going to recommend based on a term
     */
    filterRecommendations = (term, suggestions) => (
        suggestions.filter(suggestion => (
            suggestion.NAME.toLowerCase().search(term.toLowerCase()) !== -1
        )).splice(0, 20)
    )

    render() {
        const { selector, data, value, term, genre } = this.state;

        // Add / Remove a String from a className
        const className = (name, defaultClass = "selector flex") => (
            (selector === name)
                ? "selected " + defaultClass
                : defaultClass
        );
        
        // Redirect without refreshing
        const redirect = (e, path) => {
            e.preventDefault();

            this.props.history.push(path);
        };
        
        return (
            <>
                <section className="flex">
                    <div className="container column flex">
                        <h1>Category</h1>
                        <a onClick={e => redirect(e, '/hottness')} href="#">View hottness ranks</a>
                        <div className="selector-container flex">
                            <button onClick={e => this.changeState(e, 'selector', 'artists')} className={className("artists")}>Artists</button>
                            <button onClick={e => this.changeState(e, 'selector', 'songs')} className={className("songs")}>Songs</button>
                        </div>
                        { selector !== null && (
                            <div className="select-container flex">
                                {
                                    Select({
                                        value: value === '' ? 'Select ' + selector + (selector === 'artists' ? ' genre' : ' year') : value,
                                        type: selector,
                                        onChange: this.changeState,
                                    })
                                }
                            </div>
                        )}
                        { genre !== null && (
                            <div className="select-container flex">
                                {
                                    Select({
                                        value: genre === '' ? 'Song genre' : genre,
                                        type: 'artists',
                                        stateName: 'genre',
                                        onChange: this.changeState,
                                    })
                                }
                            </div>
                        ) }
                        { (selector !== null && value !== '') && (
                            <form className="search-container column flex">
                                <input onChange={e => this.changeState(e, 'term', e.target.value)} value={term} type="text" placeholder={`Search by ${selector} ...`} />
                                {(data && term !== '') &&
                                    Recommendations(
                                        selector, 
                                        this.filterRecommendations(term, data),
                                        this.props.history
                                    )
                                }
                            </form>
                        )}
                    </div>
                </section>
            </>
        );
    }
}
