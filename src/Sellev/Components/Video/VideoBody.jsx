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
import styles from '../../Styles/App.css';
import stylesVideo from '../../Styles/Components/Video.css';

// Actions
import * as ActionProduct from '../../Data/Product/action';

class VideoBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            sortMethod: 'hit',
            show: false,
            categoryList: [],
        }

        this.handleSort = this.handleSort.bind(this);
        this.openFilter = this.openFilter.bind(this);
        this.closeFilter = this.closeFilter.bind(this);
    }
    componentWillMount() {
        this.params = {
            isFunding: false,
            isNormal: false,
            isVideo: true,
            sort: 'desc',
            sortMethod: 'hit',
        }
    }
    closeFilter(type, categoryList, sortMethod) {
        this.params.sortMethod = sortMethod;
        this.params.category = categoryList;

        this.setState({
            show: !this.state.show,
            sortMethod: sortMethod,
            categoryList: categoryList,
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
        let videoList = (item, index) => {
            return (
                <div key={index} className={stylesVideo.videoBox}>
                    <ImageList type={'video'} listItem={item} />
                </div>
            );
        }
        return (
            <div className={stylesVideo.videoSection}>
                <div className={stylesVideo.videoHeader}>
                    <div className={styles.sectionSmallTitle}>MORE</div>
                    <div className={styles.titleBox}>
                        <div className={styles.sectionTitle}>
                            최신 동영상
                        </div>
                        <div onClick={this.openFilter} className={styles.filterBtn}>
                            {/*{onClick={this.handleSort}}*/}
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
                <div className={stylesVideo.videoBody}>
                    <InfiniteList onRef={(ref) => this.productList = ref} ListItem={videoList} Get={ActionProduct.getProductList} GetParams={this.params} />
                </div>
                {this.state.show ?
                    <Filter onRef={(ref) => {this.filter = ref}} productType={'video'} selectedCategory={this.state.categoryList} sortMethod={this.state.sortMethod} handleFilter={(type, category, sortMethod) => this.closeFilter(type, category, sortMethod)} />
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
})(withRouter(VideoBody));
