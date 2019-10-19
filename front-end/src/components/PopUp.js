import React from 'react';

const provider = providers => (
    !!providers.length && (
        providers.map(provider => (
            <a href={provider.url}>{provider.name}</a>
        ))
    )
)

export const PopUp = (item, onClick) => (
    <>
        <a onClick={e => onClick(e, 'id', null)} className="exit flex" href="#" />
        <section className="pop-up flex">
            <div className="pop-up-container container flex column">
                <div className="content flex column">
                    <img src={item.picture} />
                    <h3>{item.name}</h3>
                    <div className="providers flex column">
                        {provider(item.locations)}
                    </div>
                </div>
            </div>
        </section>
    </>
);
