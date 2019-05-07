import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import VideoBody from './VideoBody';

// Styles
import stylesHome from '../../Styles/Components/Home.css';
import styles from '../../Styles/App.css';

// Actions

class Video extends React.Component {
    render() {
        return (
            <div className={stylesHome.videoSection}>
                <div className={stylesHome.videoHeader}>
                    <div className={styles.sectionSmallTitle}>인기 조회수</div>
                    <div className={styles.titleBox}>
                        <div className={styles.sectionTitle}>BEST VIDEO</div>
                        <Link to={'/video'} className={styles.more}>MORE</Link>
                    </div>
                </div>
                <VideoBody />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(Video));
