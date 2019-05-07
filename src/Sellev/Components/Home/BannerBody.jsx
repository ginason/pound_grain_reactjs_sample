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

// Styles

import stylesHome from '../../Styles/Components/Home.css';

// Actions
import * as ActionBanner from '../../Data/Banner/actions';

class BannerBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            onDrag: false,
        };
        this.goDetail = this.goDetail.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.handleDragging = this.handleDragging.bind(this);
        this.handleDragOff = this.handleDragOff.bind(this);
    }

    componentWillMount() {
        let params = {
            type: 1,
        }
        ActionBanner.getBannerList(params)
            .then((response) => {
                if (response.code === 200) {
                    console.log('bannerbanner home');
                    console.log(response);
                    this.setState({
                        list: response.data.banners,
                    })
                } else {
                    alert('배너 데이터를 가져오는데 실패했습니다.');
                }
            })
            .catch((err) => {
                alert('배너 데이터를 가져오는데 실패했습니다.');
            })
    }
    goDetail(type, productId) {
        if(!this.state.onDrag) {
            let path;
            if (type === 0 || type === 'normal') {
                path = '/fundingmarket/market?productId=';
            } else if (type === 1 || type === 'funding') {
                path = '/fundingmarket/funding?productId=';
            } else if (type === 2 || type === 'video') {
                path = '/video/detail?productId=';
            }
            this.props.history.push(path + productId);
        }
    }

    goProfile(product) {
        if (product.store) {
            this.props.history.push('/sellever?userId=' + product.store.userId);
        }
    }
    handleDragging(e) {
        this.setState({
            onDrag: true,
        });
    }
    handleDragOff(e) {
        this.setState({
            onDrag: false,
        });
    }
    render() {
        let bannerItem = (item, index) => {
            return (
                <div className={stylesHome.listBox} key={index}>
                    <div className={stylesHome.listContent}>
                        <div onDrag={(e) => this.handleDragging(e)} onDrop={(e) => this.handleDragOff(e)} onClick={() => this.goDetail(item.type, item.productId)} className={stylesHome.bgImage} style={{ backgroundImage: 'url("' + (item.imageUrl ? item.imageUrl.replace('original', '640x470') : '/assets/img/img_default_product_banner.png') +'")'}} />
                        <div className={stylesHome.titleBox}>
                            <div onClick={() => this.goProfile(item)}>{item.store ? item.store.name : ''}</div>
                            <div onDrag={(e) => this.handleDragging(e)} onDrop={(e) => this.handleDragOff(e)} onClick={() => this.goDetail(item.type, item.productId)}>
                                {item.title}
                            </div>
                        </div>
                    </div>
                    <div onClick={() => this.goProfile(item)} className={stylesHome.bannerProfile} style={{ backgroundImage: 'url("' + (item.store && item.store.profileUrl ? item.store.profileUrl.replace('original', '80x80') : '/assets/img/img_profile_default.png') + '")'}} />
                </div>
            );
        }
        return (
            <div className={stylesHome.bannerBody}>
                <SwipeBanner listItem={bannerItem} slidesToShow={1} getList={this.state.list} centerMode={true} centerModeMobile={true} centerPadding={'235px'} centerPaddingMobile={'10px'} slideToShow={1} styleName={'home'} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(BannerBody));
