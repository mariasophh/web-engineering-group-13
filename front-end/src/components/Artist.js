import React, { PureComponent, Fragment } from 'react';

import { fetchKeywordSuggestions, getImage, updateSong } from '../requests/Requests';
import { Table } from './Table';
import { Select } from './Select';

export default class Artist extends PureComponent {

    constructor(props) {
        super(props);

        const { artist, id } = props.match.params;
        // Fetch the data that we need before we render the component
        fetchKeywordSuggestions('songs', this.changeState, 'data', `/artists/${id}`);
        fetchKeywordSuggestions('artists', this.changeState, 'statistics', `/statistics/${id}`);
        fetchKeywordSuggestions('releases', this.changeState, 'releases', `/artist/${id}`);
        getImage(artist, this.changeState);

        this.state = {
            id,
            title: '',
            image: '',
            value: '',
            name: artist,
            statistics: null,
            data: null,
            releases: null,
            isShowing: false,
            isCreating: false,
            isDuplicating: true,
        };
    }

    changeState = (e, key, value) => {
        if (e !== null) e.preventDefault();

        let state = { [key]: value };

        if (key === 'value') {
            // Changing the select will update the data rendered on the Table
            const { id } = this.state;
            const queryString = value === 'Reset Data'
                ? ''
                : `?year=${value}`

            fetchKeywordSuggestions('songs', this.changeState, 'data', `/artists/${id}${queryString}`);
            fetchKeywordSuggestions('artists', this.changeState, 'statistics', `/statistics/${id}${queryString}`);
        } else if (key === 'update') {
            // get the key that is about to be updated in the object
            const { name } = e.target;
            const { title, data } = this.state;
            // get the object based on the title selected
            const object = this.getTitle(title);
            // We get the type, to keep data integrity
            const type = typeof object[name] === 'number'
                ? parseInt(value === '' ? 0 : value)
                : value;
            // update the selected object with the new value from the field
            object[name] = type;
            // reconstruct the data array to have the updated object
            const newData = data.map(item => {
                return item.TITLE === title
                    ? object
                    : item;
            });
            // update the state
            state = {
                ...state,
                data: newData,
            }
        } else if (key === 'create') {
            // TODO :: use the isDuplicated and pray
            // get the key that is about to be updated in the object
            // const { name } = e.target;
            // const { title, data } = this.state;
            // // get the object based on the title selected
            // const object = this.getRelease(title);
            // // We get the type, to keep data integrity
            // const type = typeof object[name] === 'number'
            //     ? parseInt(value === '' ? 0 : value)
            //     : value;
            // // update the selected object with the new value from the field
            // object[name] = type;
            // // reconstruct the data array to have the updated object
            // const newData = [object];
            // data.forEach(item => {
            //     if (item.TITLE !== title) {
            //         newData.push(item);
            //     } 
            // });
            // // update the state
            // state = {
            //     ...state,
            //     data: newData,
            //     isDuplicating: false,
            // }
        }

        this.setState(state);
    }

    /**
     * Render the statistics blocks;
     */
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

    /**
     * Render each song field with their connected dataTypes;
     */
    renderSong = title => {
        const { isCreating } = this.state;
        const object = isCreating 
            ? this.getRelease(parseInt(title))
            : this.getTitle(title);

        // if (this.state.isCreating) {
        //     Object.keys(object).forEach(key => {
        //         object[key] = typeof object[key] === "number"
        //             ? 0
        //             : '';
        //     })
        // }

        return Object.keys(object).map(key => (
            (key === 'TITLE' || key === 'ID' || key === 'RELEASE_ID' || key === 'NAME')
                ? <Fragment key={key}></Fragment>
                : (
                    <Fragment key={key}>
                        <span>{key}</span>
                        <input name={key} onChange={e => this.changeState(e, isCreating ? 'create' : 'update', e.target.value)} value={object[key]} type={typeof object[key]} placeholder={key} required />
                    </Fragment>
                )
        ));
    }

    getAllTitles = () => (
        this.state.data.map(item => item.TITLE)
    )

    getTitle = title => (
        this.state.data.filter(item => item.TITLE === title)[0]
    )

    getRelease = release => (
        this.state.data.filter(item => item['RELEASE_ID'] === release)[0]
    )

    render() {
        const { image, name, value, data, statistics, title, releases, isShowing, isCreating } = this.state;
        
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
                    <a onClick={e => this.changeState(e, 'isShowing', true)} href="#">Update a Song</a>
                    {isShowing && (
                        <>
                            <a onClick={e => this.changeState(e, 'isShowing', false)} href="#">Close</a>
                            <div style={{ width: '50%' }} className="select-container flex">
                                {
                                    Select({
                                        value: title === '' ? 'Select title' : title,
                                        items: this.getAllTitles(),
                                        stateName: 'title',
                                        onChange: this.changeState,
                                    })
                                }
                            </div>
                            {title !== '' && (
                                <form onSubmit={e => updateSong(e, this.getTitle(title))} style={{ width: '50%' }} className="flex column">
                                    {this.renderSong(title)}
                                    <button type="submit">UPDATE</button>
                                </form>
                            )}        
                        </>
                    )}
                    <a onClick={e => this.changeState(e, 'isCreating', true)} href="#">Create a Song</a>
                    {isCreating && (
                        <>
                            <a onClick={e => this.changeState(e, 'isCreating', false)} href="#">Close</a>
                            <div style={{ width: '50%' }} className="select-container flex">
                                {
                                    Select({
                                        value: title === '' ? 'Select Release' : title,
                                        items: releases.map(item => item.ID),
                                        stateName: 'title',
                                        onChange: this.changeState,
                                    })
                                }
                            </div>
                            {title !== '' && (
                                <form onSubmit={e => updateSong(e, this.getTitle(title), true)} style={{ width: '50%' }} className="flex column">
                                    {this.renderSong(title)}
                                    <button type="submit">UPDATE</button>
                                </form>
                            )}        
                        </>
                    )}
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
