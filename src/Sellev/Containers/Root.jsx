import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import HeaderComponent from '../Components/Header/index';
import Footer from '../Components/Footer/index';
import HomeContainer from './Home/index';
import AuthContainer from './Authentication/index';
import UserMenu from './UserMenu/index';
import FundingMarketContainer from './FundingMarket/index';
import HashTagContainer from './HashTag/index';
import MyHomeContainer from './MyHome/index';
import PaymentContainer from './Payment/index';
import SearchContainer from './Search/index';
import NotificationContainer from './Notification/index';
import SelleverContainer from './Sellever/index';
import VideoContainer from './Video/index';
import SettingContainer from './Setting/index';
import CommentContainer from './Comment/index';


// Actions
import * as ActionAuth from '../Data/Authentification/actions';

// Utils
import * as parseUrlParameter from "../Lib/Utils/parseUrlParameter";

const mql = window.matchMedia('(max-width: 768px)');
class RootView extends React.Component {
    constructor() {
        super();
        this.state = {
            mediaQuery: mql.matches,
            hideFooter: false,
            hideHeader: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleBridge = this.handleBridge.bind(this);
    }
    componentWillMount() {

        let params = parseUrlParameter.parse(this.props.location.search);
        if (params.isWebview) {
            this.props.dispatch({type: 'IS_WEBVIEW', isWebview: true});
        }
        this.props.history.listen((location, action) => {
            this.handleUrlChange(this.props.location);
            this.handleBridge(this.props.location);
        });
        this.handleUrlChange(this.props.location);
        mql.addListener(this.handleChange);
        this.handleBridge(this.props.location);
    }

    componentDidMount() {
        this.props.dispatch(ActionAuth.session())
            .then((res) => {
                if (this.props.author && Object.getOwnPropertyNames(this.props.author).length > 0) {
                    if (this.props.location.pathname === '/auth/login') {
                        this.props.history.push('/');
                    }
                }
            });
        document.removeEventListener("message", (data) => {});
        document.addEventListener("message", (data) => {
            alert('a');
            if (JSON.parse(data.data).type === 'logout') {
                this.props.dispatch(ActionAuth.logout())
                    .then((response) => {
                        this.props.history.push('/');
                        window.postMessage(JSON.stringify({
                            type: 'logout'
                        }), "*");
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            if(JSON.parse(data.data).type === 'main' && this.props.isWebview) {
                this.props.history.push(JSON.parse(data.data).response);
            }
        });

    }
    handleChange() {
        this.setState({
            mql: mql,
        });
        if (this.state.mql.matches) {
            this.setState({
                mediaQuery: true,
            });
        } else {
            this.setState({
                mediaQuery: false,
            });
        }
    }
    handleBridge(location) {
        if(location.pathname === '/?isWebview=true' ||
            location.pathname === '/hashtags?isWebview=true' ||
            location.pathname === '/fundingmarket?isWebview=true' ||
            location.pathname === '/video?isWebview=true' ||
            location.pathname === '/' ||
            location.pathname === '/hashtags' ||
            location.pathname === '/fundingmarket' ||
            location.pathname === '/video'
        ) {
            this.props.history.listen((location, action) => {
                window.postMessage(JSON.stringify({
                    type: 'main',
                    pathname: location.pathname,
                    search: location.search,
                    url: location.pathname + location.search,
                }), "*");
            });
        } else {
            this.props.history.listen((location, action) => {
                window.postMessage(JSON.stringify({
                    type: 'urlChange',
                    pathname: location.pathname,
                    search: location.search,
                    url: location.pathname + location.search,
                }), "*");
            });
        }
    }
    handleUrlChange(location) {
        if (
            location.pathname === '/usermenu' ||
            location.pathname === '/setting' ||
            location.pathname === '/setting/profile' ||
            location.pathname === '/setting/changePassword' ||
            location.pathname === '/setting/policy' ||
            location.pathname === '/setting/privacy' ||
            location.pathname === '/setting/deleteAccount' ||
            location.pathname === '/comment'
        ) {
            this.setState({
                hideFooter: true,
                hideHeader: false,
            });
        } else if (
            location.pathname === '/auth/login' ||
            location.pathname === '/auth/signup' ||
            location.pathname === '/auth/findpassword' ||
            location.pathname === '/auth/login/callback' ||
            location.pathname === '/payment' ||
            location.pathname === '/payment/success' ||
            location.pathname === '/payment/fail'
        ) {
            this.setState({
                hideFooter: true,
                hideHeader: true,
            });
        } else {
            this.setState({
                hideFooter: false,
                hideHeader: false,
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        this.props.history.listen((location, action) => {
            this.handleBridge(location);
            this.handleUrlChange(location);
        });
        this.handleBridge(nextProps.location);
        this.handleUrlChange(nextProps.location);
    }
    render() {
        return (
            <div>
                {this.state.hideHeader === false || this.state.mediaQuery === false ?
                    <HeaderComponent />
                    : null
                }
                <Route path={'/'} exact={true} strict={false} component={HomeContainer} />
                <Route path={'/auth'} exact={false} strict={false} component={AuthContainer} />
                <Route path={'/usermenu'} exact={false} strict={false} component={UserMenu} />
                <Route path={'/fundingmarket'} exact={false} strict={false} component={FundingMarketContainer} />
                <Route path={'/hashtags'} exact={false} strict={false} component={HashTagContainer} />
                <Route path={'/myhome'} exact={true} strict={false} component={MyHomeContainer} />
                <Route path={'/payment'} exact={false} strict={false} component={PaymentContainer} />
                <Route path={'/notification'} exact={true} strict={false} component={NotificationContainer} />
                <Route path={'/search'} exact={true} strict={false} component={SearchContainer} />
                <Route path={'/sellever'} exact={true} strict={false} component={SelleverContainer} />
                <Route path={'/video'} exact={false} strict={false} component={VideoContainer} />
                <Route path={'/setting'} exact={false} strict={false} component={SettingContainer} />
                <Route path={'/comment'} exact={false} strict={false} component={CommentContainer} />
                {this.state.hideFooter ?
                    null
                :
                    <Footer />
                }
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(RootView));
