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
import stylesDetail from '../../Styles/Components/FundingMarket.css';
import styles from '../../Styles/App.css';

// Actions
import * as ActionProduct from '../../Data/Product/action';
import * as ActionAuth from '../../Data/Authentification/actions';
import * as ActionComment from "../../Data/Comments/actions";
import * as ActionCart from '../../Data/ProductCart/action';

// Utils
import * as parseUrlParameter from "../../Lib/Utils/parseUrlParameter";
import * as NumberUtil from '../../Lib/Utils/parseNumber';

class DetailMarket extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: {},
            productAmount: 1,
            productOptions: [],
            productPrice: 0,
            optionId: 0,
            totalOptionPrice: 0,
            shippingFee: 0,

            commentTotal: 0,
            commentParentTotal: 0,

            inventoryQuantity: 0,
        }

        this.getProduct = this.getProduct.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.increaseHit = this.increaseHit.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
        this.getCommentCount = this.getCommentCount.bind(this);
        this.handleAmountOption = this.handleAmountOption.bind(this);
        this.handleProductOption = this.handleProductOption.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.getTotalPrice = this.getTotalPrice.bind(this);
        this.handleCart = this.handleCart.bind(this);
        this.getCartList = this.getCartList.bind(this);
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
    increaseHit(productId) {
        ActionProduct.increaseHit({ productId: productId });
    }
    getProduct(search) {
        let urlParams = parseUrlParameter.parse(search);

        this.setState({
            product: {},
            productAmount: 1,
            productPrice: 0,
            optionId: 0,

            commentTotal: 0,
            commentParentTotal: 0,
        });

        if (urlParams.productId) {
            this.props.dispatch(ActionProduct.getProductOne(urlParams.productId))
                .then((response) => {
                    if (response.code === 200) {
                        this.setState({
                            product: response.data.product,
                            optionId: response.data.product && response.data.product.optionInfo > 0 ? response.data.product.optionInfo[0].optionId : 0,
                            productPrice: response.data.product && response.data.product.optionInfo ? response.data.product.optionInfo[0].price : '',
                            deliveryPrice: response.data.product && response.data.product.optionInfo ? response.data.product.optionInfo[0].deliveryPrice : '', //배송비처리는 임의로 첫번째 option 값을 받아서 우선 처리했습니다.
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
        if (this.state.product) {
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
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    handleComment() {
        this.props.history.push('/comment?productId=' + this.state.product.productId);
    }
    handlePayment() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        if (this.state.productOptions && this.state.productOptions.length > 0) {
            // let payment = {};
            //
            // payment['product'] = this.state.product;
            // payment['option'] = this.state.productOptions;

            // this.props.history.push({
            //     pathname: '/payment',
            //     state: { paymentItem: payment }
            // });
            this.getCartList();
            setTimeout(() => {
                this.props.history.push({
                    pathname: '/payment',
                    search: '?displayTab=1'
                });
            }, 100)
        } else {
            alert('선택된 상품이 없습니다.');
            return;
        }
    }
    getCartList() {
        for(let i =0; i < this.state.productOptions.length; i++) {
            if(this.state.productOptions && this.state.productOptions[i] && this.state.productOptions[i].optionId && this.state.productOptions[i].currentAmount) {
                let params = {
                    productId: this.state.product.productId,
                    optionId: this.state.productOptions[i].optionId,
                    quantity: this.state.productOptions[i].currentAmount
                }
                ActionCart.createCartList(params)
                    .then((response) => {
                        if (response.code === 200) {
                            console.log('createCartList');
                        }
                    })
            } else {
                alert('상품을 선택해 주세요.');
                return;
            }
        }
    }
    handleCart() {
        if(this.state.productOptions && this.state.productOptions.length > 0) {
            this.getCartList();
            alert('장바구니에 추가되었습니다.');
        } else {
            alert('상품을 선택해 주세요.');
        }
    }
    findOptionFieldIndex(field, value) {
        if (this.state.product && this.state.product.optionInfo) {
            for (let i=0; i<this.state.product.optionInfo.length; i++) {
                if (this.state.product.optionInfo[i][field] === value) {
                    if(this.state.product.optionInfo[i]['price'] === 0) {
                        return {price: 0, deliveryPrice: 0, inventoryQuantity: 0};
                    } else {
                        let optionList = {};
                        optionList = this.state.product.optionInfo[i];
                        return optionList;
                    }
                }
            }
        } else {
            return {price: 0, deliveryPrice: 0, inventoryQuantity: 0};
        }
    }
    handleProductOption(e) {
        this.setState({optionId: e.target.value},
            () => {
                if(this.state.productOptions && this.state.productOptions.length > 0) {
                    for(let i=0; i < this.state.productOptions.length; i++) {
                        if(this.state.optionId === this.state.productOptions[i].optionId) {
                            this.setState({
                                productOptions: this.state.productOptions,
                            }, () => {
                                this.getTotalPrice(this.state.productOptions);
                            });
                            alert("이미 선택되어 있는 옵션입니다.");
                            return
                        }else {
                            let optionArray = {};
                            console.log(this.state.productAmount);
                            optionArray = this.findOptionFieldIndex('optionId', this.state.optionId);
                            optionArray['currentAmount'] = this.state.productAmount;
                            optionArray['imageUrl'] = this.state.product.imageUrl;
                            optionArray['store'] = this.state.product.store;
                            optionArray['productTitle'] = this.state.product.title;
                            this.setState({
                                productOptions: [...this.state.productOptions, optionArray]
                            }, () => {
                                this.getTotalPrice(this.state.productOptions);
                            })
                        }
                    }
                } else {
                    let optionArray = {};
                    console.log(this.state.productAmount);
                    optionArray = this.findOptionFieldIndex('optionId', this.state.optionId);
                    optionArray['currentAmount'] = this.state.productAmount;
                    optionArray['imageUrl'] = this.state.product.imageUrl;
                    optionArray['store'] = this.state.product.store;
                    optionArray['productTitle'] = this.state.product.title;
                    this.setState({
                        productOptions: [...this.state.productOptions, optionArray]
                    }, () => {
                        this.getTotalPrice(this.state.productOptions);
                    })
                }
        });
    }
    handleAmountOption(index, operation) {
        if(operation === 0) {
            let getOption = this.state.productOptions;
            let currentAmount = getOption[index].currentAmount;
            currentAmount = currentAmount - 1;
            if(currentAmount > 0) {
                getOption[index].currentAmount = getOption[index].currentAmount - 1;
                this.setState({
                    productOptions: getOption,
                })
            } else {
                getOption[index].currentAmount = 1;
                this.setState({
                    productOptions: getOption,
                })
                alert('최소수량은 1이상입니다.');
            }
            this.getTotalPrice(this.state.productOptions);
        } else if (operation === 1) {
            let getOption = this.state.productOptions;
            let currentAmount = getOption[index].currentAmount;
            currentAmount = currentAmount + 1;
            let inventoryQuantity = this.state.productOptions[index].inventoryQuantity;
            if(currentAmount > inventoryQuantity) {
                this.setState({
                    productOptions: getOption,
                })
                alert("재고보다 많은 수량을 선택하셨네요. 다시 선택해주세요.");
            } else {
                getOption[index].currentAmount = getOption[index].currentAmount + 1;
                this.setState({
                    productOptions: getOption,
                })
            }
            this.getTotalPrice(this.state.productOptions);
        }
    }
    handleDelete(index) {
            console.log('productOptions');
            this.state.productOptions.splice(index, 1);
            this.setState({
                productOptions: this.state.productOptions,
            })
            this.getTotalPrice(this.state.productOptions);
    }
    getTotalPrice(productOptions) {
        if(this.state.productOptions && this.state.productOptions.length > 0) {
            let totalOptionPrice =0;
            let shippingFeeOption = [];
            for(let i=0; i < productOptions.length; i++) {
                shippingFeeOption[i] = productOptions[i].deliveryPrice;
                totalOptionPrice = productOptions[i].price * productOptions[i].currentAmount + totalOptionPrice;
            }
            let shippingFee = Math.max(...shippingFeeOption);
            this.setState({
                totalOptionPrice: totalOptionPrice,
                shippingFee: shippingFee
            })
            console.log('shippingFee');
            console.log(shippingFee);
            console.log(this.state.shippingFee);
        } else {
            this.setState({
                totalOptionPrice: 0,
                shippingFee: 0,
                optionId: ''
            })
        }
    }
    render() {
        console.log('this.state.productOptions');
        console.log(this.state.productOptions);
        let getOptionList = this.state.productOptions && this.state.productOptions.length > 0 ? this.state.productOptions.map((item, index) => {
                return(
                    <li key={index}>
                        <div className={stylesDetail.optionHeader}>{item.title}</div>
                        <div className={stylesDetail.optionBody}>
                            <div className={stylesDetail.optionLeft}>
                                <div className={stylesDetail.optionButton}>
                                    <div onClick={() => this.handleAmountOption(index, 0)} className={stylesDetail.minusIcon} />
                                    <input className={stylesDetail.amountOption} type={'text'} value={item.currentAmount} />
                                    <div onClick={() => this.handleAmountOption(index, 1)} className={stylesDetail.plusIcon} />
                                </div>
                            </div>
                            <div className={stylesDetail.optionRight}>
                                <div className={stylesDetail.title}> ₩{NumberUtil.numberWithCommas(item.price)}</div>
                                <div onClick={() => this.handleDelete(index)} className={stylesDetail.deleteIcon} />
                            </div>
                        </div>
                    </li>
                )
            }) : null;
        let typeOption = this.state.product && this.state.product.optionInfo && this.state.product.optionInfo.length > 0 ? this.state.product.optionInfo.map((item, index) => {
            return (
                <option key={index} value={item.optionId} disabled={item.inventoryQuantity > 0 ? false: true} >{item.title} - {item.inventoryQuantity > 0 ? item.inventoryQuantity + "개 남음" : "품절"}</option>
            )
        }) : null;
        let amountOption = [...Array(10)].map((key, index) => {
            return (
                <option key={index} value={index + 1}>{index + 1}개</option>
            )
        });
        let handleBreakLine = this.state.product && this.state.product.descriptionShort ? this.state.product.descriptionShort.split('\n').map((item, index) => {
                return (
                    <div key={index}>{item}<br /></div>
                );
            })
            :
            null;
        return (
            <div className={stylesDetail.marketContainer}>
                <div className={stylesDetail.marketHeader}>
                    {/*mobile version*/}
                    <div className={stylesDetail.mobileScreen + ' ' + stylesDetail.marketMobile}>
                        <div onClick={this.goProfile} className={stylesDetail.fundingNameBox}>
                            <div className={stylesDetail.profile} style={{ backgroundImage: 'url("' + (this.state.product && this.state.product.store && this.state.product.store.profileUrl ? this.state.product.store.profileUrl.replace('original', '80x80') : '/assets/img/img_default_product_detail.png') + '")' }} />
                            <span>{this.state.product && this.state.product.store ? this.state.product.store.name : ''}</span>
                        </div>
                        <div className={stylesDetail.fundingTitleBox}>
                            {this.state.product.title}
                        </div>
                    </div>
                    <div className={stylesDetail.bgImage} style={{ backgroundImage: 'url("' + (this.state.product && this.state.product.imageUrl ? this.state.product.imageUrl.replace('original', '640x470') : '/assets/img/img_default_product_detail.png') + '")' }} />
                    {/*mobile version*/}
                    <ul className={stylesDetail.marketBoxMobile + ' ' + stylesDetail.mobileScreen}>
                        <li className={stylesDetail.marketTitleMobile}>
                            {handleBreakLine}
                            {/*{this.state.product.descriptionShort ? this.state.product.descriptionShort : ''}*/}
                        </li>
                    </ul>
                    {/*full Screen version*/}
                    <div className={stylesDetail.marketBox}>
                        <div onClick={this.goProfile} className={stylesDetail.marketUserBox + ' ' + styles.fullScreen}>
                            <div className={stylesDetail.profile} style={{ backgroundImage: 'url("' + (this.state.product && this.state.product.store && this.state.product.store.profileUrl ? this.state.product.store.profileUrl.replace('original', '80x80') : '') + '")' }} />
                            <div className={stylesDetail.name}>{this.state.product && this.state.product.store ? this.state.product.store.name : ''}</div>
                        </div>
                        <div className={stylesDetail.marketTitleBox + ' ' + styles.fullScreen}>
                            {this.state.product.title}
                        </div>
                        <div className={stylesDetail.marketPrice}>
                            <div className={styles.krwUnit + ' ' + stylesDetail.unit}>₩</div>
                            <div className={stylesDetail.price}>{NumberUtil.numberWithCommas(this.state.optionId ? this.findOptionFieldIndex('optionId', this.state.optionId).price : this.state.productPrice)}</div>
                            {/*<div className={stylesDetail.deliveryPrice + ' ' + styles.fullScreen}>배송비 {NumberUtil.numberWithCommas(this.state.shippingFee)}</div>*/}
                        </div>
                        <div className={stylesDetail.marketSelectBox}>
                            <select value={this.state.optionId} onChange={(e) => this.handleProductOption(e)} className={stylesDetail.marketSelect}>
                                <option value={''} selected={'selected'}>상품선택</option>
                                {typeOption}
                            </select>
                            {/*<select value={this.state.productAmount} onChange={(e) => this.handleAmountOption(e)} className={stylesDetail.marketSelect}>*/}
                                {/*<option value={''} selected={'selected'}>수량선택</option>*/}
                                {/*{amountOption}*/}
                            {/*</select>*/}
                        </div>
                        <ul className={stylesDetail.productOption}>
                            {getOptionList}
                        </ul>
                        <div className={stylesDetail.marketTotal}>
                            <div className={stylesDetail.description}>총 상품금액</div>
                            <div className={stylesDetail.totalBox}>
                                <div className={styles.krwUnit + ' ' + stylesDetail.marketCurrency}>₩</div>
                                <div className={stylesDetail.total}>{NumberUtil.numberWithCommas(this.state.productOptions ? this.state.totalOptionPrice + this.state.shippingFee : 0)}</div>
                            </div>
                        </div>
                        <div className={stylesDetail.deliveryPrice}>배송비 {NumberUtil.numberWithCommas(this.state.shippingFee)}원 별도</div>
                        <div className={stylesDetail.marketBtnBox + ' ' + styles.fullScreen}>
                            <div onClick={this.handleCart} className={styles.btn47White + ' ' + stylesDetail.marketBtn}>장바구니</div>
                            <div onClick={this.handlePayment} className={styles.btn47Black + ' ' + stylesDetail.marketBtn}>구매하기</div>
                            <div onClick={this.handleLike} className={styles.btn47White + ' ' + stylesDetail.marketLikeBtn}>
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
                </div>
                <div className={stylesDetail.detailContentBody}>
                    <DetailContent detailType={'market'} onRef={(ref) => this.detailContent = ref} listItem={this.state.product} />
                </div>
                <div className={styles.fullScreen}>
                    <DetailComments productId={this.state.product ? this.state.product.productId : ''} />
                </div>
                {/*mobile version*/}
                {this.state.showComment ?
                    null
                    :
                    <div className={styles.mobileBtnBox}>
                        <div className={styles.mobileBtn + ' ' + stylesDetail.mobileBtn}>
                            <div className={styles.btnBoxLeft}>
                                <div onClick={this.handleLike}
                                     className={(this.state.product && this.state.product.isLike ? styles.pinkHeartMobile : styles.whiteHeartMobile)}/>
                                <span>{NumberUtil.numberWithCommas(this.state.product ? this.state.product.likeAmount : 0)}</span>
                                <div onClick={this.handleComment} className={styles.commentImage}/>
                                <span>{this.state.commentTotal}</span>
                            </div>
                            <div className={styles.btnBoxRight}>
                                <div onClick={this.handleCart} className={styles.textWhite}>장바구니</div>
                                <div onClick={this.handlePayment} className={styles.textRed}>구매하기</div>
                            </div>
                        </div>
                    </div>
                }
                <div className={stylesDetail.fundingMarketBody + ' ' + stylesDetail.detailRankingMarket}>
                    <div className={stylesDetail.rankHeader}>
                        <div className={styles.sectionSmallTitle}>놓치지 마세요</div>
                        <div className={styles.sectionTitle}>실시간 인기마켓</div>
                    </div>
                    <ProductRanking productType={'market'} isFunding={false} isNormal={true} isVideo={false} productTitle={['판매순', '조회순', '신규']} sortMethod={['raise', 'hit', 'date']} />
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(DetailMarket));