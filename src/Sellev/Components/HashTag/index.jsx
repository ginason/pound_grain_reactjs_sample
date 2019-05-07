import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import HashTagCard from '../ContentList/HashTagBanner/index';
import New from './New';

// Styles
import styles from '../../Styles/App.css';
import stylesHashTag from '../../Styles/Components/HashTag.css';

class HashTagHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
        };
        // this.goPage = this.goPage.bind(this);
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        // if (this.props.isWebview) {
        //     var that = this;
        //     document.addEventListener("message", (data) => {
        //         alert("hashtags event!");
        //         if(JSON.parse(data.data).type === 'main') {
        //             this.setState({
        //                 url: JSON.parse(data.data).response,
        //             }, () => {
        //                 that.goPage(this.state.url);
        //             });
        //         }
        //     });
        // }
    }
    // goPage(url) {
    //     alert(url);
    //     this.props.history.push(url);
    //
    // }
    render() {
        return (
            <div className={stylesHashTag.hashTagHomeContainer}>
                <div className={stylesHashTag.recommendedSection}>
                    <div className={stylesHashTag.recommendedHeader}>
                        <div className={styles.sectionSmallTitle}>어떤 콘텐츠에 열광하나요?</div>
                        <div className={styles.titleBox}>
                            <div className={styles.sectionTitle}>#해시태그</div>
                        </div>
                    </div>
                    <HashTagCard numOfList={3} />
                </div>
                <div className={stylesHashTag.hashTagList}>
                    <New />
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(HashTagHome));