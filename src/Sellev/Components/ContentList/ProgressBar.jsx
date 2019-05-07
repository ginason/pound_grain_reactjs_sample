import React, { Component } from 'react';
import {
    Link,
    withRouter,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router';

// Styles
import stylesContent from '../../Styles/Components/ContentList.css';
import * as DateUtil from "../../Lib/Utils/date";
import * as ParseNumber from "../../Lib/Utils/parseNumber";

// Actions

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: this.props.listItem,
        }
    }
    render() {
        return (
            <div>
                {/*<div className={stylesContent.progressBox}>
                    <div className={'progress ' + stylesContent.progress}>
                        <div className={'progress-bar ' + stylesContent.progressBar} style={{ width: (Math.floor(this.props.product.product.typeInfo.currentRaise / this.props.product.product.typeInfo.goalToRaise) * 100) + '%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" />
                    </div>
                    <div
                        className={stylesContent.progressNum}
                        style={
                            (Math.floor(this.props.product.product.typeInfo.currentRaise / this.props.product.product.typeInfo.goalToRaise) * 100) < 25 ? { right: '84%' } : { right: (100 - (Math.floor(this.props.product.product.typeInfo.currentRaise / this.props.product.product.typeInfo.goalToRaise) * 100)) + '%' }
                        }
                    >
                        {(Math.floor(this.props.product.product.typeInfo.currentRaise / this.props.product.product.typeInfo.goalToRaise) * 100)}%
                    </div>
                </div>
                <div className={stylesContent.fundBox}>
                    <div className={stylesContent.fundPercent}>
                        <div>{(Math.floor(this.props.product.product.typeInfo.currentRaise / this.props.product.product.typeInfo.goalToRaise) * 100)}%</div>
                        <div>펀딩율</div>
                    </div>
                    <div className={stylesContent.fundAttendant}>
                        <div>{this.props.product.product.typeInfo.saleAmount ? this.props.product.product.typeInfo.saleAmount : 0}</div>
                        <div>참여수</div>
                    </div>
                    <div className={stylesContent.left}>
                        <div>{DateUtil.getLeftDays(this.props.product.product.typeInfo.endAt)}</div>
                        <div>남은일</div>
                    </div>
                    <div className={stylesContent.goal}>
                        <div>{ParseNumber.numberWithCommas(this.props.product.product.typeInfo.goalToRaise / 10000)}<span>만원</span></div>
                        <div>펀딩목표액</div>
                    </div>
                </div>*/}
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        product: state.data.productInfo.product,
    };
})(withRouter(ProgressBar));