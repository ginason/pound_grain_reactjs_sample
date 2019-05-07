import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import ProductRanking from '../ContentList/ProductRanking/index';

// Styles
import stylesHome from '../../Styles/Components/Home.css';
import styles from '../../Styles/App.css';

// Actions

class FundingMarket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listTitle: 1,
        }
        this.handleTab = this.handleTab.bind(this);
    }
    handleTab(num) {
        this.setState({
            listTitle: num,
        });
    }
    render() {
        return (
            <div className={stylesHome.fundingMarketSection}>
                <div className={stylesHome.fundingMarketHeader}>
                    <div className={styles.sectionSmallTitle}>놀라움이 가득</div>
                    <div className={styles.sectionTitle}>AWSOME MARKET</div>
                </div>
                <ProductRanking productType={'home'} isFunding={true} isNormal={false} isVideo={false} productTitle={['펀딩액순', '종료예정펀딩', '신규']} sortMethod={['raise', 'end', 'date']} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(FundingMarket));
