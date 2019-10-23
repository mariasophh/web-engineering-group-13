import React from 'react';
import { deleteRow } from '../requests/Requests'

// Redirect without refreshing;
const redirect = (e, history, item) => {
    e.preventDefault();

    history.push(`/${item.NAME}/${item.ID}`);
}

/**
 * Render a list of recommendations; The list can either be simple text 
 * or a compount row that can also delete the entry from the server;
 * @param {String} key 
 * @param {Array} array 
 * @param {Object} history 
 */
export const Recommendations = (key, array, history) => (
    !!array.length && (
        <div key={key} className="card-container flex column">
            <h3>{key} ({array.length})</h3>
            {array.map(item => key === 'artists' 
                ? <a onClick={e => redirect(e, history, item)} key={item.NAME} className="item-complex flex" href="#">{item.NAME}</a>
                : (
                    <div key={item.NAME} className="item flex">
                        <span>{item.NAME} {item.YEAR !== 0 && `(${item.YEAR})`}</span>
                        <button onClick={e => deleteRow(e, `songs/${item.ID}`)}>DELETE</button>
                    </div>
                )
            )}
        </ div>
    )
);
