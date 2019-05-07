import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Styles
import styles from '../../../Styles/Components/ImageList.css';

// Util
import * as NumberUtil from '../../../Lib/Utils/converter'
import * as DateUtil from '../../../Lib/Utils/date';
import * as ParseNumber from '../../../Lib/Utils/parseNumber'
/*
* this.props.listItem
*/
class FundingMarket extends React.Component {
    constructor(props) {
        super(props);

        this.goDetail = this.goDetail.bind(this);
        this.goProfile = this.goProfile.bind(this);
    }
    goDetail() {
        this.props.history.push('/fundingmarket/funding?productId=' + this.props.listItem.productId);
    }
    goProfile() {
        this.props.history.push('/sellever?userId=' + this.props.listItem.store.userId);
    }
    render() {
        return (
            <div className={styles.fundingMarketBody}>
                <div onClick={this.goProfile} className={styles.fundingMarketArtist}>{this.props.listItem.store ? this.props.listItem.store.name : ''}</div>
                <div onClick={this.goDetail} className={styles.fundingMarketTitle}>{this.props.listItem.title}</div>
                <div onClick={this.goDetail} className={styles.progressBox}>
                    <div className={'progress ' + styles.progress}>
                        <div className={'progress-bar ' + styles.progressBar} style={{ width: (this.props.listItem && this.props.listItem.typeInfo ? (Math.floor(this.props.listItem.typeInfo.currentRaise / this.props.listItem.typeInfo.goalToRaise * 100)) : '0') + '%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" />
                    </div>
                    {/*<div className={styles.customProgress}>*/}
                        {/*<div*/}
                            {/*className={styles.progressNum}*/}
                            {/*style={{right: (100 - (this.props.listItem && this.props.listItem.typeInfo ? (Math.floor((this.props.listItem.typeInfo.currentRaise / this.props.listItem.typeInfo.goalToRaise) * 100)) : 0)) + '%' }}>*/}
                            {/*{(this.props.listItem && this.props.listItem.typeInfo ? (Math.floor((this.props.listItem.typeInfo.currentRaise / this.props.listItem.typeInfo.goalToRaise) * 100)) : 0)}%*/}
                        {/*</div>*/}
                    {/*</div>*/}
                </div>
                <div onClick={this.goDetail} className={styles.fundBox}>
                    <div className={styles.fundPercent}>
                        <div>{this.props.listItem && this.props.listItem.typeInfo ? (Math.floor(this.props.listItem.typeInfo.currentRaise / this.props.listItem.typeInfo.goalToRaise * 100)) : 0}%</div>
                        <div>펀딩율</div>
                    </div>
                    <div className={styles.fundAttendant}>
                        <div>{this.props.listItem.saleAmount ? this.props.listItem.saleAmount : 0}</div>
                        <div>참여수</div>
                    </div>
                    <div className={styles.left}>
                        <div>{this.props.listItem && this.props.listItem.typeInfo ? DateUtil.getLeftDays(this.props.listItem.typeInfo.endAt) : 0}</div>
                        <div>남은일</div>
                    </div>
                    <div className={styles.goal}>
                        <div>{this.props.listItem && this.props.listItem.typeInfo ? (ParseNumber.numberWithCommas(this.props.listItem.typeInfo.goalToRaise / 10000)) : 0}<span>만원</span></div>
                        <div>펀딩목표액</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect()(withRouter(FundingMarket));
