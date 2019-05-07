import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles
import stylesPayment from '../../Styles/Components/Payment.css';

class PaymentSuccess extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        console.log('payment result');
    }
    render() {
        return (
            <ul className={stylesPayment.resultContainer}>
                <li className={stylesPayment.title}>결제가 완료되었습니다.</li>
                <li className={stylesPayment.subTitle}>구매내역에서 확인하실수 있습니다.</li>
                <li className={stylesPayment.subTitle + ' ' + stylesPayment.button} onClick={this.installApp}>앱으로 이동하기</li>
            </ul>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(PaymentSuccess));