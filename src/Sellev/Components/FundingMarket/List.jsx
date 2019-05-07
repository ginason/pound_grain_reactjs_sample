import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import ImageList from '../ContentList/ImageList/index';
import Filter from '../ContentList/Filter/index';
import InfiniteList from '../ListLoader/InfiniteList';
// Styles
import stylesFundingMarket from '../../Styles/Components/FundingMarket.css';
import styles from '../../Styles/App.css';
// Actions
import * as ActionProduct from '../../Data/Product/action';

class FundingMarketList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            type: 1,
            sortMethod: 'date',
            categoryList: [],
        }
        this.handleSort = this.handleSort.bind(this);
        this.openFilter = this.openFilter.bind(this);
        this.closeFilter = this.closeFilter.bind(this);
    }
    componentWillMount() {
        this.params = {
            isFunding: true,
            isNormal: true,
            isVideo: false,
            sort: 'desc',
            sortMethod: 'date',
            from: 0,
            count: 20
        }
    }
    closeFilter(type, categoryList, sortMethod) {
        if (type === 2) {
            this.params.isFunding = true;
            this.params.isNormal = false;
        } else if (type === 3) {
            this.params.isFunding = false;
            this.params.isNormal = true;
        } else {
            this.params.isFunding = true;
            this.params.isNormal = true;
        }
        this.params.sortMethod = sortMethod;
        this.params.category = categoryList;
        this.setState({
            show: !this.state.show,
            isFunding: this.params.isFunding,
            isNormal: this.params.isNormal,
            sortMethod: sortMethod,
            type: type,
            categoryList: categoryList,
        }, () => {
            console.log(this.state.categoryList);
        });
        setTimeout(() => {
            this.productList.reset();
        }, 100);
    }
    openFilter() {
        this.setState({ show: true });
    }
    handleSort() {
        if (this.params.sortMethod === 'hit') {
            this.params.sortMethod = 'date';
        } else {
            this.params.sortMethod = 'hit';
        }
        this.setState({
            sortMethod: this.params.sortMethod,
        })
        setTimeout(() => {
            this.productList.reset();
        }, 100);
    }
    render() {
        let fundingMarketList = (item, index) => {
            return (
                <div className={stylesFundingMarket.productBox} key={index}>
                    <ImageList type={'fundingmarket'} listItem={item} />
                </div>
            );
        }
        return (
            <div className={stylesFundingMarket.fundingMarketBody}>
                <div className={stylesFundingMarket.listHeader}>
                    <div className={styles.sectionSmallTitle}>마음에 든다면 좋아요!</div>
                    <div className={styles.titleBox}>
                        <div className={styles.sectionTitle}>
                            {/*<span>*/}
                                {/*{ this.state.sortMethod === 'date' ? '새로운 ' : ''}*/}
                                {/*{ this.state.sortMethod === 'hit' ? '인기 ' : ''}*/}
                                {/*{ this.state.type === 1 ? '펀딩&마켓' : ''}*/}
                                {/*{ this.state.type === 2 ? '펀딩' : ''}*/}
                                {/*{ this.state.type === 3 ? '마켓' : ''}*/}
                            {/*</span>*/}
                            <span>
                                { this.state.sortMethod === 'date' ? 'New ' : ''}
                                { this.state.sortMethod === 'hit' ? 'Hot ' : ''}
                                Project
                                </span>
                        </div>
                        <div onClick={this.openFilter} className={styles.filterBtn}>
                            {/*this.handleSort*/}
                            {/*{this.state.sortMethod === 'date' ?*/}
                                {/*<span>최신순</span>*/}
                                {/*:*/}
                                {/*<span>인기순</span>*/}
                            {/*}*/}
                            {/*<div />*/}
                            <div className={styles.filterIcon + ' ' + styles.filter} />
                            <div className={styles.filterText}>필터</div>
                        </div>
                    </div>
                </div>
                <div className={stylesFundingMarket.productBody}>
                    <InfiniteList onRef={(ref) => this.productList = ref} ListItem={fundingMarketList} Get={ActionProduct.getProductList} GetParams={this.params} hasMore={true} />
                </div>
                {this.state.show ?
                    <Filter onRef={(ref) => {this.filter = ref}} productType={'fundingmarket'} selectedCategory={this.state.categoryList} sortMethod={this.state.sortMethod} sortType={this.state.type} handleFilter={(type, category, sortMethod) => this.closeFilter(type, category, sortMethod)} />
                    :
                    null}
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(FundingMarketList));
