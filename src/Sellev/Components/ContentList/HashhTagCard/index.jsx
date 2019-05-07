import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles
import styles from '../../../Styles/App.css';
import stylesHashTag from '../../../Styles/Components/HashTag.css';

// Actions
import * as ActionHashTag from "../../../Data/HashTag/actions";
import * as ActionAuth from "../../../Data/Authentification/actions";
import * as DateUtil from "../../../Lib/Utils/date";
/*
* this.props.numOfList: top list 갯수
* */
class HashTagCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hotList: [],
            isLike: 0,
            numOfBox: 5,
        }
        this.goDetail = this.goDetail.bind(this);
        this.handleLike = this.handleLike.bind(this);
    }
    componentWillMount() {
        let userId;
        if (this.props.author && this.props.author.user) {
            userId = this.props.author.user.userId;
        }
        this.setState({
            isLike: this.props.itemList.isLike,
        })
    }
    componentWillReceiveProps(nextProps) {
        let userId;
        if (nextProps.author && nextProps.author.user) {
            userId = nextProps.author.user.userId;
        }
        this.setState({
            isLike: nextProps.itemList.isLike,
        })
    }
    componentDidMount(){
    }
    handleLike(hashtagId, isLike) {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
            let params = {
                param: hashtagId,
                like: !isLike,
            }
            ActionHashTag.hashTagLike(params)
                .then((response) => {
                    if (response.code === 200) {
                        this.setState({
                            isLike: !isLike,
                        })
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    goDetail(hashtagId) {
        this.props.history.push('/hashtags/detail?hashtagId=' + hashtagId);
    }
    render() {
    return (
            <div className={stylesHashTag.hashTagBannerBox + ' ' + stylesHashTag.hashTagItem + ' ' + stylesHashTag.card}>
                <div onClick={() => this.goDetail(this.props.itemList.hashtagId)} className={stylesHashTag.hashTagBanner} style={{backgroundImage: this.props.itemList.imageUrl ? 'url("' + this.props.itemList.imageUrl.replace('original', '640x470') + '")' : 'url("/assets/img/bg_hashtag_default.png")'}} />
                { this.state.isLike ?
                    <div onClick={() => this.handleLike(this.props.itemList.hashtagId, this.state.isLike)} className={styles.whiteHeartFullIcon + ' ' + stylesHashTag.clickLike + ' ' + styles.fullScreen} />
                    :
                    <div onClick={() => this.handleLike(this.props.itemList.hashtagId, this.state.isLike)} className={styles.whiteHearLineIcon + ' ' + stylesHashTag.clickLike + ' ' + styles.fullScreen} />
                }
                <div onClick={() => this.goDetail(this.props.itemList.hashtagId)} className={stylesHashTag.hashTagTextBox + ' ' + stylesHashTag.hashTagItem}>
                    <div
                        className={stylesHashTag.hashTagBtn}>#{this.props.itemList.hashtag ? this.props.itemList.hashtag : '이름없음'}</div>
                    <div
                        className={stylesHashTag.bannerText}>{DateUtil.format('point', this.props.itemList.createdAt)}</div>
                </div>
            </div>
    );
}
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(HashTagCard));