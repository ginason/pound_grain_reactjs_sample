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

// Actions
import * as ActionAuth from '../../Data/Authentification/actions';

// Utils
import * as parseUrlParameter from '../../Lib/Utils/parseUrlParameter';

class SignupBody extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            authTest: true, /* 핸드폰 번호 인증 버튼 테스트*/
            phoneNumber: '',
            password: '',
            passwordRe: '',
            name: '',
            profileUrl: '',
            coverUrl: '',
            stype: '',
            stoken: '',

            isExist: false,
            isSmsSended: false,
            isSmsVerified: false,
            smsVerificationCode: '',
            smsVerificationCodeByUser: '',

            facebookChecked: false,

            time: {},
            seconds: 180,
            isAgreeTerms: false,

            warnPhoneNumberNotValid: false,
            warnPhoneNumberNotNumber: false,
            warnPhoneNumberAlreadyExist: false,
            warnPhoneNumber6digitWrong: false, // 6자리 인증번호가 틀립니다
            warnPasswordNotValid: false,
            warnPasswordRetype: false,
            warnAgreeTerms: false, // 약관 동의해라
            warnNameNotValid: false,//이름을 입력해라
        }
        this.timer = 0;

        this.initializeFacebook = this.initializeFacebook.bind(this);
        this.getFacebookAccountInfo = this.getFacebookAccountInfo.bind(this);
        this.checkFacebookLoginState = this.checkFacebookLoginState.bind(this);
        this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
        this.handleKakaoLogin = this.handleKakaoLogin.bind(this);
        this.statusChangeCallback = this.statusChangeCallback.bind(this);

        this.sendSmsVerificationCode = this.sendSmsVerificationCode.bind(this);
        this.smsVerificationCodeCheck = this.smsVerificationCodeCheck.bind(this);
        this.secondsToTime = this.secondsToTime.bind(this);
        this.startTimer = this.startTimer.bind(this);
        this.countdown = this.countdown.bind(this);
        this.signup = this.signup.bind(this);

        this.handleStoken = this.handleStoken.bind(this);
    }
    componentWillMount() {
        let urlParams = parseUrlParameter.parse(this.props.location.search);

        if (urlParams.stype) {
            this.setState({
                stype: urlParams.stype,
            })
        }
    }
    componentDidMount() {
        if (this.state.stype === 'F') {
            this.initializeFacebook();
        }
    }
    initializeFacebook() {
        window.fbAsyncInit = function() {
            FB.init({
                appId      : '1106303509501814',
                cookie     : true,
                xfbml      : true,
                version    : 'v2.8'
            });
            FB.AppEvents.logPageView();
            FB.Event.subscribe('auth.statusChange', function(response) {
                if (response.authResponse) {
                    if (!this.state.facebookChecked) {
                        this.checkFacebookLoginState();
                        this.setState({
                            facebookChecked: true,
                        })
                    }
                } else {
                    console.log('---->User cancelled login or did not fully authorize.');
                }
            }.bind(this));
        }.bind(this);

        // Load the SDK asynchronously
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = '//connect.facebook.net/en_US/sdk.js';
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
    getFacebookAccountInfo(setState) {
        let name;
        let that = this;
        window.FB.api('/me', 'get', { fields: 'id, name, gender'}, (response) => {
        });
    }
    statusChangeCallback(response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            this.setState({
                stoken: response.authResponse.accessToken,
            })
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
            console.log('The person is logged into Facebook, but not your app.');
        } else {
            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
            console.log('please login in with Facebook');
        }
    }
    checkFacebookLoginState() {
        FB.getLoginStatus((response) => {
            this.statusChangeCallback(response);
            this.getFacebookAccountInfo();
        });
    }
    handleFacebookLogin() {
        FB.login(this.checkFacebookLoginState());
    }
    handleKakaoLogin() {
        let currentApp = this;
        Kakao.Auth.login({
            success: function(authObj) {
                console.log(authObj);
                console.log(currentApp);
                currentApp.setState({ stoken: authObj.access_token });
            },
            fail: function(err) {
                alert(JSON.stringify(err));
            }
        });
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
            warnPhoneNumberAlreadyExist: false,
            seconds: 180,
        });

        ActionAuth.postVerificationCode({
            countryCode: 82,
            phoneNumber: this.state.phoneNumber,
            isForced: false,
        }).then((response) => {
            console.log(response);
            console.log("postVerificationCode");
            this.setState({
                isSmsSended: false,
            });
            if (response.code === 200) {
                this.setState({
                    smsVerificationCode: response.data.verificationCode,
                    warnPhoneNumberNotValid: false,
/*                    isSmsSended: false,*/
                });
                alert('인증번호가 SMS로 전송되었습니다.');
                console.log(this.state.smsVerificationCode);
                this.startTimer();
            } else if (response.code === 407) {
                alert('이미 등록된 핸드폰번호입니다.');
                return;
            } else {
                alert('서버에 문제가 발생했습니다.');
                return;
            }
        }).catch((err) => {
            this.setState({ isSmsSended: false });
            if (err) {
                console.log(err);
            }
        });
    }
    smsVerificationCodeCheck() {
        if ( this.state.smsVerificationCode.toString() != this.state.smsVerificationCodeByUser.toString()) {
            this.setState({ warnPhoneNumber6digitWrong: true });
            return;
        }
        if (this.state.seconds === 0) {
            alert('인증 시간이 초과되었습니다. 인증번호를 다시 받아서 입력해주세요.');
            return;
        }
        clearInterval(this.timer);
        this.setState({
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
    signup() {
        this.setState({
            warnPhoneNumberNotValid: false,
            warnPhoneNumberNotNumber: false,
            warnPhoneNumberNotVerified: false,
            warnPhoneNumberAlreadyExist: false,
            warnPhoneNumber6digitWrong: false, // 6자리 인증번호가 틀립니다
            warnPasswordNotValid: false,
            warnPasswordRetype: false,
            warnAgreeTerms: false, // 약관 동의해라
            warnNameNotValid: false,
        });


        // 휴대폰 인증완료되었는가?
        if (!this.state.isSmsVerified) {
            this.setState({ warnPhoneNumberNotVerified: true });
        }
        // 비밀번호 포맷이 맞는가?
        if (this.state.password == null || this.state.password.length < 6 || this.state.password.length > 30 || !this.state.password.match(/^(?=.*[a-z])(?=.*\d).+$/)) {
            this.setState({ warnPasswordNotValid: true });
        }
        // 비밀번호 재입력했는가?
        if (this.state.passwordRe != this.state.password) {
            this.setState({ warnPasswordRetype: true });
        }
        //이름을 입력했는가?
        if (!this.state.name) {
            this.setState({ warnNameNotValid: true });
        }
        // 약관에 동의하였는가?
        if (!this.state.isAgreeTerms) {
            this.setState({ warnAgreeTerms: true });
        }
        setTimeout(() => {
            if (this.state.warnPhoneNumberNotValid
                || this.state.warnPhoneNumberNotNumber
                || this.state.warnPhoneNumberNotVerified
                || this.state.warnPhoneNumberAlreadyExist
                || this.state.warnPasswordNotValid
                || this.state.warnPasswordRetype
                || this.state.warnPhoneNumber6digitWrong
                || this.state.warnAgreeTerms
                || this.state.warnNameNotValid
            ) {
                return;
            }

            /*if (this.state.stype === 'F') {
                this.handleFacebookLogin();
            } else if (this.state.stype === 'K') {
                this.handleKakaoLogin();
            }*/
            if (!this.props.stoken) {
                alert('소셜 계정 토큰이 존재하지 않습니다!');
                return;
            } else {
                this.setState({
                    stoken: this.props.stoken,
                })
            }

            setTimeout(() => {
                // 가입시작
                this.props.dispatch(ActionAuth.signup({
                    phoneNumber: this.state.phoneNumber,
                    password: this.state.password,
                    profileUrl: '',
                    coverUrl: '',
                    countryCode: 82,
                    name: this.state.name,
                    type: 0,
                    stype: this.state.stype,
                    stoken: this.state.stoken,
                })).then((response) => {
                    console.log(response);
                    if (response.code === 200) {
                        alert('회원가입이 성공적으로 되었습니다.');
                        this.props.history.push('/');
                    } else if (response.code === 407) {
                        alert('이미 등록된 계정입니다.');
                    }
                }).catch((err) => {
                    alert('회원가입이 실패하였습니다. \n잠시 후, 다시 시도해주세요.');
                });
            }, 100);
        }, 100);
    }
    handleStoken(stoken) {
        this.props.handleStoken(stoken);
    }
    render() {
        return (
            <div className={stylesAuth.authBody + ' ' +stylesAuth.signup}>
                <div className={stylesAuth.authLogo} />
                <div className={stylesAuth.authLogoMobile} />
                <div className={stylesAuth.authBox}>
                    <div className={stylesAuth.authTitle}>
                        핸드폰번호로<br />
                        셀레브 회원가입</div>
                    <div className={styles.formGroup}>
                        {/*<div className={styles.formRow}>
                          <div className={styles.formInputName}>핸드폰번호</div>
                          <input className={styles.formInputWithVerify} type={'text'} value={this.state.phoneNumber} autoComplete={'off'} onChange={(e) => this.setState({ phoneNumber: e.target.value })} placeholder={'핸드폰번호를 입력해주세요.'} />
                          <div className={styles.formInputVerifyBtn + (this.state.phoneNumber.length < 6 ? ' ' + styles.disabled : '')} onClick={this.sendSmsVerificationCode}>인증</div>
                      </div>*/}
                        { this.state.isSmsVerified ? (
                            <div className={styles.formRow}>
                                <div className={styles.formInputName}>핸드폰번호</div>
                                <input className={styles.formInput + ' ' + styles.inputWithVerify} type={'text'} value={this.state.phoneNumber} disabled />
                                <div className={styles.inputVerifyBox + ' ' + styles.disabled}>인증완료</div>
                            </div>
                        ) : (
                            <div>
                                <div className={styles.formRow + ' ' + styles.bottomLine}>
                                    <div className={styles.formInputName}>핸드폰번호</div>
                                    { this.state.smsVerificationCode.length > 0
                                        ? <input className={styles.formInput + ' ' + styles.inputWithVerify} type={'text'} value={this.state.phoneNumber} disabled />
                                        : <input className={styles.formInput + ' ' + styles.inputWithVerify} type={'text'} placeholder={'"-"를 제외해주세요.'} value={this.state.phoneNumber} onChange={(e) => this.setState({ phoneNumber: e.target.value })} />
                                    }
                                    <div className={styles.inputVerifyBox + ' ' + styles.activeRed} onClick={this.sendSmsVerificationCode.bind(this)}>발송</div>
                                </div>
                                { this.state.warnPhoneNumberNotValid ? <div className={styles.formInputWarn}>핸드폰번호를 입력해주세요</div> : null }
                                { this.state.warnPhoneNumberNotNumber ? <div className={styles.formInputWarn}>핸드폰번호는 숫자만 입력 가능합니다</div> : null }
                                { this.state.warnPhoneNumberNotVerified ? <div className={styles.formInputWarn}>핸드폰번호를 인증해주세요</div> : null }
                                { this.state.warnPhoneNumberAlreadyExist ? <div className={styles.formInputWarn}>이미 가입한 휴대폰입니다. 비밀번호를 찾아보세요.</div> : null }
                            </div>
                        ) }
                        <div className={styles.formRow + ( this.state.smsVerificationCode.length > 0 ? '' : ' ' + styles.disabled )}>
                            <div className={styles.formInputName}>인증번호</div>
                            <input className={styles.formInput + ' ' + styles.inputWithVerify} type={'text'} autoComplete={'off'} placeholder={ this.state.smsVerificationCode.length > 0 ? '' : '인증번호를 입력해주세요.' } value={this.state.smsVerificationCodeByUser} onChange={(e) => this.setState({ smsVerificationCodeByUser: e.target.value })} disabled={ this.state.smsVerificationCode.length <= 0 }/>
                            { this.state.smsVerificationCode.length > 0 ? <div className={styles.inputVerifyBox + ' ' + (this.state.authTest ? styles.activeWhite : styles.disabled)} onClick={this.smsVerificationCodeCheck.bind(this)}>인증</div> : null }
                            {/*{ this.state.isSmsVerified ? <div className={styles.inputVerifyBox}><img src={'/assets/img/ic_signup_check.png'} /></div> : null }*/}
                        </div>
                        { this.state.warnPhoneNumber6digitWrong ? <div className={styles.formInputWarn}>인증번호가 틀립니다.</div> : null }
                        { this.state.smsVerificationCode.length > 0 ? (
                            <div className={styles.formInputAlert}>인증시간이 <span className={styles.red}>{(this.state.time && this.state.time.m ? this.state.time.m.toString().padStart(2, '0') : '00') + ':' + (this.state.time && this.state.time.s ? this.state.time.s.toString().padStart(2, '0') : '00')}</span> 남았습니다</div>
                        ) : null }
                        <div className={styles.formRow}>
                            <div className={styles.formInputName}>이름</div>
                            <input className={styles.formInputWithVerify} type={'text'} autoComplete={'off'} value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} placeholder={'이름'} />
                        </div>
                        { this.state.warnNameNotValid ? <div className={styles.formInputWarn}>이름을 입력해주세요.</div> : null }
                        <div className={styles.formRow}>
                            <div className={styles.formInputName}>비밀번호</div>
                            <input className={styles.formInputWithVerify} type={'password'} autoComplete={'off'} value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} placeholder={'비밀번호 확인'} />
                        </div>
                        { this.state.warnPasswordNotValid ? <div className={styles.formInputWarn}>비밀번호는 6자 이상, 30자 미만, 영문/숫자 조합입니다.</div> : null }
                        <div className={styles.formRow}>
                            <div className={styles.formInputName}>비밀번호확인</div>
                            <input className={styles.formInputWithVerify} type={'password'} autoComplete={'off'} value={this.state.passwordRe} onChange={(e) => this.setState({ passwordRe: e.target.value })} placeholder={'비밀번호 확인'} />
                        </div>
                        { this.state.warnPasswordRetype ? <div className={styles.formInputWarn}>비밀번호 재입력이 틀렸습니다.</div> : null }
                        {/*<div className={styles.formRow + ' ' + styles.label}>*/}

                        {/*</div>*/}
                    </div>
                    <div className={styles.agreeLabel}>
                        <input id={'ckeckboxAssociated'} className={stylesAuth.signupCheckbox} type={'checkbox'} value={this.state.isAgreeTerms} onChange={(e) => this.setState({ isAgreeTerms: e.target.checked })} />
                        <label htmlFor={'ckeckboxAssociated'} className={stylesAuth.ckeckboxBlackIcon} />
                        <div className={stylesAuth.checkboxLabel}><Link to={'/setting/policy'} target={'_blank'}><span className={styles.bold + ' ' + styles.black}>이용약관</span></Link>과 <Link to={'/setting/privacy'} target={'_blank'}><span className={styles.bold + ' ' + styles.black}>개인정보취급방침</span></Link>에 동의합니다.</div>
                    </div>
                    { this.state.warnAgreeTerms ? <div className={styles.formInputWarn}>이용약관과 개인정보취급방침에 동의해 주세요.</div> : null }
                    <div>
                        <div className={stylesAuth.authBtn + ' ' + stylesAuth.loginBtn} onClick={this.signup}>가입하기</div>
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
})(withRouter(SignupBody));
