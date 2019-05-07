import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Styles
import styles from '../../../Styles/Components/ImageList.css';

// Actions

// Utils
import * as parseNumber from '../../../Lib/Utils/parseNumber';
/*
* this.props.listItem
*/
//상품가격은 상품옵션 맨처음 가격으로 보여짐
class Market extends React.Component {
    constructor(props) {
        super(props);

        this.goDetail = this.goDetail.bind(this);
        this.goProfile = this.goProfile.bind(this);
    }
    goDetail() {
        this.props.history.push('/fundingmarket/market?productId=' + this.props.listItem.productId);
    }
    goProfile() {
        this.props.history.push('/sellever?userId=' + this.props.listItem.store.userId);
    }
    render() {
        return (
                <div className={styles.fundingMarketBody}>
                    <div onClick={this.goProfile} className={styles.fundingMarketArtist}>{this.props.listItem.store && this.props.listItem.store.name ? this.props.listItem.store.name : '이름없음'}</div>
                    <div onClick={this.goDetail} className={styles.fundingMarketTitle}>{this.props.listItem.title}</div>
                    <div onClick={this.goDetail} className={styles.marketBox}>
                        <div className={styles.marketPrice}><div className={styles.currencyIcon + ' ' + styles.mobileSize} />{parseNumber.numberWithCommas(this.props.listItem && this.props.listItem.optionInfo && this.props.listItem.optionInfo.length > 0  ? this.props.listItem.optionInfo[0].price : 0)}</div>
{/*
                        {this.props.listItem.inventoryQuantity < 10 ? <div className={styles.marketOption}><span>  |  </span><span>{parseNumber.numberWithCommas(this.props.listItem.left)}개</span> 남음</div> : null}
*/}
                    </div>
                </div>
        );//*상품이 일정수량 이하 남으면 화면에 보여줌 *//
    }
}
export default connect()(withRouter(Market));
