import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Components
import SwipeBanner from '../../Common/SwipeBanner/index';

// Styles
import styles from '../../Styles/App.css';
import styleImageList from '../../Styles/Components/ImageList.css';
import stylesFundingMarket from '../../Styles/Components/FundingMarket.css';
import * as ActionBanner from "../../Data/Banner/actions";
import * as ActionProduct from "../../Data/Product/action";

// Actions
import * as NumberUtil from '../../Lib/Utils/parseNumber';
import * as ActionAuth from "../../Data/Authentification/actions";
import * as date from '../../Lib/Utils/date';

class BannerBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
        };
        this.handleLike = this.handleLike.bind(this);
        this.goDetail = this.goDetail.bind(this);
        this.handleHashTag = this.handleHashTag.bind(this);
        this.fundingStatus = this.fundingStatus.bind(this);
    }
    componentWillMount() {
        let params = {
            type: 2,
        };
        ActionBanner.getBannerList(params)
            .then((response) => {
                if (response.code === 200) {
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
        console.log(this.props.isWebview);
    }
    handleLike(item, index) {
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
                    let product = this.state.list[index];
                    let list = JSON.parse(JSON.stringify(this.state.list));
                    product.isLike = !product.isLike;
                    list[index] = product;
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
        let path;
        if (type === 0 || type === 'normal') {
            path = '/fundingmarket/market?productId=';
        } else if (type === 1 || type === 'funding') {
            path = '/fundingmarket/funding?productId=';
        }
        this.props.history.push(path + productId);
    }
    handleHashTag(hashtagId) {
        this.props.history.push('/hashtags/detail?hashtagId=' + hashtagId);
    }
    fundingStatus(option) {
        let today = date.format('dash', new Date());
        if(option.endAt < today) {
            return '종료';
        } else {
            let fundingRatio = option.goalToRaise ? Math.floor((option.currentRaise / option.goalToRaise) * 100) : 0;
            console.log('fundingRatio');
            console.log(fundingRatio);
            if( fundingRatio > 100 || fundingRatio === 100) {
                return '성공';
            } else {
                return '펀딩률';
            }
        }
    }
    render() {
        let hashtagList = (list) => {
            return (
                list.map((item, index) => {
                    if(4 > index) {
                        return <div key={index} onClick={() => this.handleHashTag(item.hashtagId)} className={stylesFundingMarket.hashtagItem}>#{item.hashtag}</div>
                    }
                })
            );
        }
        let bannerItem = (item, index) => {
                return (
                    <div className={stylesFundingMarket.listBox} key={index}>
                        <div className={stylesFundingMarket.bgCover} />
                        <div onClick={() => this.goDetail(item.type, item.productId)} className={stylesFundingMarket.bgImage} style={{backgroundImage: 'url("' + (item.imageUrl ? item.imageUrl.replace('original', '640x470'):'/assets/img/img_default_product_banner.png') + '")'}} />
                        { this.state.list[index].isLike ?
                            <div onClick={() => this.handleLike(item, index)} className={styles.whiteHeartFullIcon + ' ' + stylesFundingMarket.clickLike} />
                            :
                            <div onClick={() => this.handleLike(item, index)} className={styles.whiteHearLineIcon + ' ' + stylesFundingMarket.clickLike} />
                        }
                        {/*<div onClick={() => this.goDetail(item.type, item.productId)} className={stylesFundingMarket.bgFooter}>*/}
                            {/*{item.type === 1 || item.type === 'funding' ?*/}
                                {/*<div className={stylesFundingMarket.fundSymbole}>*/}
                                    {/*<span>펀딩율</span><br />*/}
                                    {/*<span>{item.typeInfo && item.typeInfo.currentRaise ? Math.floor((item.typeInfo.currentRaise / item.typeInfo.goalToRaise) * 100) : 100}%</span>*/}
                                {/*</div>*/}
                                {/*:*/}
                                {/*null*/}
                            {/*}*/}
                        {/*</div>*/}
                        {item.type === 1 || item.type === 'funding' ?
                        <div onClick={() => this.goDetail(item.type, item.productId)} className={stylesFundingMarket.titleBox}>
                            <div className={stylesFundingMarket.textBox1}>
                                <div>{item.store ? item.store.name : ''}</div>
                                <div>
                                    { item.typeInfo ?
                                        this.fundingStatus(item.typeInfo)
                                    :
                                        '펀딩률'
                                    }
                                </div>
                            </div>
                            <div className={stylesFundingMarket.textBox2}>
                                <div>{item.title}</div>
                                <div>{item.typeInfo && item.typeInfo.currentRaise && item.typeInfo.goalToRaise ? Math.floor((item.typeInfo.currentRaise / item.typeInfo.goalToRaise) * 100) : 0}%</div>
                            </div>
                            <div onClick={this.goDetail} className={styleImageList.progressBox}>
                                <div className={'progress ' + styleImageList.progress}>
                                    <div className={'progress-bar ' + styleImageList.progressBar} style={{ width: (item.typeInfo && item.typeInfo.currentRaise && item.typeInfo.goalToRaise ? (Math.floor(item.typeInfo.currentRaise / item.typeInfo.goalToRaise * 100)) : '0') + '%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" />
                                </div>
                            </div>
                        </div>
                            :
                        <div onClick={() => this.goDetail(item.type, item.productId)} className={stylesFundingMarket.titleBox}>
                            <div className={stylesFundingMarket.text}>{item.store ? item.store.name : ''}</div>
                            <div className={stylesFundingMarket.marketText}>{item.title}</div>
                            <div className={stylesFundingMarket.marketItem}>
                                <div className={stylesFundingMarket.itemPrice}><span>₩ </span>{NumberUtil.numberWithCommas(item.price)}</div>
                            </div>
                        </div>
                        }
                        {item.hashtags ?
                            <div className={stylesFundingMarket.hashtagBox}>
                                {hashtagList(item.hashtags)}
                            </div>
                        :
                            null
                        }
                    </div>
                );
        }
        return (
            <div className={stylesFundingMarket.bannerBody}>
                <SwipeBanner listItem={bannerItem} getList={this.state.list} centerMode={false} infinite={true} slidesToShow={1} styleName={'fundingMarket'}/>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(BannerBody));
