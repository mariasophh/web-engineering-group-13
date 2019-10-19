import React from 'react';

const redirect = (e, history, item) => {
    e.preventDefault();

    history.push(`/${item.NAME}/${item.ID}`);
}


export const Recommendations = (key, array, history) => (
    !!array.length && (
        <div key={key} className="card-container flex column">
            <h3>{key}</h3>
            {array.map(item => key === 'artists' 
                ? <a onClick={e => redirect(e, history, item)} key={item.NAME} className="item-complex flex" href="#">{item.NAME}</a>
                : <span key={item.NAME} className="item flex">{item.NAME}</span>
            )}
        </ div>
    )
);
