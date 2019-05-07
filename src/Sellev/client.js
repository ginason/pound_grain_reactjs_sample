import 'core-js/shim';
import React from 'react';
import { render } from 'react-dom';

// Components
import App from './App';
if (!global._babelPolyfill) {
    require('babel-polyfill');
}
require('es6-promise').polyfill();
require('console-polyfill');
require('core-js/shim');

render(
    <App />,
    document.getElementById('root'),
);

if (module.hot) {
    module.hot.accept();
    module.hot.dispose(function() {
        clearInterval(timer);
    });
}