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

class Price extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 0,
            deliveryPrice: 0,
            totalPrice: 0,
        };
        this.productObj = {};
        this.findOptionFieldIndex = this.findOptionFieldIndex.bind(this);
        this.handleTotalPrice = this.handleTotalPrice.bind(this);
    }
    componentWillMount() {
        console.log('price componentWillMount');
        if(this.props.products && this.props.products.length > 0) {
            for(let i =0; i < this.props.products.length; i++) {
                let product = this.props.products[i];
                if(product.isChecked) {
                    if (!this.productObj[product.productId]) {
                        this.productObj[product.productId] = {
                            price: product.opt.price * product.quantity,
                            deliveryPrice: product.opt.deliveryPrice,
                        }
                    } else {
                        this.productObj[product.productId].price += (product.opt.price * product.quantity);
                        if (this.productObj[product.productId].deliveryPrice < product.opt.deliveryPrice) {
                            this.productObj[product.productId].deliveryPrice = product.opt.deliveryPrice;
                        }
                    }
                }
            }
            let price = 0;
            let deliveryPrice = 0;
            for (let productId in this.productObj) {
                price += this.productObj[productId].price;
                deliveryPrice += this.productObj[productId].deliveryPrice;
                console.log(this.productObj[productId]);
            }
            this.setState({
                price: price,
                deliveryPrice: deliveryPrice,
                totalPrice: price + deliveryPrice,
            });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        console.log('price shouldComponentUpdate');
        this.productObj = {};
        if (nextProps.products !== this.props.products) {
            if(nextProps.products && nextProps.products.length > 0) {
                for(let i =0; i < nextProps.products.length; i++) {
                    let product = nextProps.products[i];
                    if(product.isChecked) {
                        if (!this.productObj[product.productId]) {
                            this.productObj[product.productId] = {
                                price: product.opt.price * product.quantity,
                                deliveryPrice: product.opt.deliveryPrice,
                            }
                        } else {
                            this.productObj[product.productId].price += (product.opt.price * product.quantity);
                            if (this.productObj[product.productId].deliveryPrice < product.opt.deliveryPrice) {
                                this.productObj[product.productId].deliveryPrice = product.opt.deliveryPrice;
                            }
                        }
                    }
                }
                let price = 0;
                let deliveryPrice = 0;
                for (let productId in this.productObj) {
                    price += this.productObj[productId].price;
                    deliveryPrice += this.productObj[productId].deliveryPrice;
                    console.log(this.productObj[productId]);
                }
                this.setState({
                    price: price,
                    deliveryPrice: deliveryPrice,
                    totalPrice: price + deliveryPrice,
                });
            } else {
                this.setState({
                    price: 0,
                    deliveryPrice: 0,
                    totalPrice: 0,
                });
            }
            return true;
        }
        if (nextState !== this.state) {
            return true;
        }
        return false;
    }
    componentDidMount() {
        this.props.onRef(this);

        // let price = 0;
        // let deliveryPrice = 0;
        // for (let productId in this.productObj) {
        //     price += this.productObj[productId].price;
        //     deliveryPrice += this.productObj[productId].deliveryPrice;
        //     console.log(this.productObj[productId]);
        // }
        // this.setState({
        //     price: price,
        //     deliveryPrice: deliveryPrice,
        //     totalPrice: price + deliveryPrice,
        // });
    }

    handleTotalPrice() {
        this.props.onRef(this);

        let price = 0;
        let deliveryPrice = 0;
        for (let productId in this.productObj) {
            price += this.productObj[productId].price;
            deliveryPrice += this.productObj[productId].deliveryPrice;
            console.log(this.productObj[productId]);
        }
        this.setState({
            price: price,
            deliveryPrice: deliveryPrice,
            totalPrice: price + deliveryPrice,
        });
    }
    findOptionFieldIndex(list, field, value) {
        for (let i=0; i<list.length; i++) {
            if (list[i][field] === value) {
                return i;
            }
        }
    }
    render() {
        return (
            <div>
                <div className={stylePayment.sectionTitle}>최종결제금액</div>
                <ul className={stylePayment.paymentList}>
                    <li>
                        <div>총 상품가격</div>
                        <div>{parseNumber.numberWithCommas(this.state.price)}</div>
                    </li>
                    <li>
                        <div>배송비</div>
                        <div>{parseNumber.numberWithCommas(this.state.deliveryPrice)}</div>
                    </li>
                    <li>
                        <div>총 결제금액</div>
                        <div>{parseNumber.numberWithCommas(this.state.totalPrice)}</div>
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
})(withRouter(Price));