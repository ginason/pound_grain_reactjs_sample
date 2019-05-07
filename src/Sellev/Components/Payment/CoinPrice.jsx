import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Style
import stylePayment from '../../Styles/Components/Payment.css';
import styles from '../../Styles/App.css';
import * as UtilsNumber from "../../Lib/Utils/parseNumber";

// Utils
import * as parseNumber from '../../Lib/Utils/parseNumber';

class PaymentHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0,
        }

        this.findOptionFieldIndex = this.findOptionFieldIndex.bind(this);
    }
    componentWillMount() {
        if (this.props.location.state && this.props.location.state.paymentItem) {
            this.setState({
                paymentItem: this.props.location.state.paymentItem,
            })
            setTimeout(() => {
                this.setState({
                    price: this.getPriceSum('price'),
                })
            }, 100);
        }
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    findOptionFieldIndex(field, value) {
        if (this.state.paymentItem && this.state.paymentItem.product && this.state.paymentItem.product.optionInfo) {
            for (let i=0; i<this.state.paymentItem.product.optionInfo.length; i++) {
                if (this.state.paymentItem.product.optionInfo[i][field] === value) {
                    return i;
                }
            }
        }
    }
    getPriceSum(field) {
        let paymentItem = this.state.paymentItem;
        if (paymentItem && paymentItem.product && paymentItem.option && paymentItem.product.optionInfo) {
            let sum = 0;
            for (let i=0; i<paymentItem.option.length; i++) {
                sum = sum + (Number(paymentItem.product.optionInfo[this.findOptionFieldIndex('optionId', paymentItem.option[i].optionId)][field]) * Number(paymentItem.option[i].quantity))
            }
            return sum;
        }
    }
    render() {
        return (
            <div>
                <div className={stylePayment.sectionTitle}>최종결제금액</div>
                <ul className={stylePayment.paymentList}>
                    <li>
                        <div>총 상품가격</div>
                        <div className={stylePayment.priceVal}>
                            <div className={stylePayment.price}>{parseNumber.numberWithCommas(this.state.price)}</div>
                            <div className={styles.coinUnit + ' ' + stylePayment.coinIcon} />
                        </div>
                    </li>
                    <li>
                        <div>총 결제금액</div>
                        <div className={stylePayment.priceVal}>
                            <div className={stylePayment.price}>{parseNumber.numberWithCommas(this.state.price)}</div>
                            <div className={styles.coinUnit + ' ' + stylePayment.coinIcon} />
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(PaymentHome));