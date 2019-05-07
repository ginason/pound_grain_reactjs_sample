import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import UserBox from '../../Common/UserBox';

// Styles
import styleUser from '../../Styles/Components/UserMenu.css';
import styles from '../../Styles/App.css';

// Utils
import * as UtilsNumber from '../../Lib/Utils/parseNumber';

// Action
import * as ActionPayment from '../../Data/Payment/action';

class BuyCoin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectCoin: 10,
            selectPayOption: 'card',
            isAgreeTerms: false,

            warnAgreeTerms: false,
        }
        this.selectCoin = this.selectCoin.bind(this);
        this.selectPayOption = this.selectPayOption.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
    }
    componentWillMount() {

        // 하이브리드 앱 관련 코드
        document.addEventListener("message", (data) => {
            if (JSON.parse(data.data).type === 'payment') {
                alert('결제 성공!');
            }
        });
    }
    selectCoin(num) {
        console.log(num);
        this.setState({
            selectCoin: num,
        })
    }
    /*
    * @params {Object} num   선택한 결제수단 번호 (1: 카드, 2: 모바일 등등)
    */
    selectPayOption(option) {
        this.setState({
            selectPayOption: option,
        })
    }
    handlePayment() {
        this.setState({
            warnAgreeTerms: false,
        });

        if (!this.state.isAgreeTerms) {
            this.setState({ warnAgreeTerms: true });
        }

        setTimeout(() => {
            if (this.state.warnAgreeTerms) {
                return;
            }

            setTimeout(() => {
                let params = {
                    currency: 'krw',
                    coin: this.state.selectCoin,
                    paidBy: this.state.selectPayOption
                }

                /////////////// API가 안나와서 일단 주석처리 ////////////////
                ActionPayment.createInvoice(params)
                    .then((response) => {
                        /////////////// API가 안나와서 일단 주석처리 ////////////////
                        if (response.code === 200) {
                            var iamportUrl = '/payment/iamport?paidBy=' + this.state.selectPayOption +
                                '&invoiceId=' + response.data.invoice.invoiceId +
                                '&price=' + response.data.invoice.price +
                                '&title=셀레브::코인' + params.coin + '개' +
                                '&name=' + this.props.author.user.name +
                                '&phoneNumber=' +  this.props.author.user.phoneNumber;
                            if (this.props.isWebview) {
                                window.postMessage(JSON.stringify({
                                    type: 'pg',
                                    url: iamportUrl,
                                }), "*");
                                alert('webview pg');
                            } else {
                                window.open(iamportUrl, 'popUpWindow','height=600, width=900, resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no, status=no');
                                alert('web pg');
                            }
                        } else {
                            alert('코인구매가 실패하였습니다.');
                        }
                    })
            }, 100);
        }, 100);
    }
    render() {
        let renderCoinProduct = Object.keys(ActionPayment.coinPrice).map((item, index) => {
            return (
                <li key={index} onClick={() => this.selectCoin(item)}>
                    <div className={(Number(this.state.selectCoin) === Number(item) ? styles.checkIcon : styles.noneCheckIcon) + ' ' + styleUser.checkOption} />
                    <div className={styleUser.coinOption}>
                        <div>{UtilsNumber.numberWithCommas(ActionPayment.coinPrice[item].quantity)}</div>
                        <div className={styles.coinUnit} />
                    </div>
                    <div className={styleUser.coinPrice}>{UtilsNumber.numberWithCommas(ActionPayment.coinPrice[item].price)}원</div>
                </li>
            )
        });
        return (
            <div className={styleUser.userMenuContainer}>
                <div className={styleUser.userMenuHeader + ' ' + styleUser.userMenuLeft}>
                    <div className={styles.redPoint + ' ' + styles.fullScreen} />
                    <div className={styleUser.menuTitle}>코인충전</div>
                    <div className={styles.mobileScreen + ' ' + styleUser.font16Mobile}>보유현황</div>
                    <ul className={styleUser.userMenuBox + ' ' + styleUser.userInfoBoxMobile}>
                        <li className={styles.fullScreen}>
                            <UserBox profile={'/assets/img/img_set_cover.png'} size={'42px'} />
                            <div>보유현황</div>
                        </li>
                        <li className={styleUser.userInfoMobile}>
                            <span className={styleUser.font20Mobile}>코인</span><br />
                            <div className={styleUser.font45Mobile}>{UtilsNumber.numberWithCommas(this.props.author && this.props.author.user ? this.props.author.user.coin : 0)}</div>
                            <div className={styles.coinUnit + ' ' + styleUser.coinIcon} />
                        </li>
                        <li className={styleUser.userInfoMobile}>
                            <span className={styleUser.font20Mobile}>포인트</span><br />
                            <div className={styleUser.font45Mobile}>{UtilsNumber.numberWithCommas(this.props.author && this.props.author.user ? this.props.author.user.mileage : 0)}</div>
                            <div className={styles.pointUnit + ' ' + styleUser.coinIcon} />
                        </li>
                    </ul>
                </div>
                <div className={styleUser.userMenuBody + ' ' + styleUser.userMenuRight}>
                    <div className={styleUser.buyCoinBox}>
                        <div className={styleUser.buyCoinHeader}>코인상품 선택</div>
                        <ul className={styleUser.buyCoinBody}>
                            {renderCoinProduct}
                        </ul>
                    </div>
                    <div className={styleUser.buyCoinBox}>
                        <div className={styleUser.buyCoinHeader}>
                            결제수단 선택<br />
                            <div className={styles.fullScreen}>휴대폰 결제관련문의는 각 통신사 고객센터로 연락하시기 바랍니다. 법정대리인의 동의 없는 미성년자의 결제는 취소될 수 있습니다. </div>
                        </div>
                        <ul className={styleUser.payOptionBody}>
                            <li onClick={(index) => this.selectPayOption('card')}>
                                <div className={(this.state.selectPayOption === 'card' ? styles.checkIcon : styles.noneCheckIcon) + ' ' + styleUser.checkOption} />
                                <div className={styles.cardIcon + ' ' + styleUser.payOptionIcon} />
                                <div className={styleUser.payTitle}>신용카드</div>
                            </li>
                            <li onClick={(index) => this.selectPayOption('phone')}>
                                <div className={(this.state.selectPayOption === 'phone' ? styles.checkIcon : styles.noneCheckIcon) + ' ' + styleUser.checkOption} />
                                <div className={styles.phoneIcon + ' ' + styleUser.payOptionIcon} />
                                <div className={styleUser.payTitle}>휴대폰 결제</div>
                            </li>
                        </ul>
                    </div>
                    <div className={styles.mobileScreen + ' ' + styleUser.font13Mobile}>
                        휴대폰 결제관련문의는 각 통신사 고객센터로 연락하시기 바랍니다. 법정대리인의 동의 없는 미성년자의 결제는 취소될 수 있습니다.
                    </div>
                    <div className={styleUser.checkBoxForm}>
                        <input id={'ckeckboxAssociated'} className={styleUser.signupCheckbox} type={'checkbox'} value={this.state.isAgreeTerms} onChange={(e) => this.setState({ isAgreeTerms: e.target.checked })} />
                        <label htmlFor={'ckeckboxAssociated'} className={styleUser.ckeckboxBlackIcon} />
                        <div className={styleUser.checkboxLabel}>위 사항을 모두 확인하였으며 구매진행에 동의합니다.</div>
                        { this.state.warnAgreeTerms ? <div className={styleUser.formInputWarn}>구매진행에 동의해주세요</div> : null }
                    </div>
                    <div onClick={this.handlePayment} className={styles.fullScreen}>
                        <div className={styles.btn44Red + ' ' + styleUser.btnBuyCoin}>결제요청</div>
                    </div>
                    <div onClick={this.handlePayment} className={styleUser.btnBoxMobile}>
                        <div className={styleUser.btnPay}>결제요청</div>
                        <div className={styleUser.btnCancel}>취소</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(BuyCoin));