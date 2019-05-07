import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import HomeBanner from '../../Components/Home/Banner';
import HomeFundingMarket from '../../Components/Home/FundingMarket';
import HomeHashTag from '../../Components/Home/HashTag';
import HomeVideo from '../../Components/Home/Video';

// Actions

// Styles
import stylesHome from '../../Styles/Containers/Home.css';

// Routes


class HomeContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <div className={stylesHome.homeContainer}>
                <HomeBanner />
                <HomeHashTag />
                <HomeFundingMarket />
                <HomeVideo />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(HomeContainer));
