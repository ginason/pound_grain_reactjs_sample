import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';


// Components

// Styles
import stylesContent from '../../../Styles/Components/ContentList.css';

// Actions
import * as ActionProduct from '../../../Data/Product/action';
import * as DateUtil from "../../../Lib/Utils/date";
/*
* this.props.title
* this.props.sort
*/

class FundingMarketList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
        }
        this.goDetail = this.goDetail.bind(this);
        this.goProfile = this.goProfile.bind(this);
    }
    componentWillMount() {
        let params = {
            from: 0,
            count: 5,
            sortMethod: this.props.sortMethod || 'date',
            // sortMethod: 'current',
            sort: this.props.sort || 'desc',
            isNormal: this.props.isNormal,
            isFunding: this.props.isFunding,
            isVideo: this.props.isVideo,
        }

        setTimeout(() => {
            this.props.dispatch(ActionProduct.getProductList(params))
                .then((response) => {
                    this.setState({
                        list: response.data.products,
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        }, 100);
    }
    goDetail(type, productId) {
        if(type === 1) {
            this.props.history.push('/fundingmarket/funding?productId=' + productId);
        } else {
            this.props.history.push('/fundingmarket/market?productId=' + productId);
        }
    }
    goProfile() {

    }
    render() {
        let listItem = this.state.list && this.state.list.length > 0 ?
            this.state.list.map((item, index) => {
                if(index === 0) {
                        return(
                            <li key={index} className={stylesContent.topItem}>
                                {/*<img className={stylesContent.listImgScale} src={'/assets/img/img_product_card.png'} />*/}
                                <div onClick={() => this.goDetail(item.type, item.productId)} className={stylesContent.listImg} style={{width: '100%', backgroundImage: 'url("' + (item.imageUrl ? item.imageUrl.replace('original', '640x470') : '/assets/img/img_default_product_banner.png') + '")'}} />
                                <div onClick={() => this.goDetail(item.type, item.productId)} className={stylesContent.listTextBox}>
                                    <div>{/*번호*/}{index + 1}</div>
                                    <div>{item.title ? item.title : '-'}</div>
                                    {item.type === 1?
                                        (this.props.sortMethod === 'end'?
                                            <div>{DateUtil.getLeftDays(item.typeInfo ? item.typeInfo.endAt : 0)}일 남음</div>
                                            :
                                            <div>펀딩율 {item.store ? (Math.floor((item.typeInfo.currentRaise / item.typeInfo.goalToRaise) * 100)) : '0'}%</div>
                                        )
                                        :
                                        <div>{item.store ? item.store.name : '-'}</div>
                                    }
                                </div>
                            </li>
                        );
                }else {
                    return (
                        <li key={index} className={stylesContent.item}>
                            <Link to={'/fundingmarket' + (item.type === 1 ? '/funding' : '/market') + '?productId=' + item.productId}>
                                <div>{/*번호*/}{index + 1}</div>
                                <div style={{backgroundImage: 'url("' + (item.imageUrl ? item.imageUrl.replace('original', '640x470') : '/assets/img/img_default_product_banner.png') + '")'}} />
                                <div>{item.title ? item.title : '-'}</div>
                                {item.type === 1?
                                    (this.props.sortMethod === 'end'?
                                            <div>{DateUtil.getLeftDays(item.typeInfo && item.typeInfo.endAt ? item.typeInfo.endAt : 0)}일 남음</div>
                                            :
                                            <div>펀딩율 {item.store ? (Math.floor((item.typeInfo.currentRaise / item.typeInfo.goalToRaise) * 100)) : '0'}%</div>
                                    )
                                    :
                                    <div>{item.store ? item.store.name : '-'}</div>
                                }
                            </Link>
                        </li>
                    );
                }
            }) : null;
        return (
            <div className={stylesContent.FundingMarketListBox + ' ' + stylesContent.responsiveHome}>
                <div className={stylesContent.listTItle}>{this.props.title}</div>
                <ul className={stylesContent.itemListBox}>
                    {listItem}
                </ul>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(FundingMarketList));
