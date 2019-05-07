import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import BannerBody from './BannerBody';

// Styles
import stylesHome from '../../Styles/Components/Home.css';
import styles from '../../Styles/App.css';

// Actions

class Banner extends React.Component {
    render() {
        return (
            <div className={stylesHome.bannerSection}>
                <div className={stylesHome.BannerHeader}>
                    <div className={styles.sectionSmallTitle}>지금 오픈 중</div>
                    <div className={styles.sectionWhiteTitle}>LIVE PROJECT</div>
                </div>
                <BannerBody />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(Banner));
