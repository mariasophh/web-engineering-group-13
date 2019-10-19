import React from 'react';

export const Table = items => (
    <table className="table">
        <thead>
            <tr key={-1}>
                <th>Hotness</th>
                <th>Title</th>
                <th>Year</th>
            </tr>
        </thead>
        <tbody>
            {items.map(item => (
                <tr key={item.ID}>
                    <td>{item.HOTTTNESSS.toFixed(5)}</td>
                    <td>{item.TITLE}</td>
                    <td>{item.YEAR}</td>
                </tr>
            ))}
        </tbody>
    </table>
)
