import React, { PureComponent } from 'react';

import { fetchKeywordSuggestions } from '../requests/Requests';
import { Select } from './Select';
import { Recommendations } from './Recommendations';

export default class Hottness extends PureComponent {

    state = {
        term: '',
        value: '',
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

                if (value === 'artists') {
                    // fetch the 
                    fetchKeywordSuggestions(
                        value,
                        this.changeState,
                        'data',
                        '?rankBy=hotttnesss&order=desc&offset=20&limit=50'
                    );
                }
                break;

            case 'value':
                if (value !== null && value !== '' && value !== 'All years') {
                    fetchKeywordSuggestions(
                        'songs',
                        this.changeState,
                        'data',
                        `/year/${value}?rankBy=hotttnesss&order=desc&offset=0&limit=50`
                    );
                }
                break;

            default:
                break;
        }

        this.setState(state);
    }

    // Get the recommendations based on a term
    filterRecommendations = (term, suggestions) => (
        suggestions.filter(suggestion => (
            suggestion.NAME.toLowerCase().search(term.toLowerCase()) !== -1
        ))
    )

    render() {
        const { selector, data, value, term } = this.state;

        // Add / Remove a String from a className
        const className = (name, defaultClass = "selector flex") => (
            (selector === name)
                ? "selected " + defaultClass
                : defaultClass
        );

        return (
            <>
                <section className="flex">
                    <div className="container column flex">
                        <h1>Hottness</h1>
                        <div className="selector-container flex">
                            <button onClick={e => this.changeState(e, 'selector', 'artists')} className={className("artists")}>Artists</button>
                            <button onClick={e => this.changeState(e, 'selector', 'songs')} className={className("songs")}>Songs</button>
                        </div>
                        {(selector !== null && selector !== 'artists') && (
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
                        {selector !== null && (
                            <form className="search-container column flex">
                                {data &&
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
