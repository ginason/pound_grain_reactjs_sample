import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Common
import SwipeBanner from '../../Common/SwipeBanner/index';

// Components

// Utils
import * as DateUtil from '../../Lib/Utils/date';

// Styles
import stylesVideo from '../../Styles/Components/Video.css';
import styles from '../../Styles/App.css';
// Actions
import * as ActionBanner from "../../Data/Banner/actions";
import * as ActionProduct from "../../Data/Product/action";
import * as ActionAuth from "../../Data/Authentification/actions";
import * as NumberUtil from "../../Lib/Utils/parseNumber";

class BannerBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        }
        this.handleLike = this.handleLike.bind(this);
        this.goDetail = this.goDetail.bind(this);
        this.handleHashTag = this.handleHashTag.bind(this);
    }
    componentWillMount() {
        let params = {
            type: 3,
        }
        ActionBanner.getBannerList(params)
            .then((response) => {
                if (response.code === 200) {
                    console.log(response);
                    console.log('video!!!!!!!');
                    this.setState({
                        list: response.data.banners,
                    });
                } else {
                    alert('배너 데이터를 가져오는데 실패했습니다.');
                }
            })
            .catch((err) => {
                alert('배너 데이터를 가져오는데 실패했습니다.');
            })
    }
    handleLike(item, index){
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        let params = {
            productId: item.productId,
            isLike: !this.state.list[index].isLike,
        }
        this.props.dispatch(ActionProduct.productLike(params))
            .then((response) => {
                if (response.code === 200) {
                    let video = this.state.list[index];
                    let list = JSON.parse(JSON.stringify(this.state.list));
                    video.isLike = !video.isLike;
                    list[index] = video;
                    this.setState({list: list});
                } else if (response.code === 400) {
                    // 향 후 삭제.
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    goDetail(type, productId) {
        this.props.history.push('/video/detail?productId=' + productId);
    }
    handleHashTag(hashtagId) {
        this.props.history.push('/hashtags/detail?hashtagId=' + hashtagId);
    }
    render() {
        let hashtagList = (list) => {
            return (
                list.map((item, index) => {
                    if(4 > index) {
                        return <div onClick={() => this.handleHashTag(item.hashtagId)} key={index} className={stylesVideo.hashtagItem}>#{item.hashtag}</div>
                    }
                })
            );
        }
        let bannerItem = (item, index) => {
            return (
                <div className={stylesVideo.listBox} key={index}>
                    <div className={stylesVideo.bgCover} onClick={() => this.goDetail(item.type, item.productId)} />
                    <div onClick={() => this.goDetail(item.type, item.productId)} className={stylesVideo.bgImage} style={{backgroundImage: 'url("' + (item.imageUrl ? item.imageUrl.replace('original', '640x470') : '/assets/img/img_default_product_banner.png') + '")'}} />
                    { this.state.list[index].isLike ?
                        <div onClick={() => this.handleLike(item, index)} className={styles.whiteHeartFullIcon + ' ' + stylesVideo.clickLike} />
                        :
                        <div onClick={() => this.handleLike(item, index)} className={styles.whiteHearLineIcon + ' ' + stylesVideo.clickLike} />
                    }
                    <div className={stylesVideo.titleBox} onClick={() => this.goDetail(item.type, item.productId)}>
                        <div>{item.store ? item.store.name : ''}</div>
                        <div>{item.title}</div>
                        <div>조회수 {NumberUtil.numberWithCommas(item.hitAmount)}</div>
                    </div>
                    {item.hashtags ?
                        <div className={stylesVideo.hashtagBox}>
                            {hashtagList(item.hashtags)}
                        </div>
                        :
                        null
                    }
                </div>
            );
        }
        return (
            <div className={stylesVideo.bannerBody}>
                <SwipeBanner listItem={bannerItem} getList={this.state.list} centerMode={true} slideToShow={1} styleName={'video'} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(BannerBody));
