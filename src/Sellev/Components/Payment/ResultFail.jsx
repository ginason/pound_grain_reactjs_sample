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

class PaymentFail extends React.Component {
    constructor(props) {
        super(props);
        this.installApp = this.installApp.bind(this);
        this.AppCheckTimer = this.AppCheckTimer.bind(this);
    }
    componentWillMount() {
        console.log('payment result');
    }
    AppCheckTimer(marketUrl) {
        let clickedAt = new Date();
        setTimeout( function () {
            if(new Date() - clickedAt < 1500)
            {
                location.href = marketUrl;
            }
        }, 500);
    }
    render() {
        return (
            <ul className={stylesPayment.resultContainer}>
                <li className={stylesPayment.title}>결제가 성공적으로 완료되지 않았습니다.</li>
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
})(withRouter(PaymentFail));