// Pages
import RootPage from './Containers/Root';

// React
import store from './store';

const routes = [
    {
        path: '/',
        exact: true,
        strict: false,
        component: RootPage,
    },
    {
        path: '/auth',
        exact: false,
        strict: false,
        component: RootPage,
    },
    {
        path: '/usermenu',
        exact: false,
        strict: false,
        component: RootPage,
    },
    {
        path: '/fundingmarket',
        exact: false,
        strict: false,
        component: RootPage,
    },
    {
        path: '/hashtags',
        exact: false,
        strict: false,
        component: RootPage,
    },
    {
        path: '/myhome',
        exact: true,
        strict: false,
        component: RootPage,
    },
    {
        path: '/payment',
        exact: false,
        strict: false,
        component: RootPage,
    },
    {
        path: '/search',
        exact: true,
        strict: false,
        component: RootPage,
    },
    {
        path: '/notification',
        exact: true,
        strict: false,
        component: RootPage,
    },
    {
        path: '/sellever',
        exact: true,
        strict: false,
        component: RootPage,
    },
    {
        path: '/video',
        exact: false,
        strict: false,
        component: RootPage,
    },
    {
        path: '/setting',
        exact: false,
        strict: false,
        component: RootPage,
    },
    {
        path: '/comment',
        exact: false,
        strict: false,
        component: RootPage,
    },
    {
        path: '/myhome',
        exact: false,
        strict: false,
        component: RootPage,
    }
];
export default routes;
