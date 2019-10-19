import React, { PureComponent } from 'react';

import { fetchKeywordSuggestions, getImage } from '../requests/Requests';
import { Table } from './Table';
import { Select } from './Select';

export default class Artist extends PureComponent {

    constructor(props) {
        super(props);

        const { artist, id } = props.match.params;

        fetchKeywordSuggestions('songs', this.changeState, 'data', `/artists/${id}`);
        fetchKeywordSuggestions('artists', this.changeState, 'statistics', `/statistics/${id}`);
        getImage(artist, this.changeState);

        this.state = {
            id,
            image: '',
            value: '',
            name: artist,
            statistics: null,
            data: null,
        };
    }

    changeState = (e, key, value) => {
        if (e !== null) e.preventDefault();

        if (key === 'value') {
            const { id } = this.state;
            const queryString = value === 'Reset Data'
                ? ''
                : `?year=${value}`

            fetchKeywordSuggestions('songs', this.changeState, 'data', `/artists/${id}${queryString}`);
            fetchKeywordSuggestions('artists', this.changeState, 'statistics', `/statistics/${id}${queryString}`);
        }

        this.setState({ [key]: value });
    }

    renderStatistics = statistics => (
        Object.keys(statistics).map(key => (
            <div key={key} className="statistics flex column">
                <h3>{key}</h3>
                {statistics[key].toFixed(4)}
            </div>
        ))
    )

    getYears = data => {
        const years = [
            'Reset Data'
        ];

        data.forEach(({ YEAR }) => {
            if (!years.includes(YEAR)) {
                years.push(YEAR);
            }
        });

        return years.sort();
    }

    render() {
        const { image, name, value, data, statistics } = this.state;
        
        return (
            <section className="flex">
                <div className="container column flex">
                    <img src={image}/>
                    <h1>{name}</h1>
                    {statistics &&
                        <div className="statistics-container flex">
                            {this.renderStatistics(statistics)}
                        </div>
                    }
                    {data && 
                        <div style={{ width: '50%' }} className="select-container flex">
                        {
                            Select({
                                value: value === '' ? 'Filter By Year' : value,
                                items: this.getYears(data),
                                onChange: this.changeState,
                            })
                        }
                        </div>
                    }
                    {data &&
                        Table(data)
                    }
                </div>
            </section>
        );
    }
}
