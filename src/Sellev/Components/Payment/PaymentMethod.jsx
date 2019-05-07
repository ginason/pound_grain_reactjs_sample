import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


// Components

// Actions
import * as ActionPayment from '../../Data/Payment/action';

//Style
import stylePayment from '../../Styles/Components/Payment.css';

import * as UtilsNumber from "../../Lib/Utils/parseNumber";

import axios from "axios/index";

class PaymentMethod extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentMethod: 'card',
            cardNumber: "",
            cardNumber1: "",
            cardNumber2: "",
            cardNumber3: "",
            cardNumber4: "",
            expiry: "",
            expiry1: "",
            expiry2: "",
            birth: "",
            pwd2Digit: "",
            customer_uid: ""
        }
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    componentDidMount() {
        this.props.onRef(this);
    }

    handleInputChange(event) {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleFormSubmit(customerUid, price) {
        console.log('handleFormSubmit');
        console.log('handleFormSubmit');
        console.log(customerUid);
        // event.preventDefault();
        const { cardNumber, cardNumber1, cardNumber2, cardNumber3, cardNumber4, expiry, expiry1, expiry2, birth, pwd2Digit, customer_uid } = this.state;
        this.setState({
            customer_uid: customerUid,
            cardNumber: cardNumber1 + cardNumber2 + cardNumber3 + cardNumber4,
            expiry: expiry1 + expiry2,
        })
        let iamportUrl = '/payment/iamport?customer_uid=' + customerUid +
            '&cardNumber=' + cardNumber + '&expiry=' + expiry + '&pwd2Digit=' +
            pwd2Digit + '&customer_uid=' + customer_uid;

        setTimeout(() => {
            console.log('axios');
            console.log('axios');
            console.log(customerUid);
            // window.open(iamportUrl, 'popUpWindow','height=600, width=900, resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no, status=no');
            axios({
                url: "https://api.iamport.kr/subscribe/payments/onetime",
                method: "post",
                data: {
                    card_number: cardNumber,
                    expiry: expiry,
                    birth: birth,
                    pwd_2digit: pwd2Digit,
                    customer_uid: customerUid,
                    merchant_uid: customerUid,
                    amount: price,
                }
            }).then((rsp) => {
                if (rsp.success) {
                    alert('결제성공');
                    // window.location.href = "/payment/success";
                } else {
                    alert('결제실패');
                    // window.location.href = "/payment/fail";
                    // window.close('/payment/iamport' + window.location.search);
                }
            })
        }, 100);
    }

    render() {
        let paymentOption = ActionPayment.MARKET_PAYMENT_METHOD_ARRAY;
        if (this.props.type === 0) {
            paymentOption = ActionPayment.FUNDING_PAYMENT_METHOD_ARRAY;
        }
        let paymentOptionArray = paymentOption.map((item, index) => {
            return <option key={index} value={item.type}>{item.label}</option>
        });
        return (
            <div>
                <div className={stylePayment.sectionTitle}>결제수단</div>
                <select value={this.state.paymentMethod} onChange={(e) => this.setState({paymentMethod: e.target.value})} className={stylePayment.paymentSelector}>
                    {paymentOptionArray}
                </select>
                {
                    this.props.type === 2 ?
                        <div className={stylePayment.notification}>
                            결제실행일에 결제자 귀책사유(카드재발급, 한도초과, 이용정지 등)로 인하여 결제가 실패할 수 있으니,
                            결제수단이 유효한지 다시한번 확인하세요.
                        </div>
                    :
                    null
                }
                {/*<div className={stylePayment.paymentFormBox}>*/}
                    {/*<div className={stylePayment.sectionTitle}>결제 정보 입력</div>*/}
                    {/*<div className={stylePayment.formList1}>*/}
                        {/*<div className={stylePayment.formBox}>*/}
                            {/*<div className={stylePayment.title}>신용(체크)카드번호</div>*/}
                            {/*<div className={stylePayment.itemBox}>*/}
                                {/*<input className={stylePayment.numberInput} type={'text'} name={'cardNumber1'} value={this.state.cardNumber1} onChange={(e) => this.handleInputChange(e)} />*/}
                                {/*<div className={stylePayment.bar}> - </div>*/}
                                {/*<input className={stylePayment.numberInput} type={'text'} name={'cardNumber2'} value={this.state.cardNumber2} onChange={(e) => this.handleInputChange(e)} />*/}
                                {/*<div className={stylePayment.bar}> - </div>*/}
                                {/*<input className={stylePayment.numberInput} type={'text'} name={'cardNumber3'} value={this.state.cardNumber3} onChange={(e) => this.handleInputChange(e)} />*/}
                                {/*<div className={stylePayment.bar}> - </div>*/}
                                {/*<input className={stylePayment.numberInput} type={'text'} name={'cardNumber4'} value={this.state.cardNumber4} onChange={(e) => this.handleInputChange(e)} />*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className={stylePayment.formBox}>*/}
                            {/*<div className={stylePayment.title}>유효기간</div>*/}
                            {/*<div className={stylePayment.itemBox}>*/}
                                {/*<div className={stylePayment.date}>*/}
                                    {/*<div>월</div>*/}
                                    {/*<input className={stylePayment.dateInput} type={'text'} name={'expiry1'} value={this.state.expiry1} onChange={(e) => this.handleInputChange(e)} />*/}
                                {/*</div>*/}
                                {/*<div className={stylePayment.date}>*/}
                                    {/*<div>년</div>*/}
                                    {/*<input className={stylePayment.dateInput} type={'text'} name={'expiry2'} value={this.state.expiry2} onChange={(e) => this.handleInputChange(e)} />*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className={stylePayment.formList2}>*/}
                        {/*<div className={stylePayment.formBox}>*/}
                            {/*<div className={stylePayment.title}>비밀번호 앞 2자리</div>*/}
                            {/*<div className={stylePayment.itemBox}>*/}
                                {/*<input className={stylePayment.passwordInput} type={'password'} name={'pwd2Digit'} value={this.state.pwd2Digit} onChange={(e) => this.handleInputChange(e)} />*/}
                            {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className={stylePayment.formBox}>*/}
                            {/*<div className={stylePayment.title}>생년월일(주민등록번호 앞 6자리)</div>*/}
                            {/*<div className={stylePayment.itemBox}>*/}
                                {/*<input className={stylePayment.birthOfDateInput} type={'text'} name={'birth'} value={this.state.birth} onChange={(e) => this.handleInputChange(e)} />*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                    {/*<div className={stylePayment.formNotification}>*법인카드의 경우 사업자등록번호 10자리 입력</div>*/}
                {/*</div>*/}
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(PaymentMethod));