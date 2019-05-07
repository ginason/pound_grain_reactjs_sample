import React, { Component } from 'react';
import { Switch, Route } from 'react-router';
import { hot } from 'react-hot-loader'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// Routes
import routes from './routes';
import store from "./store";

class App extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <BrowserRouter>
                <Provider store={store}>
                    <Switch>
                        {routes.map((route, index) => (
                            <Route key={index} {...route} />
                        ))}
                    </Switch>
                </Provider>
            </BrowserRouter>
        );
    }
}

export default hot(module)(App);
