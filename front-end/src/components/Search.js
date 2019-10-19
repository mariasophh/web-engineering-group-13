import React, { PureComponent } from 'react';

import { fetchKeywordSuggestions } from '../requests/Requests';

import { Select } from './Select';
import { PopUp } from './PopUp';
import { Recommendations } from './Recommendations';

export default class Search extends PureComponent {

    state = {
        term: '',
        value: '',
        selector: null,
        id: null,
        data: null,
    };
    
    changeState = (e, key, value) => {
        if (e !== null) e.preventDefault();

        let state = { [key]: value };

        switch (key) {
            case 'selector':
                if (this.state[key] === value) {
                    state = {
                        selector: null,
                    };
                } else {
                    state = {
                        selector: value,
                        term: '',
                        value: '',
                        data: null,
                    }
                }
                break;
            
            case 'value':
                if (value !== null && value !== '') {
                    fetchKeywordSuggestions(
                        this.state.selector,
                        this.changeState,
                        'data',
                        value === 'All genres'
                            ? ''
                            : `?terms=${value}`
                    );
                }
                break;

            default:
                break;
        }

        this.setState(state);
    }

    filterRecommendations = (term, suggestions) => (
        suggestions.filter(suggestion => (
            suggestion.NAME.toLowerCase().search(term.toLowerCase()) !== -1
        )).splice(0, 10)
    )

    render() {
        const { selector, data, value, term, id } = this.state;

        const className = (name, defaultClass = "selector flex") => (
            (selector === name)
                ? "selected " + defaultClass
                : defaultClass
        );
        
        return (
            <>
                <section className="flex">
                    <div className="container column flex">
                        <h1>Select Category</h1>
                        <div className="selector-container flex">
                            <button onClick={e => this.changeState(e, 'selector', 'artists')} className={className("artists")}>Artists</button>
                            <button onClick={e => this.changeState(e, 'selector', 'songs')} className={className("songs")}>Songs</button>
                        </div>
                        { selector !== null && (
                            <div className="select-container flex">
                                {
                                    Select({
                                        value: value === '' ? 'Select ' + selector + ' genre' : value,
                                        type: selector,
                                        onChange: this.changeState,
                                    })
                                }
                            </div>
                        )}
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
                { id && 
                    PopUp(this.getDataOnId(id), this.changeState)
                }
            </>
        );
    }
}
