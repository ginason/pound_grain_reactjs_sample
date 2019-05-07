import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import DetailContentSide from './DetailContentSide';

//Style
import stylesDetail from '../../Styles/Components/FundingMarket.css';
import styles from '../../Styles/App.css';
import stylesContent from '../../Styles/Components/ContentList.css';

// Utils
import * as DateUtil from '../../Lib/Utils/date';
import * as NumberUtil from '../../Lib/Utils/parseNumber';

const mql = window.matchMedia('(max-width: 768px)');

class DetailContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hashTagList: ['혁오', '혁오밴드', '소규모콘서트', '혁오', '혁오', '혁오밴드', '소규모콘서트'],
            isSelect: 0,
            mediaQuery: mql.matches,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleOption = this.handleOption.bind(this);
        this.handleGoHashtag = this.handleGoHashtag.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
    }
    componentWillMount() {
        mql.addListener(this.handleChange);
        if(this.props.contentFixed) {
            this.setState({
                contentFixed: true,
            })
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    handleChange() {
        this.setState({
            mql: mql,
        });
        if (this.state.mql.matches) {
            this.setState({
                mediaQuery: true,
            });
        } else {
            this.setState({
                mediaQuery: false,
            });
        }
    }
    handleOption(index) {
        this.setState({
            isSelect: index,
        });
    }
    handleGoHashtag(hashtagId) {
        this.props.history.push('/hashtags/detail?hashtagId=' + hashtagId)
    }
    handlePayment() {
        this.props.selectFunding();
    }
    render() {
        console.log('console.log(this.props.listInfo);');
        console.log(this.props.listInfo);
        let hashTagList = this.props.listItem && this.props.listItem.hashtags && this.props.listItem.hashtags.length > 0 ?
            (this.props.listItem.hashtags.map((item, index) => {
                return (
                    <div key={index} onClick={() => this.handleGoHashtag(item.hashtagId)} className={stylesContent.hashTagBtn +' '+ stylesContent.customizedHashTag}>
                        #{item.hashtag}
                    </div>
                )
            })) : null;
        let fundingOption = this.props.listItem && this.props.listItem.
            optionInfo ? (this.props.listItem.optionInfo.map((item, index) => {
            return(
                <li key={index}>
                    <div className={stylesDetail.selectorBox}>
                        <div className={stylesDetail.sideSelector}><span>{item.saleAmount}명</span>이 선택</div>
                    </div>
                    {item.inventoryQuantity > 0 ?
                        <div onClick={() => this.handleOption(index)} className={stylesDetail.selectFunding + ' ' + (this.state.mediaQuery ? (this.state.isSelect === index ?  styles.checkMobile : styles.noneCheckMobile) : (this.state.isSelect === index ? styles.checkIcon : styles.noneCheckIcon))} />
                        :
                        <div className={stylesDetail.fundingEnd + ' ' + stylesDetail.selectFunding}>참여마감</div>
                    }
                    <div className={stylesDetail.sidePrice}>{NumberUtil.numberWithCommas(item.price)}<span>원</span></div>
                    <div>
                        <div>{item.title}</div>
                        <div>{item.product}</div>
                    </div>
                    <div className={stylesDetail.sideInfo}>
                        <span>배송비</span>
                        <span>{NumberUtil.numberWithCommas(item.deliveryPrice)}원</span>
                    </div>
                    <div className={stylesDetail.sideInfo}>
                        <span>상품발송일</span>
                        <span>{DateUtil.format('dash',item.deliverAt)}  예정</span>
                    </div>
                    <div className={stylesDetail.sideInfo}>
                        <span>제한수량</span>
                        <span>{item.inventoryQuantity}개</span>
                    </div>
                </li>
            );
        })) : null;
        let contentSide = () => {
            return (
                <div className={stylesDetail.detailContentSideBox}>
                    <div className={stylesDetail.contentTitle}>펀딩을 선택해보세요</div>
                    <ul className={stylesDetail.detailContentSideList}>
                        {fundingOption}
                    </ul>
                    {/*full screen version*/}
                    <div className={stylesDetail.fullScreen}>
                        <div onClick={this.handlePayment} className={styles.btn47Black + ' ' + stylesDetail.fundingBtn}>펀딩하기</div>
                    </div>
                </div>
            );
        }
        let handleBreakLine = this.props.listItem && this.props.listItem.descriptionShort ? this.props.listItem.descriptionShort.split('\n').map((item, index) => {
            return (
                <span key={index}>{item}<br /></span>
            );
        })
            :
            null;
        return (
            <div>
                <ul className={stylesDetail.detailContentLeft}>
                    {this.props.detailType === 'funding' ?
                        <li className={styles.fullScreen}>
                            <div className={stylesDetail.contentTitle}>펀딩설명</div>
                            <div>{handleBreakLine}</div>
                            <div>{this.props.listItem.descriptionShort ? this.props.listItem.descriptionShort : ''}</div>
                        </li>
                    :
                        <li className={styles.fullScreen}>
                            <div className={stylesDetail.contentTitle}>상품설명</div>
                            <div>{handleBreakLine}</div>
                            <div>{this.props.listItem.descriptionShort ? this.props.listItem.descriptionShort : ''}</div>
                        </li>
                    }
                    {
                        this.props.detailType === 'funding' && this.props.listInfo ?
                            <li>
                                <div className={stylesDetail.contentTitle}>개요</div>
                                <ul className={stylesDetail.goalBox}>
                                    <li>
                                        <span>시작종료</span>
                                        <span>{DateUtil.format('point', this.props.listInfo.startAt ? this.props.listInfo.startAt : 0) + '~' + DateUtil.format('point', this.props.listInfo.endAt ? this.props.listInfo.endAt : 0)}</span>
                                    </li>
                                    <li>
                                        <span>목표금액</span>
                                        <span>{NumberUtil.numberWithCommas(this.props.listInfo.goalToRaise ? this.props.listInfo.goalToRaise : 0)}원</span>
                                    </li>
                                    <li>
                                        <span>펀딩금액</span>
                                        <span>{NumberUtil.numberWithCommas(this.props.listInfo.currentRaise ? this.props.listInfo.currentRaise : 0)}원</span>
                                    </li>
                                    <li>
                                        <span>참여인원</span>
                                        <span>{NumberUtil.numberWithCommas(this.props.listItem && this.props.listItem.saleAmount ? this.props.listItem.saleAmount : 0)}명</span>
                                    </li>
                                </ul>
                            </li>
                            : null
                    }
                    <li>
                        {
                            this.props.detailType === 'market' ?
                                <div className={stylesDetail.contentTitle}>상세정보</div>
                            :
                            null
                        }
                        <div dangerouslySetInnerHTML = { {__html: this.props.listItem.description}} />

                        <div>
                            <div className={stylesDetail.hashTagBox}>
                                {hashTagList}
                            </div>
                        </div>
                    </li>
                    {this.props.detailType === 'funding' ?
                    <li className={stylesDetail.detailContentRight + ' ' + styles.mobileScreen}>
                        {contentSide()}
                    </li>
                        : null}
                    <li>
                        <div className={stylesDetail.redCircle} />
                        <div className={stylesDetail.notificationTitle}>이 프로젝트가 예상하는 리워드 발송 변동 기간은 최대 <span>7</span>일입니다.</div>
                        <div>
                            펀딩 받은 후, 리워드를 제작할 수 있는 크라우드펀딩의 특성과 생산 과정에서의 예상치 못한 상황으로 인하여 리워드
                            발송 시작일이 다소 지연될 수 있습니다. 이에 셀레브는 메이커와 서포터 모두를 보호하기 위해 예상되는 리워드 발송
                            변동 기간을 미리 명시하고 이에 따른 정책을 기재하도록 하고 있습니다.
                        </div>
                    </li>
                    <li>
                        <div className={stylesDetail.redCircle} />
                        <div className={stylesDetail.notificationTitle}>교환 / 환불 /AS 절차</div>
                        <div>
                            제품 하자로 인한 교환/수리 시, 발생하는 비용은 전액 메이커가 부담합니다.
                            리워드 수령 60일 내 동일 증상으로 3번 이상 수리 시, 환불 가능합니다.
                            리워드 수령 1년 이내 제품 하자로 인한 교환/수리 문의는 info@welle.co.kr로 신청 가능합니다.
                            제품 하자가 아닌 서포터님 부주의로 인한 제품 손상은 유상수리해 드립니다.
                        </div>
                    </li>
                </ul>
                <div className={stylesDetail.detailContentRight + ' ' + styles.fullScreen}>
                    {this.props.detailType === 'funding' ? contentSide() : null}
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(DetailContent));