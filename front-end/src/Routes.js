import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const Import = props => {
    const Component = lazy(() => import(`./components/${props.name}`));

    return (
        <Suspense fallback={<div>Loading</div>}>
            <Component {...props} />
        </Suspense>
    );
};

export const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" render={props => Import({ name: 'Search', ...props })} />
            <Route exact path="/:artist/:id" render={props => Import({ name: 'Artist', ...props })} />
        </Switch>
    </BrowserRouter>
);

