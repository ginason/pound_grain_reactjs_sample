import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import Funding from './Funding';
import Market from './Market';
import Video from './Video';

// Styles
import styleImageList from '../../../Styles/Components/ImageList.css';
import styles from '../../../Styles/App.css';

// Actions
import * as ActionProduct from "../../../Data/Product/action";
import * as ActionAuth from "../../../Data/Authentification/actions";
import * as ParseNumber from '../../../Lib/Utils/parseNumber'
import * as DateUtil from "../../../Lib/Utils/date";
import * as date from '../../../Lib/Utils/date';
/*
* this.props.type
* this.props.listItem
*/
class ImageList extends React.Component {
    constructor(){
        super();
        this.state = {
            isLike: false,
            productType: '',
        }
        this.handleLike = this.handleLike.bind(this);
        this.goDetail = this.goDetail.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.fundingStatus = this.fundingStatus.bind(this);
    }
    componentWillMount() {
        let ptype = '';
        if (this.props.listItem.type === 'funding' || this.props.listItem.type === 1) {
            ptype = 'funding';
        } else if (this.props.listItem.type === 'normal' || this.props.listItem.type === 0) {
            ptype = 'market';
        } else {
            ptype = 'video';
        }
        this.setState({
            isLike: this.props.listItem.isLike,
            productType: ptype,
        });
    }
    handleLike() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        let params = {
            productId: this.props.listItem.productId,
            isLike: !this.state.isLike,
        }

        this.props.dispatch(ActionProduct.productLike(params))
            .then((response) => {
                if (response.code === 200) {
                    this.setState({isLike: !this.state.isLike});
                } else if (response.code === 400) {
                    // 향 후 삭제.
                    this.setState({isLike: !this.state.isLike});
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    goDetail() {
        if (this.state.productType === 'video') {
            this.props.history.push('/video/detail?productId=' + this.props.listItem.productId);
        } else {
            this.props.history.push('/fundingmarket/' + this.state.productType + '?productId=' + this.props.listItem.productId);
        }
    }
    goProfile() {
        if (this.props.listItem.store.type === 0) {
            this.props.history.push('/myhome?userId=' + this.props.listItem.store.userId);
        } else if (this.props.listItem.store.type === 2) {
            this.props.history.push('/sellever?userId=' + this.props.listItem.store.userId);
        } else {
            this.props.history.push('/');
        }
    }
    fundingStatus(option) {
        let today = date.format('dash', new Date());
        if(option.endAt < today) {
            return '종료';
        } else {
            let fundingRatio = Math.floor(option.goalToRaise === 0 || option.currentRaise ? (option.currentRaise / option.goalToRaise) * 100 : 0);
            if( fundingRatio > 100 || fundingRatio === 100) {
                return '성공';
            } else {
                return 'D-' + DateUtil.getLeftDays(option.endAt);
            }
        }
    }
    render() {
        return (
            <div className={styleImageList.listContainer + ' ' + (this.props.type === 'video' ? styleImageList.videoListContainer : '')}>
                    <div className={styleImageList.imageScaleBox}>
                        {this.props.listItem.type === 1 ?
                            <img className={styleImageList.imageScale} src={'/assets/img/img_funding_app.png'} />
                            :
                            (this.props.listItem.type === 2 || this.props.listItem.type === 0 ?
                                <img className={styleImageList.imageScale} src={'/assets/img/img_482x242.png'} />
                                :
                                null
                            )
                        }
                        <div onClick={this.goDetail} className={styleImageList.imageBgBox} />
                        <div onClick={this.goDetail} className={styleImageList.imageBox} style={{backgroundImage: 'url("' + (this.props.listItem.imageUrl ? this.props.listItem.imageUrl.replace('original', '200x200') : '/assets/img/img_default_product.png') + '")' }} />
                    </div>
                {this.props.listItem.type === 2 ?
                    <div className={styleImageList.playingSecond}>{(this.props.listItem.typeInfo ? Math.floor(this.props.listItem.typeInfo.seconds / 60) : '') + ':' + (this.props.listItem.typeInfo ? (this.props.listItem.typeInfo.seconds % 60) : '').toString().padStart(2, '0')}</div>
                    :
                    null
                }
                <div onClick={this.handleLike} className={(this.state.isLike === 0 || !this.state.isLike ? styles.whiteHearLineIcon : styles.whiteHeartFullIcon) + ' ' + styleImageList.clickLike} />
                {this.props.type === 'fundingmarket' && this.props.listItem.type === 1 ?
                    <div onClick={this.goDetail} className={styleImageList.fundProgressBox}>
                        <div className={styleImageList.fundProgressHeader}>
                            <div className={styleImageList.fundPercent}>
                                {this.props.listItem && this.props.listItem.typeInfo ? (Math.floor(this.props.listItem.typeInfo.currentRaise / this.props.listItem.typeInfo.goalToRaise * 100)) : 0}%
                            </div>
                            <div className={styleImageList.left}>
                                {this.props.listItem && this.props.listItem.typeInfo ?
                                    this.fundingStatus(this.props.listItem.typeInfo)
                                    :
                                    0
                                }
                            </div>
                        </div>
                        <div onClick={this.goDetail} className={styleImageList.progressBox}>
                            <div className={'progress ' + styleImageList.progress}>
                                <div className={'progress-bar ' + styleImageList.progressRedBar} style={{ width: (this.props.listItem.typeInfo ? (Math.floor(this.props.listItem.typeInfo.currentRaise / this.props.listItem.typeInfo.goalToRaise * 100)) : '0') + '%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" />
                            </div>
                        </div>
                    </div>
                    :
                    null
                }
                <div className={styleImageList.detailContainer}>
                    {this.props.listItem.type === 2 ?
                        null
                        :
                        <div className={styles.mobileScreen + ' ' + styleImageList.productProfileBox}>
                            <div onClick={this.goProfile} className={styleImageList.mobileProfileBox} style={{ backgroundImage: 'url("' + (this.props.listItem.store.profileUrl ? this.props.listItem.store.profileUrl.replace('original', '80x80') : '/assets/img/img_profile_default.png') + '")' }} />
                            <div onClick={this.goProfile} className={styleImageList.fundingMarketArtist}>{this.props.listItem.store && this.props.listItem.store.name ? this.props.listItem.store.name : '이름없음'}</div>
                        </div>
                    }
                    {this.props.listItem.type === 2 ?
                        null
                        :
                        <div className={styles.fullScreen + ' ' + styleImageList.productProfileBox}>
                            <div onClick={this.goProfile} className={styleImageList.profileBox} style={{ backgroundImage: 'url("' + (this.props.listItem.store.profileUrl ? this.props.listItem.store.profileUrl.replace('original', '80x80') : '/assets/img/img_profile_default.png') + '")' }} />
                            <div onClick={this.goProfile} className={styleImageList.fundingMarketArtist}>{this.props.listItem.store && this.props.listItem.store.name ? this.props.listItem.store.name : '이름없음'}</div>
                        </div>
                    }
                    {this.props.type === 'video' ?
                        null
                    :
                        <div onClick={this.goDetail} className={styleImageList.fundingMarketTitle}>{this.props.listItem.title}</div>
                    }
                    { this.props.type === 'fundingmarket' ?
                        (
                            this.props.listItem.type === 1?
                                <ul onClick={this.goDetail} className={styleImageList.fundBox}>
                                    <li>참여수</li>
                                    <li>{this.props.listItem.saleAmount ? this.props.listItem.saleAmount : 0}명</li>
                                    <li> | </li>
                                    <li>펀딩목표액</li>
                                    <li>
                                        {this.props.listItem && this.props.listItem.typeInfo ? (ParseNumber.numberWithCommas(this.props.listItem.typeInfo.goalToRaise / 10000)) : 0} 만원
                                    </li>
                                </ul>
                                :
                                <div className={styleImageList.fundingMarketBody}> {/*마켓*/}
                                    <div onClick={this.goDetail} className={styleImageList.marketBox}>
                                        <div className={styleImageList.marketPrice}>₩ {ParseNumber.numberWithCommas(this.props.listItem && this.props.listItem.optionInfo && this.props.listItem.optionInfo.length > 0  ? this.props.listItem.optionInfo[0].price : 0)}</div>
                                        {this.props.listItem.inventoryQuantity < 10 ? <div className={styleImageList.marketOption}><span>  |  </span><span>{parseNumber.numberWithCommas(this.props.listItem.left)}개</span> 남음</div> : null}
                                    </div>
                                </div>
                        ) : null
                    }
                    { this.props.type === 'video' ? <Video listItem={this.props.listItem} /> : null }
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(ImageList));
