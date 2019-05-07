import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import OrdererInfo from './OrdererInfo';
import Destination from './Destination';
import Price from './Price';
import CoinPrice from './CoinPrice';
import PaymentMethod from './PaymentMethod';


// Actions
import * as ActionPayment from '../../Data/Payment/action';
import * as ActionCart from '../../Data/ProductCart/action';
import * as DateUtil from "../../Lib/Utils/date";

// Style
import stylePayment from '../../Styles/Components/Payment.css';
import styles from '../../Styles/App.css';
import * as UtilsNumber from "../../Lib/Utils/parseNumber";
import * as parseUrlParameter from "../../Lib/Utils/parseUrlParameter";
import * as ActionProduct from "../../Data/Product/action";


class PaymentHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cartNormal: [],
            cartNormalCoin: [],
            cartFunding: [],
            cartListMarket: [],
            cartListCoin: [],
            cartListFunding: [],

            type: 0,
            currency: 'KRW',

            deliveryId: null,
            displayTab: 0, // 0 = 펀딩상품 / 1 = 일반상품(마켓) / 2 = 일반상품(마켓)에서 코인결제 /
            isChecked: true,

            marketList: [], //isChecked 포함
            fundingList: [], //isChecked 포함
            coinProductList: [], //isChecked 포함

            invoiceId: 0,
        }

        this.handleCreateInvoice = this.handleCreateInvoice.bind(this);
        this.handleTab = this.handleTab.bind(this);
        this.getCartList = this.getCartList.bind(this);
        this.deleteCartList = this.deleteCartList.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.goDetail = this.goDetail.bind(this);
        this.fundingStatus = this.fundingStatus.bind(this);
    }
    componentWillMount() {
        let urlParams = parseUrlParameter.parse(this.props.location.search);
        setTimeout(() => {
            if(urlParams.displayTab) {
                this.setState({
                    displayTab: Number(urlParams.displayTab),
                })
            } else {
                this.setState({
                    displayTab: 0,
                })
            }
        }, 100)

        this.getCartList();

        // 하이브리드 앱 관련 코드
        if (this.props.isWebview) {
            document.addEventListener("message", (data) => {
                if (JSON.parse(data.data).type === 'payment') {
                    alert('결제 성공!');
                } else {
                    alert('postmessage success!!!!');
                }
            });
        }
    }
    componentDidMount() {
        this.getCartList();
        ActionPayment.getDeliveryDefault()
            .then((response) => {
                // 추후 수정 필요 (배송지 정보 가져옴)
                if (response.code === 200 && response.data.length > 0) {
                    var delivery = response.data[0];
                    this.setState({ deliveryId: delivery.deliveryId });
                    this.destination.setState({ address: delivery.address });
                    this.ordererInfo.setState({
                        name: delivery.name,
                        phoneNumber: delivery.phoneNumber,
                    });
                }
            });
    }
    fundingStatus(option) {
        let today = DateUtil.format('dash', new Date());
        if(option) {
            if(option.endAt < today) {
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }

    }
    getCartList() {
        ActionCart.getCartList()
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        cartListMarket: response.data.carts_market,
                        cartListCoin: response.data.carts_coin,
                        cartListFunding: response.data.carts_funding,
                    }, () => {
                        //펀딩
                        let fundingList = [];
                        let cartListFunding = this.state.cartListFunding;

                        for(let i=0; i < cartListFunding.length; i++) {
                            if(cartListFunding[i].storeInfo && cartListFunding[i].store && this.fundingStatus(cartListFunding[i].typeInfo)) {
                                cartListFunding[i]['isChecked'] = true;
                                fundingList = fundingList.concat(cartListFunding[i]);
                            }
                        }

                        this.setState({
                            fundingList: fundingList,
                        });
                        //상품
                        let marketList =[];
                        let cartListMarket = response.data.carts_market;
                        for(let i=0; i < cartListMarket.length; i++) {
                            if(cartListMarket[i].storeInfo && cartListMarket[i].store) {
                                cartListMarket[i]['isChecked'] = true;
                                marketList = marketList.concat(cartListMarket[i]);
                            }
                        }
                        this.setState({
                            marketList: marketList,
                        })
                        //디지털콘텐츠
                        //상품
                        let coinProductList = [];
                        let cartListCoin = response.data.carts_coin;
                        for(let i=0; i < cartListCoin.length; i++) {
                            if(cartListCoin[i].storeInfo && cartListCoin[i].store) {
                                cartListCoin[i]['isChecked'] = true;
                                coinProductList = coinProductList.concat(cartListCoin[i]);
                            }
                        }
                        this.setState({
                            coinProductList: coinProductList,
                        })
                    });
                }
            })
    }
    deleteCartList(cartId, index) {
        let params = {
            cartId: cartId,
        }
        ActionCart.deleteCartList(params)
            .then((response) => {
                if (response.code === 200) {
                    setTimeout(() => {
                        this.getCartList();
                    }, 100);
                }
            })
    }
    handleCreateInvoice() { // 청구서 및 결제 내역 만들어주는 함수
        // 주문자 정보 validation
        this.ordererInfo.setState({
            warnOrdererNotValid: false,
        });
        if (!this.ordererInfo.state.name || this.ordererInfo.state.name.length < 2 || !this.ordererInfo.state.phoneNumber || this.ordererInfo.state.phoneNumber < 6) {
            this.ordererInfo.setState({ warnOrdererNotValid: true });
        }

        // 배송지 validation
        if (this.destination) {
            this.destination.setState({
                warnDestinationNotValid: false,
            })

            if (!this.destination.state.address) {
                this.destination.setState({ warnDestinationNotValid: true });
            }
        }
        setTimeout(() => {
            if (this.ordererInfo.state.warnOrdererNotValid) {
                return;
            }
            if (this.destination) {
                if (this.destination.state.warnDestinationNotValid) {
                    return;
                }
            }

            let params = {};

            if (this.state.displayTab === 0) {
                // 1. (빌링결제) 펀딩상품 결제
                // currency = krw
                // type = 1
                params = {
                    type: 1,
                    currency: 'krw',
                    paidBy: this.paymentMethod.state.paymentMethod
                }
                params['cartId'] = [];
                params['option'] = [];
                for (let i = 0; i < this.state.fundingList.length; i++) {
                    let fundingOption = this.state.fundingList[i]
                    if(fundingOption.isChecked) {
                        fundingOption.opt['quantity'] = 1;
                        params['option'] = params['option'].concat(fundingOption.opt);
                        params['cartId'] = params['cartId'].concat(fundingOption.cartId);
                    }
                }
                params['deliveryName'] = this.ordererInfo.state.name;
                params['deliveryPhoneNumber'] = this.ordererInfo.state.phoneNumber;
                params['deliveryAddress'] = '';
                params['deliveryNotice'] = '';
            }
            if (this.state.displayTab === 1) {
                // 2. (PG결제) 일반상품(마켓) 결제
                // currency = krw
                // type = 0
                params = {
                    type: 0,
                    currency: 'krw',
                    paidBy: this.paymentMethod.state.paymentMethod
                }
                params['option'] = [];
                params['cartId'] = [];
                for (let i = 0; i < this.state.marketList.length; i++) {
                    let marketOption = this.state.marketList[i];
                    if(marketOption.isChecked) {
                        marketOption.opt['quantity'] = this.state.marketList[i].quantity;
                        params['option'] = params['option'].concat(marketOption.opt);
                        params['cartId'] = params['cartId'].concat(marketOption.cartId);
                    }
                }
                params['deliveryName'] = this.ordererInfo.state.name;
                params['deliveryPhoneNumber'] = this.ordererInfo.state.phoneNumber;
                params['deliveryAddress'] = this.destination.state.address;
                params['deliveryNotice'] = '';
            }
            if (this.state.displayTab === 2) {
                // 3. (코인결제) 일반상품(마켓)에서 코인으로 결제하는 것
                // currency = coin
                // type = 0
                params = {
                    type: 0,
                    currency: 'coin',
                    paidBy: this.paymentMethod.state.paymentMethod
                }
                params['option'] = [];
                params['cartId'] = [];
                for (var i = 0; i < this.state.cartNormalCoin.length; i++) {
                    params['option'] = params['option'].concat(this.state.cartNormalCoin[i].option);
                    params['cartId'] = params['cartId'].concat(this.state.cartNormalCoin[i].cartId);
                }
            }
            let promises = [];
            let paymentFlag = 0;

            promises.push(ActionPayment.createInvoice(params) /// 청구서 생성 (payment/invoice/create)
                .then((response) => {
                    console.log('청구서 생성');
                    if (response.code === 200) {
                        this.setState({
                            invoiceId: response.data.invoice.invoiceId,
                        })
                        paymentFlag = 1;
                        var iamportUrl = '/payment/iamport?paidBy=' + this.paymentMethod.state.paymentMethod +
                            '&invoiceId=' + response.data.invoice.invoiceId +
                            '&price=' + (this.state.displayTab === 0 ? 0 : this.price.state.price + this.price.state.deliveryPrice) +
                            '&title=셀레브::상품구매' +
                            '&name=' + this.ordererInfo.state.name +
                            '&phoneNumber=' +  this.ordererInfo.state.phoneNumber +
                            '&address=' + (this.state.displayTab === 1 ? this.destination.state.address : '')
                         if (this.state.displayTab === 1) {
                            if(this.paymentMethod.state.paymentMethod === 'phone') {
                                iamportUrl += ('&pg=danal');
                            } else {
                                iamportUrl += ('&pg=danal_tpay');
                            }
                        } else if (this.state.displayTab === 0) {
                            iamportUrl += ('&customer_uid=' + response.data.invoice.invoiceId + '&pg=html5_inicis.MOIlocubil');
                        }
                        if (this.props.isWebview) {
                            window.postMessage(JSON.stringify({
                                type: 'pg',
                                url: iamportUrl + '&isWebview=true',
                            }), "*");
                        } else {
                            window.open(iamportUrl, 'popUpWindow','height=600, width=900, resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no, status=no');
                        }
                        // else if (this.state.displayTab === 0) {
                        //     console.log('console.log(response.data.invoice.invoiceId);');
                        //     console.log(response.data.invoice.invoiceId);
                        //     this.paymentMethod.handleFormSubmit(response.data.invoice.invoiceId, this.price.state.deliveryPrice);
                        // }
                    } else {
                        alert('주문이 실패하였습니다. 1');
                    }
                    return Promise.resolve(null);
                })
                .catch((err) => {
                    alert('주문이 실패하였습니다. 2');
                    return Promise.resolve(null);
                }));
            Promise.all(promises).then(() => { /// 계정의 구매 정보에 새로 추가 (payment/delivery/update)
                ActionPayment.updateDelivery({
                    deliveryId: this.state.deliveryId,
                    name: this.ordererInfo.state.name,
                    phoneNumber: this.ordererInfo.state.phoneNumber,
                    address: this.state.displayTab === 1 ? this.destination.state.address: '',
                    isPrimary: true,
                }).then((response) => {
                    if (response.code === 200) {
                        console.log(response);
                    } else {
                        alert('배송지 정보 업데이트에 실패하였습니다.');
                    }
                });
            })
        }, 100);
    }
    handleTab(num) {
        this.setState({
            displayTab: num,
        })
        this.props.history.push('/payment?displayTab=' + num);
    }
    handleCheck(index, type) {
        if(type === 0) {
            let cartList = this.state.marketList.slice();
            cartList[index]['isChecked'] = !cartList[index]['isChecked'];
            this.setState({
                marketList: cartList,
            });
        }else if(type === 1) {
            let cartList = this.state.fundingList.slice();
            cartList[index]['isChecked'] = !cartList[index]['isChecked'];
            this.setState({
                fundingList: cartList,
            });
        }else if (type === 2) {
            let cartList = this.state.coinProductList.slice();
            cartList[index]['isChecked'] = !cartList[index]['isChecked'];
            this.setState({
                coinProductList: cartList,
            });
        }
    }
    goDetail(productId, type) {
        if(type === 0) {
            window.open('/fundingmarket/market' + '?productId=' + productId, '_blank');
        } else {
            window.open('/fundingmarket/funding' + '?productId=' + productId, '_blank');
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextState !== this.state) {
            return true;
        }
        return false;
    }
    render() {
        let renderOptions = (data, index) => {
            return (
                <div key={index} className={stylePayment.optionBox}>
                    <div className={stylePayment.userImage} onClick={() => this.goDetail(data.productId, data.type)} style={{backgroundImage: 'url("'+ (data.imageUrl ? data.imageUrl.replace('original', '80x80'): '/assets/img/bg_hashtag_default.png') +'")'}} />
                    <input className={stylePayment.checkBox} type={'checkbox'} value={index} onChange={() => this.handleCheck(index, data.type)} checked={data.isChecked} />
                    <div className={stylePayment.paymentItem}>
                        <div className={stylePayment.itemHeader}>
                            <div onClick={() => this.goDetail(data.productId, data.type)}>{data.store ? data.store.name : ''}</div>
                            <div onClick={() => this.deleteCartList(data.cartId, index)}>삭제</div>
                        </div>
                        <div className={stylePayment.paymentText} onClick={() => this.goDetail(data.productId, data.type)}>
                            {data.title ? data.title : '이름없음'}
                        </div>
                        <div className={stylePayment.optionText} onClick={() => this.goDetail(data.productId, data.type)}>{
                            '옵션:' + (
                                data.opt && data.opt.title && data.quantity ? data.opt.title + ' / 수량:' + data.quantity : '-'
                            )
                        }</div>
                    </div>
                </div>
            );
        }
        let cartMarket = this.state.marketList && this.state.marketList.length > 0 ? this.state.marketList.map(renderOptions) : null;
        let cartFunding = this.state.fundingList && this.state.fundingList.length > 0 ? this.state.fundingList.map(renderOptions) : null;
        let cartCoin = this.state.coinProductList && this.state.coinProductList.length > 0 ? this.state.coinProductList.map(renderOptions) : null;
        return (
            <div className={stylePayment.paymentContainer} id={'payment'}>
                <div className={stylePayment.paymentHeader}>
                    <div className={styles.redPoint + ' ' + styles.fullScreen + ' ' + stylePayment.dotPosition} />
                    <div className={stylePayment.paymentTitle}>장바구니</div>
                    <div className={stylePayment.detailTab}>
                        <div className={stylePayment.tabItem + (this.state.displayTab === 0 ? ' ' + stylePayment.active : '')} onClick={(index) => this.handleTab(0)}>펀딩</div>
                        <div className={stylePayment.tabItem + (this.state.displayTab === 1 ? ' ' + stylePayment.active : '')} onClick={(index) => this.handleTab(1)}>마켓</div>
                        <div className={stylePayment.tabItem + (this.state.displayTab === 2 ? ' ' + stylePayment.active : '')} onClick={(index) => this.handleTab(2)}>디지털콘텐츠</div>
                    </div>
                    <div className={stylePayment.cartTitle}>구매상품</div>
                    <ul className={stylePayment.paymentBox}>
                        {/*이니시스 인증 후 삭제예정*/}
                        {/*{this.state.displayTab === 0 ?*/}
                            {/*this.state.marketList && this.state.marketList.length > 0 ? <li>{cartMarket}</li> : <li className={stylePayment.noneOptionText}>구매 상품이 없습니다.</li>*/}
                            {/*:*/}
                            {/*null*/}
                        {/*}*/}
                        {/*여기까지*/}
                        {this.state.displayTab === 0 ?
                            this.state.fundingList && this.state.fundingList.length > 0 ? <li>{cartFunding}</li> : <li className={stylePayment.noneOptionText}>구매 상품이 없습니다.</li>
                        :
                            null
                        }
                        {this.state.displayTab === 1 ?
                            this.state.marketList && this.state.marketList.length > 0 ? <li>{cartMarket}</li> : <li className={stylePayment.noneOptionText}>구매 상품이 없습니다.</li>
                            :
                            null
                        }
                        {this.state.displayTab === 2 ?
                                this.state.coinProductList && this.state.coinProductList.length > 0 ? <li>{cartCoin}</li> : <li className={stylePayment.noneOptionText}>구매 상품이 없습니다.</li>
                            :
                            null
                        }
                    </ul>
                </div>
                <div className={stylePayment.paymentBody}>
                    <div className={stylePayment.paymentWhiteBox}>
                        <div className={stylePayment.sectionTitle}>배송지입력</div>
                        <OrdererInfo onRef={(ref) => this.ordererInfo = ref} />
                        <Destination onRef={(ref) => this.destination = ref} />
                        {/*{this.state.displayTab === 1 || this.state.displayTab === 2 ? <Destination onRef={(ref) => this.destination = ref} /> : null}*/}
                        <div style={{width: 1, height: 20}} />
                        {this.state.displayTab === 0 ? <Price onRef={(ref) => this.priceOfFunding = ref} products={this.state.fundingList}/> : null}
                        {this.state.displayTab === 1 ? <Price onRef={(ref) => this.price = ref} products={this.state.marketList}/> : null}
                        {this.state.displayTab === 2 ? <CoinPrice onRef={(ref) => this.coinPrice = ref} products={this.state.coinProductList} /> : null}
                        <div style={{width: 1, height: 20}} />
                        {this.state.displayTab === 0 || this.state.displayTab === 1 ? <PaymentMethod onRef={(ref) => this.paymentMethod = ref} type={this.state.displayTab}/> : null}
                    </div>
                    {this.state.displayTab === 0 ?
                        <div className={stylePayment.btnSection + ' ' + styles.fullScreen}>
                            <div className={stylePayment.btn + ' ' + stylePayment.btnRed} onClick={this.handleCreateInvoice}>결제 예약하기</div>
                        </div>
                        :
                        <div className={stylePayment.btnSection + ' ' + styles.fullScreen}>
                            <div className={stylePayment.btn + ' ' + stylePayment.btnRed} onClick={this.handleCreateInvoice}>결제하기</div>
                        </div>
                    }
                </div>
                {this.state.displayTab === 0 ?
                    <div onClick={this.handleCreateInvoice} className={styles.btn56Mobile}>결제 예약하기</div>
                :
                    <div onClick={this.handleCreateInvoice} className={styles.btn56Mobile}>결제하기</div>
                }

            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(PaymentHome));