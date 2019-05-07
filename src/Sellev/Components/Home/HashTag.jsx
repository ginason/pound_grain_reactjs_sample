import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import HashTagCard from '../ContentList/HashTagBanner/index';
// Styles
import stylesHome from '../../Styles/Components/Home.css';
import styles from '../../Styles/App.css';

// Actions
import * as ActionHashTag from "../../Data/HashTag/actions";


class HashTag extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={stylesHome.hashTagSection}>
                <div className={stylesHome.hashTagHeader}>
                    <div className={styles.sectionSmallTitle}>지금 가장 핫해</div>
                    <div className={styles.titleBox}>
                        <div className={styles.sectionTitle}>#HASHTAG</div>
                        <Link to={'/hashtags'} className={styles.more}>MORE</Link>
                    </div>
                </div>
                <div className={stylesHome.hashTagBody}>
                    <HashTagCard numOfList={3} />
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(HashTag));

