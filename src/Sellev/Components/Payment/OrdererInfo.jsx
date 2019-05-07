import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
//Style
import stylePayment from '../../Styles/Components/Payment.css';
import styles from '../../Styles/App.css';
import * as UtilsNumber from "../../Lib/Utils/parseNumber";

class OrdererInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phoneNumber: '',

            warnOrdererNotValid: false,
        }
    }
    componentDidMount() {
        this.setState({
            name: this.props.author.name,
            phoneNumber: this.props.author.phoneNumber,
        })
        this.props.onRef(this);
    }
    render() {
        return (
            <div>
                <div className={stylePayment.formTitle}>주문자 정보</div>
                <div className={styles.formGroup + ' ' + styles.formLargeContainer}>
                    <div className={styles.formRow}>
                        <div className={styles.formInputText}>이름</div>
                        <input className={styles.inputWithoutIcon} type={'text'} value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} placeholder={'이름을 입력하세요'} />
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formInputText}>휴대전화</div>
                        <input className={styles.inputWithoutIcon} type={'text'} value={this.state.phoneNumber} onChange={(e) => this.setState({ phoneNumber: e.target.value })} placeholder={'핸드폰번호를 입력하세요'} />
                    </div>
                    { this.state.warnOrdererNotValid ? <div className={styles.formInputWarn}>주문자 정보를 입력해주세요</div> : null }
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(OrdererInfo));