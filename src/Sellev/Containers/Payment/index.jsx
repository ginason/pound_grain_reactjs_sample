import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

//Component
import PaymentHome from '../../Components/Payment/index';
import PaymentSuccess from '../../Components/Payment/ResultSuccess';
import PaymentFail from '../../Components/Payment/ResultFail';

//Styles
import stylePayment from '../../Styles/Components/Payment.css';

class PaymentView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stoken: '',
        }
    }
    render() {
        return (
            <div className={stylePayment.entirePaymentContainer}>
                <Route path={'/payment'} exact={true} strict={false} component={PaymentHome} />
                <Route path={'/payment/success'} exact={true} strict={false} component={PaymentSuccess} />
                <Route path={'/payment/fail'} exact={true} strict={false} component={PaymentFail} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(PaymentView));