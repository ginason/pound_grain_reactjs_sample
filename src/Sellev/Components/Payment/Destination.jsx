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
import styles from '../../Styles/App.css';
import * as UtilsNumber from "../../Lib/Utils/parseNumber";

class Destination extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postalCode: '',
            address: '',

            warnDestinationNotValid: false,
        }
        this.searchAddress = this.searchAddress.bind(this);
    }
    componentDidMount() {
        this.props.onRef(this);

        // 하이브리드 앱 관련 코드
        document.addEventListener("message", (data) => {
            if (JSON.parse(data.data).type === 'address') {
                this.setState({
                    postalCode: JSON.parse(data.data).postalCode,
                    address: JSON.parse(data.data).address
                });
                alert('주소를 잘 받아왔습니다.');
            }
        });
    }
    searchAddress() {
        if (this.props.isWebview) {
            window.postMessage(JSON.stringify({
                type: 'address',
            }), "*");
        } else {
            window.open('/popup/jusoPopup', 'pop', 'width=570,height=420, scrollbars=yes, resizable=yes');
            window.jusoCallBack = (juso) => {
                this.setState({
                    address: juso.roadFullAddr,
                    postalCode: juso.zipNo,
                });
            };
        }
    }
    render() {
        return (
            <div>
                <div className={stylePayment.formTitle}>배송지</div>
                <div className={styles.formGroup + ' ' + styles.formLargeContainer}>
                    <div className={styles.formRow}>
                        <div className={styles.formInputText}>우편번호</div>
                        <input className={styles.formInput + ' ' + styles.inputWithIcon + ' ' + styles.addressDisabled} type={'text'} value={this.state.postalCode} placeholder={'우편번호 검색하기'} disabled />
                        <div className={styles.searchBox}>
                            <div className={styles.addressIcon} onClick={this.searchAddress} />
                        </div>
                    </div>
                    <div className={styles.formRow}>
                        <div className={styles.formInputText}>기본주소</div>
                        <input className={styles.inputWithoutIcon + ' ' + stylePayment.addressInput} type={'text'} autoComplete={'off'} readOnly={true} value={this.state.address} onChange={(e) => this.setState({ address: e.target.value })} />
                    </div>
                    {/*<div className={styles.formRow}>
                        <div className={styles.formInputText}>상세주소</div>
                        <input className={styles.inputWithoutIcon} type={'text'} autoComplete={'off'} readOnly={true} value={this.state.addressDetail} onChange={(e) => this.setState({ addressDetail: e.target.value })} />
                    </div>*/}
                    { this.state.warnDestinationNotValid ? <div className={styles.formInputWarn}>배송지를 등록해주세요</div> : null }
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
})(withRouter(Destination));