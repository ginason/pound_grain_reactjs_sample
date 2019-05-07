import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';

// Components
import BannerBody from './BannerBody';

// Styles
import stylesVideo from '../../Styles/Components/Video.css';
import styles from '../../Styles/App.css';

// Actions

class Banner extends React.Component {
    render() {
        return (
            <div className={stylesVideo.bannerSection}>
                <div className={stylesVideo.bannerHeader}>
                    <div className={styles.sectionSmallTitle}>한번만 본 사람은 없어요</div>
                    <div className={styles.sectionTitle}>인기 동영상</div>
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
