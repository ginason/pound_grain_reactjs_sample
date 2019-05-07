import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles
import styles from '../../Styles/App.css';
import stylesAuth from '../../Styles/Components/Authentication.css';
import * as ActionAuth from "../../Data/Authentification/actions";


class FindPasswordVerifyBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authTest: true, /*인증 버튼 테스트용 임의로 넣어둠 */
            phoneNumber: '',

            time: {},
            seconds: 180,

            isSmsSended: false,
            isSmsVerified: false,
            smsVerificationCode: '',
            smsVerificationCodeByUser: '',

            warnPhoneNumberNotValid: false,
            warnPhoneNumberNotNumber: false,
            warnPhoneNumber6digitWrong: false, // 6자리 인증번호가 틀립니다
        }

        this.timer = 0;

        this.sendSmsVerificationCode = this.sendSmsVerificationCode.bind(this);
        this.smsVerificationCodeCheck = this.smsVerificationCodeCheck.bind(this);
        this.verifyUser = this.verifyUser.bind(this);
        this.secondsToTime = this.secondsToTime.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.countdown = this.countdown.bind(this);
    }
    // 인증번호 요청
    sendSmsVerificationCode() {
        this.setState({
            warnPhoneNumberNotValid: false,
            warnPhoneNumberNotNumber: false,
            warnPhoneNumberNotVerified: false,
            warnPhoneNumber6digitWrong: false, // 6자리 인증번호가 틀립니다
        })
        if (!this.state.phoneNumber || this.state.phoneNumber.length < 6 || this.state.phoneNumber.length > 20 ) {
            this.setState({ warnPhoneNumberNotValid: true });
            return;
        }

        if (this.state.phoneNumber.length >= 6 && this.state.phoneNumber.length <= 20 && !this.state.phoneNumber.match(/^\d+$/)) {
            this.setState({ warnPhoneNumberNotNumber: true });
            return;
        }

        if (this.state.isSmsSended) {
            return; // 이미 SMS 전송 중임
        }

        this.setState({
            isSmsSended: true,
        });

        let isExist = false;

        setTimeout(() => {
            let promises = [];

            promises.push(ActionAuth.existence({
                countryCode: 82,
                phoneNumber: this.state.phoneNumber,
            }).then((response) => {
                if (response.code === 200 && response.data) {
                    if (response.data.isExist) {
                        isExist = true;
                    }
                    return Promise.resolve(null);
                } else {
                    console.log('데이터를 처리하는 데 문제가 발생했습니다.');
                    return;
                }
            }).catch((err) => {
                    return Promise.resolve(null);
                }));
            setTimeout(() => {
                Promise.all(promises).then(() => {
                    if (isExist) {
                        ActionAuth.postVerificationCode({
                            countryCode: 82,
                            phoneNumber: this.state.phoneNumber,
                            isForced: 1,
                        }).then((response) => {
                            this.setState({
                                isSmsSended: false,
                            }, () => {
                                if (response.code === 200) {
                                    console.log(response);
                                    this.setState({
                                        smsVerificationCode: response.data.verificationCode,
                                        warnPhoneNumberNotValid: false,
                                    });
                                    alert('인증번호가 SMS로 전송되었습니다.');
                                    this.startTimer();
                                } else {
                                    alert('서버에 문제가 발생했습니다.');
                                    return;
                                }
                            })
                        }).catch((err) => {
                            this.setState({isSmsSended: false});
                            if (err) {
                                console.log(err);
                            }
                        });
                    } else {
                        this.setState({
                            isSmsSended: false,
                        });
                        alert('존재하지 않는 핸드폰번호입니다.');
                        return;
                    }
                })
            }, 1000);
        }, 100);
    }
    smsVerificationCodeCheck() {
        if ( this.state.smsVerificationCode.toString() != this.state.smsVerificationCodeByUser.toString()) {
            this.setState({ warnPhoneNumber6digitWrong: true });
            return;
        }
        clearInterval(this.timer);
        this.setState({
            warnPhoneNumber6digitWrong: false,
            smsVerificationCode: '',
            isSmsSended: false,
            isSmsVerified: true,
        });

    }
    secondsToTime(secs){ // 초 단위의 시간을 시 분 초로 변환
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }
    startTimer() {// 타이머를 동작시키는 함수
        clearInterval(this.timer);
        this.setState({
            seconds: 180,
        }, () => {
            this.setState({
                time: this.secondsToTime(this.state.seconds),
            });
            this.timer = setInterval(this.countdown, 1000);
        })
    }
    countdown() {// 카운트다운이 시작되면 시간, 초를 1초마다 세팅해주고 남은 시간이 0일때 타이머를 정지시키는 함수
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });
        if (seconds == 0) {
            clearInterval(this.timer);
            this.setState({
                isSmsSended: false,
                isSmsVerified: false,
                smsVerificationCode: '',
                smsVerificationCodeByUser: '',
                warnPhoneNumber6digitWrong: false, // 6자리 인증번호가 틀립니다
            })
        }
    }
    verifyUser() {
        this.setState({
            warnPhoneNumberNotValid: false,
            warnPhoneNumber6digitWrong: false, // 6자리 인증번호가 틀립니다
        });
        // 휴대폰 인증완료되었는가?
        if (!this.state.phoneNumber || this.state.phoneNumber.length < 5 || this.state.phoneNumber.length > 20) {
            this.setState({ warnPhoneNumberNotValid: true });
        }
        if (!this.state.isSmsVerified) {
            this.setState({ warnPhoneNumber6digitWrong: true });
        }
        setTimeout(() => {
            if (this.state.warnPhoneNumberNotValid
                || this.state.warnPhoneNumber6digitWrong
            ) {
                return;
            }

            this.props.onVerified(true);
            this.props.getPhoneNumber(this.state.phoneNumber);
        }, 100);
    }
    render() {
        return (
            <div className={stylesAuth.authBody + ' ' + stylesAuth.password}>
                <div className={stylesAuth.authLogo} />
                <div className={stylesAuth.authLogoMobile} />
                <div className={stylesAuth.authBox}>
                    <div className={stylesAuth.authTitle + ' ' + stylesAuth.findPasswordTitle}>비밀번호를 잊으셨나요?</div>
                    <div className={styles.formGroup}>
                        { this.state.isSmsVerified ? (
                            <div className={styles.formRow}>
                                <div className={styles.formInputName}>핸드폰번호</div>
                                <input className={styles.formInput + ' ' + styles.inputWithVerify} type={'text'} value={this.state.phoneNumber} disabled />
                                <div className={styles.inputVerifyBox}>인증완료</div>
                            </div>
                        ) : (
                            <div>
                                <div className={styles.formRow + ' ' + styles.bottomLine}>
                                    <div className={styles.formInputName}>핸드폰번호</div>
                                    { this.state.smsVerificationCode.length > 0
                                        ? <input className={styles.formInput + ' ' + styles.inputWithVerify} type={'text'} value={this.state.phoneNumber} disabled />
                                        : <input className={styles.formInput + ' ' + styles.inputWithVerify} type={'text'} placeholder={'핸드폰번호를 입력해주세요.'} value={this.state.phoneNumber} onChange={(e) => this.setState({ phoneNumber: e.target.value })} />
                                    }
                                    {/*인증버튼 활성화 .formRow .inputVerifyBox.black */}
                                    <div className={styles.inputVerifyBox + ' ' + (this.state.authTest ? styles.activeBlack : styles.disabled)} onClick={this.sendSmsVerificationCode}>인증</div>
                                </div>
                                { this.state.warnPhoneNumberNotValid ? <div className={styles.formInputWarn}>핸드폰번호를 입력해주세요</div> : null }
                                { this.state.warnPhoneNumberNotNumber ? <div className={styles.formInputWarn}>핸드폰번호는 숫자만 입력 가능합니다</div> : null }
                                { this.state.warnPhoneNumberNotExist ? <div className={styles.formInputWarn}>가입 안된 핸드폰번호입니다.</div> : null }
                            </div>
                        ) }
                        <div className={styles.formRow + ( this.state.smsVerificationCode.length > 0 ? '' : ' ' + styles.disabled )}>
                            <div className={styles.formInputName}>인증번호</div>
                            <input className={styles.formInput + ' ' + styles.inputWithVerify} type={'text'} autoComplete={'off'} placeholder={this.state.smsVerificationCode.length > 0 ? '' : '위의 인증버튼 선택 후 인증번호를 입력해주세요.' } value={this.state.smsVerificationCodeByUser} onChange={(e) => this.setState({ smsVerificationCodeByUser: e.target.value })} disabled={ this.state.smsVerificationCode.length <= 0 }/>
                            { this.state.smsVerificationCode.length > 0 ? <div className={styles.inputVerifyBox + ' ' + styles.activeWhite} onClick={this.smsVerificationCodeCheck}>인증하기</div> : null }
                        </div>
                        { this.state.warnPhoneNumber6digitWrong ? <div className={styles.formInputWarn}>인증번호가 틀립니다.</div> : null }
                        { this.state.smsVerificationCode.length > 0 ? (
                            <div className={styles.formInputAlert}>인증시간이 <span className={styles.red}>{(this.state.time && this.state.time.m ? this.state.time.m.toString().padStart(2, '0') : '00') + ':' + (this.state.time && this.state.time.s ? this.state.time.s.toString().padStart(2, '0') : '00')}</span> 남았습니다</div>
                        ) : null }
                    </div>
                    <div>
                        <div className={stylesAuth.authBtn + ' ' + stylesAuth.loginBtn} onClick={this.verifyUser}>다음</div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(FindPasswordVerifyBody));