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
import stylesFundingMarket from '../../Styles/Components/FundingMarket.css';
import styles from '../../Styles/App.css';


// Actions

class Banner extends React.Component {
    render() {
        return (
            <div className={stylesFundingMarket.fundingMarketSection}>
                <div className={stylesFundingMarket.fundingMarketHeader}>
                    <div className={styles.sectionSmallTitle}>인기 셀럽을 만나보세요</div>
                    {/*<div className={styles.sectionTitle}>베스트 펀딩</div>*/}
                    <div className={styles.sectionTitle}>Weekly Best</div>
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
