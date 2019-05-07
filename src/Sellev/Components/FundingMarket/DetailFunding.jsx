import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import DetailContent from './DetailContent';
import DetailComments from '../ContentList/DetailComments';
import ProductRanking from '../ContentList/ProductRanking/index';

// Styles
import stylesImageList from '../../Styles/Components/ImageList.css';
import stylesDetail from '../../Styles/Components/FundingMarket.css';
import styles from '../../Styles/App.css';

// Actions
import * as ActionProduct from '../../Data/Product/action';
import * as ActionAuth from '../../Data/Authentification/actions';
import * as ActionComment from "../../Data/Comments/actions";

// Utils
import * as parseUrlParameter from "../../Lib/Utils/parseUrlParameter";
import * as DateUtil from "../../Lib/Utils/date";
import * as NumberUtil from '../../Lib/Utils/parseNumber';
import * as ActionCart from "../../Data/ProductCart/action";


class DetailFunding extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: {},

            commentTotal: 0,
            commentParentTotal: 0,
        }
        this.getProduct = this.getProduct.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.increaseHit = this.increaseHit.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
        this.getCommentCount = this.getCommentCount.bind(this);
        this.handleCart = this.handleCart.bind(this);
        this.getCartList = this.getCartList.bind(this);
        this.fundingStatus = this.fundingStatus.bind(this);
    }
    componentWillMount() {
        window.scrollTo(0, 0);
        this.getProduct(this.props.location.search);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.search !== this.props.location.search) {
            window.scrollTo(0, 0);
            this.getProduct(nextProps.location.search);
            return true;
        }

        if (nextState !== this.state) {
            return true;
        }

        return false;
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    increaseHit(productId) {
        ActionProduct.increaseHit({ productId: productId });
    }
    getProduct(search) {
        let urlParams = parseUrlParameter.parse(search);

        this.setState({
            product: {},

            commentTotal: 0,
            commentParentTotal: 0,
        });

        if (urlParams.productId) {
            this.props.dispatch(ActionProduct.getProductOne(urlParams.productId))
                .then((response) => {
                    if (response.code === 200) {
                        console.log('product');
                        console.log(response);
                        this.setState({
                            product: response.data.product,
                        });
                        this.getCommentCount(urlParams.productId);
                        this.increaseHit(urlParams.productId);
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            this.props.history.push('/fundingmarket');
        }
    }
    getCommentCount(productId) {
        ActionComment.commentCount(productId)
            .then((response) => {
                this.setState({
                    commentTotal: response.total,
                    commentParentTotal: response.count,
                })
            })
            .catch((err) => {});
    }
    goProfile() {
        this.props.history.push('/sellever?userId=' + (this.state.product && this.state.product.store ? this.state.product.store.userId : ''));
    }
    handleLike() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        let params = {
            productId: this.state.product.productId,
            isLike: !this.state.product.isLike,
        }
        this.props.dispatch(ActionProduct.productLike(params))
            .then((response) => {
                if (response.code === 200) {
                    let newProduct = this.state.product;

                    if (this.state.product) {
                        newProduct.isLike = !newProduct.isLike;

                        if (newProduct.isLike) {
                            newProduct.likeAmount = newProduct.likeAmount + 1;
                        } else {
                            newProduct.likeAmount = newProduct.likeAmount - 1;
                        }
                    }
                    this.setState({
                        product: newProduct,
                    })
                } else if (response.code === 400) {
                    // 향 후 삭제.
                    this.setState({isLike: !this.state.isLike});
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    handleComment() {
        this.props.history.push('/comment?productId=' + (this.state.product ? this.state.product.productId : ''));
    }
    handlePayment() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        if (this.state.product && this.state.product.optionInfo && this.state.product.optionInfo.length > 0) {
            // let payment = {};
            // let paymentOptionArray = [];
            // let paymentOption = {};
            //
            // paymentOption['optionId'] = this.state.product.optionInfo[this.detailContent.state.isSelect].optionId;
            // paymentOption['quantity'] = 1;
            //
            // paymentOptionArray = [paymentOption, ...paymentOptionArray];
            //
            // payment['product'] = this.state.product;
            // payment['option'] = paymentOptionArray;
            // this.props.history.push({
            //     pathname: '/payment',
            //     state: { paymentItem: payment },
            //     search: '?displayTab=0'
            // });
            if(this.fundingStatus(this.state.product.typeInfo) === '펀딩종료') {
                alert('이미 종료된 펀딩입니다.');
            } else {
                this.getCartList();
                setTimeout(() => {
                    this.props.history.push({
                        pathname: '/payment',
                        search: '?displayTab=0'
                    });
                }, 100);
            }
        } else {
            alert('선택된 상품이 없습니다.');
            return;
        }
    }
    getCartList() {
        console.log('console.log(response);');
        console.log(this.state.product);

        if (this.state.product && this.state.product.optionInfo && this.state.product.optionInfo.length > 0) {

            let params = {
                productId: this.state.product.productId,
                optionId: this.state.product.optionInfo[this.detailContent.state.isSelect].optionId,
                quantity: 1,
            }
            ActionCart.createCartList(params)
                .then((response) => {
                    if (response.code === 200) {
                        console.log('console.log(response);');
                        console.log(response);
                        console.log('createCartList');
                    }
                })
        } else {
            alert('선택된 상품이 없습니다.');
            return;
        }

    }
    handleCart() {
        if(this.fundingStatus(this.state.product.typeInfo) === '펀딩종료') {
            alert('이미 종료된 펀딩입니다.');
        } else {
            if(this.state.product && this.state.product.optionInfo.length > 0) {
                this.getCartList();
                alert('장바구니에 추가되었습니다.');
            } else {
                alert('상품을 선택해 주세요.');
            }
        }
    }
    fundingStatus(option) {
        let today = DateUtil.format('dash', new Date());
        if(option.endAt < today) {
            return '펀딩종료';
        } else {
            let fundingRatio = option.goalToRaise === 0 ? Math.floor((option.goalToRaise / option.currentRaise) * 100) : 0;
            if( fundingRatio > 100 || fundingRatio === 100) {
                return '펀딩성공';
            } else {
                return '';
            }
        }
    }
    render() {
        let progressBarMobile = (
            <div className={stylesImageList.fundingMarketBody}>
                <div className={stylesDetail.progressBox}>
                    <div className={'progress ' + stylesDetail.progress}>
                        <div className={'progress-bar ' + stylesDetail.progressBar} style={{ width: (this.state.product && this.state.product.typeInfo ? Math.floor((this.state.product.typeInfo.currentRaise / this.state.product.typeInfo.goalToRaise) * 100) : 0) + '%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" />
                    </div>
                    <div className={stylesImageList.customProgress}>
                        <div
                            className={stylesImageList.progressNum}
                            style={{ right: (100 - (this.state.product && this.state.product.typeInfo ? (Math.floor((this.state.product.typeInfo.currentRaise / this.state.product.typeInfo.goalToRaise) * 100)) : 0)) + '%' }}>
                            {(this.state.product && this.state.product.typeInfo ? (Math.floor((this.state.product.typeInfo.currentRaise / this.state.product.typeInfo.goalToRaise) * 100)) : 0)}%
                        </div>
                    </div>
                </div>
                <ul className={stylesDetail.fundingMobileOthers}>
                    <li>
                        <div className={stylesDetail.content}>{this.state.product && this.state.product.typeInfo ? Math.floor((this.state.product.typeInfo.currentRaise / this.state.product.typeInfo.goalToRaise) * 100) : 0}%</div>
                        <div className={stylesDetail.title}>펀딩율</div>
                    </li>
                    <li>
                        <div className={stylesDetail.content}>{NumberUtil.numberWithCommas(DateUtil.getLeftDays(this.state.product && this.state.product.typeInfo ? this.state.product.typeInfo.endAt : 0))}</div>
                        <div className={stylesDetail.title}>남은일</div>
                    </li>
                    <li>
                        <div className={stylesDetail.content}>{this.state.product && this.state.product.saleAmount ? NumberUtil.numberWithCommas(this.state.product.saleAmount) : 0}</div>
                        <div className={stylesDetail.title}>참여수</div>
                    </li>
                    <li>
                        {this.state.product && this.state.product.typeInfo ?
                            (this.fundingStatus(this.state.product.typeInfo) === '' ?
                                <div className={stylesDetail.titleWhite}>목표금액</div>
                                :
                                <div className={stylesDetail.content}>{this.fundingStatus(this.state.product.typeInfo)}</div>
                            )
                        :
                            <div className={stylesDetail.titleWhite}>목표금액</div>
                        }
                        <div className={stylesDetail.title}>
                            {NumberUtil.numberWithCommas(this.state.product && this.state.product.typeInfo ? '₩' + (this.state.product.typeInfo.goalToRaise) : 0)}
                        </div>
                    </li>
                </ul>
            </div>
        );
        let progressBar = (
            <div>
                <div className={stylesDetail.progressBox}>
                    <div className={'progress ' + stylesDetail.progress}>
                        <div className={'progress-bar ' + stylesDetail.progressBar} style={{ width: (this.state.product && this.state.product.typeInfo ? Math.floor((this.state.product.typeInfo.currentRaise / this.state.product.typeInfo.goalToRaise) * 100) : 0) + '%' }} aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" />
                    </div>
                    <div className={stylesImageList.customProgress}>
                        <div
                            className={stylesImageList.progressNum}
                            style={{ right: (100 - (this.state.product && this.state.product.typeInfo ? (Math.floor((this.state.product.typeInfo.currentRaise / this.state.product.typeInfo.goalToRaise) * 100)) : 0)) + '%' }}>
                            {(this.state.product && this.state.product.typeInfo ? (Math.floor((this.state.product.typeInfo.currentRaise / this.state.product.typeInfo.goalToRaise) * 100)) : 0)}%
                        </div>
                    </div>
                </div>
                <ul className={stylesDetail.fundingOthers}>
                    <li>
                        <div className={stylesDetail.title}>남은일</div>
                        <div className={stylesDetail.content}>{NumberUtil.numberWithCommas(DateUtil.getLeftDays(this.state.product && this.state.product.typeInfo ? this.state.product.typeInfo.endAt : 0))}</div>
                    </li>
                    <li>
                        <div className={stylesDetail.title}>참여수</div>
                        <div className={stylesDetail.content}>{this.state.product && this.state.product.saleAmount ? NumberUtil.numberWithCommas(this.state.product.saleAmount) : 0}</div>
                    </li>
                </ul>
                <div className={stylesDetail.fundingBtnBox}>
                    <div onClick={this.handleCart} className={styles.btn47White + ' ' + stylesDetail.marketBtn}>장바구니</div>
                    <div onClick={this.handlePayment} className={styles.btn47Black + ' ' + stylesDetail.marketBtn}>펀딩하기</div>
                    <div className={styles.btn47White + ' ' + stylesDetail.likeBtn} onClick={this.handleLike}>
                        {this.state.product && this.state.product.isLike ?
                            <div className={stylesDetail.btnContent}>
                                <div className={stylesDetail.likeImage + ' ' + stylesDetail.likePink} />
                                <div className={stylesDetail.number  + ' ' + stylesDetail.numberPink}>{NumberUtil.numberWithCommas(this.state.product.likeAmount)}</div>
                            </div>
                            :
                            <div className={stylesDetail.btnContent}>
                                <div className={stylesDetail.likeImage} />
                                <div className={stylesDetail.number}>{NumberUtil.numberWithCommas(this.state.product.likeAmount)}</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
        let handleBreakLine = this.state.product && this.state.product.descriptionShort ? this.state.product.descriptionShort.split('\n').map((item, index) => {
                return (
                    <div key={index}>{item}<br /></div>
                );
            })
            :
            null;
        return (
            <div className={stylesDetail.fundingContainer}>
                <div className={stylesDetail.fundingHeader}>
                    <div onClick={this.goProfile} className={stylesDetail.fundingNameBox}>
                        <div className={stylesDetail.profile} style={{ backgroundImage: 'url("' + (this.state.product && this.state.product.store && this.state.product.store.profileUrl ? this.state.product.store.profileUrl.replace('original', '80x80') : '/assets/img/img_default_product_detail.png') + '")' }} />
                        <span>{this.state.store ? this.state.store.name : ''}</span>
                    </div>
                    <div className={stylesDetail.fundingTitleBox}>
                        {this.state.product.title}
                    </div>
                </div>
                <div className={stylesDetail.fundingBody}>
                    <div className={stylesDetail.bgImage} style={{ backgroundImage: 'url("' + (this.state.product && this.state.product.imageUrl ? this.state.product.imageUrl.replace('original', '640x470') : '/assets/img/img_profile_default.png') + '")'}} />
                    <div className={stylesDetail.contentBox + ' ' + styles.mobileScreen}>
                        {handleBreakLine}
                        {/*<div>{this.state.product.descriptionShort ? this.state.product.descriptionShort : ''}</div>*/}
                    </div>
                    <div className={stylesDetail.fundDetailMobile}>
                        {progressBarMobile}
                    </div>
                    <div className={stylesDetail.fundingBox}>
                        <div className={stylesDetail.priceTitle}>
                            <div className={stylesDetail.redCircle} />
                            {this.state.product && this.state.product.typeInfo ?
                                (this.fundingStatus(this.state.product.typeInfo) === '' ?
                                    <div className={stylesDetail.title}>
                                        펀딩금액
                                    </div>
                                    :
                                    <div className={stylesDetail.title}>
                                        {this.fundingStatus(this.state.product.typeInfo)}
                                    </div>
                                )
                                :
                                <div className={stylesDetail.title}>
                                    펀딩금액
                                </div>
                            }

                        </div>
                        <div className={stylesDetail.price}>
                            <div className={stylesDetail.priceUnit}>₩</div>
                            {NumberUtil.numberWithCommas(this.state.product && this.state.product.typeInfo ? (this.state.product.typeInfo.goalToRaise) : 0)}
                        </div>
                        <div className={stylesDetail.percentage}>{this.state.product && this.state.product.typeInfo && this.state.product.typeInfo.goalToRaise ? (Math.floor((this.state.product.typeInfo.currentRaise / this.state.product.typeInfo.goalToRaise) * 100)) : 0}%</div>
                        {progressBar}
                    </div>
                </div>
                <div className={stylesDetail.detailContentBody}>
                    <DetailContent onRef={(ref) => this.detailContent = ref} selectFunding={() => this.handlePayment()} detailType={'funding'} listItem={this.state.product} listInfo={this.state.product ? this.state.product.typeInfo : null}/>
                </div>
                <div className={styles.fullScreen}>
                    <DetailComments productId={this.state.product ? this.state.product.productId : ''} />
                </div>
                {/*mobile version*/}
                <div className={styles.mobileBtnBox}>
                    <div className={styles.mobileBtn}>
                        <div className={styles.btnBoxLeft}>
                            <div onClick={this.handleLike} className={(this.state.product && this.state.product.isLike ? styles.pinkHeartMobile : styles.whiteHeartMobile)} /><span>{NumberUtil.numberWithCommas(this.state.product ? this.state.product.likeAmount : 0)}</span>
                            <div onClick={this.handleComment} className={styles.commentImage} /><span>{this.state.commentTotal}</span>
                        </div>
                        <div onClick={this.handlePayment} className={styles.btnBoxRight}>펀딩하기</div>
                    </div>
                </div>
                <div className={stylesDetail.fundingMarketBody + ' ' + stylesDetail.detailRankingMarket}>
                    <div className={stylesDetail.rankHeader}>
                        <div className={styles.sectionSmallTitle}>놓치지 마세요</div>
                        <div className={styles.sectionTitle}>실시간 인기펀딩</div>
                    </div>
                    <ProductRanking productType={'funding'} isFunding={true} isNormal={false} isVideo={false} productTitle={['판매순', '조회순', '신규']} sortMethod={['raise', 'hit', 'date']} />
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        product: state.data.productInfo.product,
    };
})(withRouter(DetailFunding));
