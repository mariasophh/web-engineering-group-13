import React from 'react';

/**
 * Render a table with a specific head / body config 
 * @param {Array} items 
 */
export const Table = items => (
    <table className="table">
        <thead>
            <tr key={-1}>
                <th>Hottness</th>
                <th>Title</th>
                <th>Year</th>
            </tr>
        </thead>
        <tbody>
            {items.map(item => (
                <tr key={item.ID}>
                    <td>{item.HOTTTNESSS.toFixed(2)}</td>
                    <td>{item.TITLE}</td>
                    <td>{item.YEAR}</td>
                </tr>
            ))}
        </tbody>
    </table>
)
