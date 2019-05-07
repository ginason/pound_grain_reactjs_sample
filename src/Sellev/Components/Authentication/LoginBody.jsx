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

const mql = window.matchMedia('(max-width: 768px)');

class LoginBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            password: '',
            stype: '',

            warnPhoneNumberNotValid: false,
            warnPasswordNotValid: false,
        };

        this.login = this.login.bind(this);
        this.initializeFacebook = this.initializeFacebook.bind(this);
        this.initializeNaver = this.initializeNaver.bind(this);
        this.initializeKakao = this.initializeKakao.bind(this);

        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);

        this.checkFacebookLoginState = this.checkFacebookLoginState.bind(this);
        this.statusChangeCallback = this.statusChangeCallback.bind(this);
        this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
        this.handleKakaoLogin = this.handleKakaoLogin.bind(this);
        this.handleNaverpPostMessage = this.handleNaverpPostMessage.bind(this);
        this.handleNaverLogin = this.handleNaverLogin.bind(this);
    }
    componentWillMount() {
        console.log('console.log(this.props.isWebview);');
        console.log(this.props.isWebview);
        // 하이브리드 앱 관련 코드
        if (this.props.isWebview) {
            var that = this;
            document.addEventListener("message", (data) => {
                if (JSON.parse(data.data).type === 'facebookLogin') {
                    that.statusChangeCallback(JSON.parse(data.data).response);
                } else if (JSON.parse(data.data).type === 'naverLogin') {
                    that.handleNaverLogin(JSON.parse(data.data).response);
                } else if (JSON.parse(data.data).type === 'kakaoLogin') {
                    alert("kakao login!!");
                }
            });
        }
        mql.addListener(this.mediaQueryChanged);
    }
    componentDidMount() {
        this.initializeFacebook();
        this.initializeNaver();
        this.initializeKakao();
    }
    componentWillUnmount() {
       Kakao.cleanup();
    }
    mediaQueryChanged() {
        this.setState({sidebarDocked: this.state.mql.matches});
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
                    console.log('auth change');
                    this.checkFacebookLoginState();
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
    initializeNaver() {
        if(!this.props.isWebview) {
            var naver_id_login = new window.naver_id_login('bK_MtVFbCk3VyWgCT6R7', 'https://13.124.177.122/auth/login/callback');
            var state = naver_id_login.getUniqState();

            naver_id_login.setButton("green", 10,40) // 두번째 매개변수를 10으로 설정하면 커스텀한 네이버 버튼이 나오게 라이브러리 수정
            naver_id_login.init_naver_id_login();
        }
    }
    handleNaverpPostMessage() {
        // 하이브리드 앱 관련 코드
        if (this.props.isWebview) {
            window.postMessage(JSON.stringify({
                type: 'naverLogin',
            }), "*");
        }
    }
    handleNaverLogin(response) {
        if (response.status === 'success') {
            let params = {
                phoneNumber: response.id,
                password: response.access_token,
                stype: 'N',
            }
            this.props.handleStoken(response.access_token);
            this.login(params);
        } else {
            console.log('로그인 실패', response.status);
            alert('로그인 실패');
        }
    }
    initializeKakao() {
        Kakao.init('5f985ae61b4cf276f6aac61973738fa9');
    }
    statusChangeCallback(response) {
        if (response.status === 'connected') {
            // Logged into your app and Facebook.
            let params = {
                phoneNumber: response.authResponse.userID,
                password: response.authResponse.accessToken,
                stype: 'F',
            };
            this.props.handleStoken(response.authResponse.accessToken);
            this.login(params);
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
        });
    }
    handleFacebookLogin() {
        // 하이브리드 앱 관련 처리
        if (this.props.isWebview) {
            window.postMessage(JSON.stringify({
                type: 'facebookLogin',
            }), "*");
        } else {
            FB.login(this.checkFacebookLoginState());
        }
    }
    handleKakaoLogin() {
        // 하이브리드 앱 관련 처리
        if (this.props.isWebview) {
            window.postMessage(JSON.stringify({
                type: 'kakaoLogin',
            }), "*");
        } else {
            let currentApp = this;
            Kakao.Auth.login({
                success: function(authObj) {
                    Kakao.API.request({
                        url: '/v1/user/me',
                        success: function (response) {
                            let params = {
                                phoneNumber: response.id,
                                password: authObj.access_token,
                                stype: 'K',
                            }
                            currentApp.props.handleStoken(authObj.access_token);
                            currentApp.login(params);
                        }
                    })
                },
                fail: function(err) {
                    alert(JSON.stringify(err));
                }
            });
        }
    }
    handleClickLogin() {
        this.setState({
            warnPhoneNumberNotValid: false,
            warnPasswordNotValid: false,
        });

        // 핸드폰번호 포맷이 맞는가?
        if (this.state.phoneNumber == null || this.state.phoneNumber.length < 4 || this.state.phoneNumber.length > 30) {
            this.setState({warnPhoneNumberNotValid: true});
        }
        // 비밀번호 포맷이 맞는가?
        if (this.state.password == null || this.state.password.length < 5 || this.state.password.length > 20) {
            this.setState({warnPasswordNotValid: true});
        }

        setTimeout(() => {
            if (this.state.warnPhoneNumberNotValid
                || this.state.warnPasswordNotValid
            ) {
                return;
            }

            let params = {
                phoneNumber: this.state.phoneNumber,
                password: this.state.password,
                stype: '',
            };

            // 셀레브 로그인 시작
            this.login(params);
        }, 100);
    }
    onKeyPress(e) {
        if (e.key === 'Enter') {
            this.handleClickLogin();
        }
    };
    login(params) {
        this.props.dispatch(ActionAuth.login(params))
            .then((response) => {
                if (response.code === 200) {
                    this.props.history.push('/');
                } else if (response.code === 408) {
                    alert('존재하지 않는 계정입니다.');
                    setTimeout(() => {
                        if (params.stype === 'F') {
                            this.props.history.push('/auth/signup?stype=F');
                        } else if (params.stype === 'K') {
                            this.props.history.push('/auth/signup?stype=K');
                        } else if (params.stype === 'N') {
                            this.props.history.push('/auth/signup?stype=N');
                        }
                    }, 100);
                } else if (response.code === 409) {
                    alert('잘못된 비밀번호입니다.');
                } else if (response.code === 406 || response.code === 412) {
                    alert('알 수 없는 데이터베이스 에러입니다.');
                } else {
                    alert('알 수 없는 데이터베이스 에러입니다.');
                }
            })
            .catch((err) => {
                alert('로그인에 실패했습니다.');
            });
    }
    render() {
        let stylesd = {
            margin: '20px',
            width: '250px',
            height: '250px',
            backgroundColor: 'yellow',
        };
        return (
            <div className={stylesAuth.authBody + ' ' + stylesAuth.login}>
                <div className={stylesAuth.authLogo} />
                {/*mobile logo*/}
                <div className={stylesAuth.mobileLoginBox}>
                    <div className={stylesAuth.logoBox}>
                        {/*<div className={stylesAuth.line}/>*/}
                        <div className={stylesAuth.logo}></div>
                    </div>
                    <div className={stylesAuth.title}>셀레브 로그인</div>
                </div>
                <div className={stylesAuth.authBox}>
                    {/*<AuthBtn type={'kakao'} />
                    <AuthBtn type={'naver'} />
                    <AuthBtn type={'facebook'} />*/}
                    <div onClick={this.handleKakaoLogin} className={stylesAuth.authBtn + ' ' + stylesAuth.kakao} id={'kakao-login-btn'}>
                        <div className={stylesAuth.kakaoBody}>
                            <div />
                            <div>카카오로 로그인</div>
                        </div>
                    </div>
                    {this.props.isWebview ?
                        <div onClick={this.handleNaverpPostMessage} className={stylesAuth.authBtn + ' ' + stylesAuth.naver}>
                            <div className={stylesAuth.naverBody}>
                                <div />
                                <div>네이버로 로그인</div>
                            </div>
                        </div>
                    :
                        <div className={stylesAuth.authBtn + ' ' + stylesAuth.naver} id={'naver_id_login'} />
                    }
                    <div className={stylesAuth.authBtn + ' ' + stylesAuth.facebook} onClick={this.handleFacebookLogin}>
                        <div className={stylesAuth.facebookBody}>
                            <div />
                            <div>페이스북으로 로그인</div>
                        </div>
                    </div>
                    <div className={stylesAuth.border}>
                        <div className={stylesAuth.or}>OR</div>
                    </div>
                    <div className={styles.formGroup + ' ' + styles.loginForm}>
                        <div className={styles.formRow + ' ' + styles.loginMobile}>
                            <div className={styles.formInputName}>핸드폰번호</div>
                            <input className={styles.formInputWithVerify} type={'text'} value={this.state.phoneNumber} onChange={(e) => this.setState({ phoneNumber: e.target.value })} placeholder={'핸드폰번호를 입력해주세요.'} onKeyPress={this.onKeyPress}/>
                        </div>
                        { this.state.warnPhoneNumberNotValid ? <div className={styles.formInputWarn}>핸드폰번호를 입력하세요.</div> : null }
                        <div className={styles.formRow}>
                            <div className={styles.formInputName}>비밀번호</div>
                            <input className={styles.formInputWithVerify} type={'password'} value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} autoComplete={'off'} placeholder={'비밀번호를 입력해주세요.'} onKeyPress={this.onKeyPress} />
                        </div>
                        { this.state.warnPasswordNotValid ? <div className={styles.formInputWarn}>비밀번호를 입력하세요.</div> : null }
                    </div>
                    <div className={stylesAuth.mobileLoginFooter}>
                        <div><Link to={'/auth/signup'}>아직 회원이 아니신가요?</Link></div>
                        <div><Link to={'/auth/findpassword'}>비밀번호가 기억이 안나시나요?</Link></div>
                    </div>
                    <div className={stylesAuth.authBtn + ' ' + stylesAuth.mobileLoginBtn} onClick={this.handleClickLogin}>로그인</div>
                    {/*<div className={stylesAuth.boxFooter + ' ' + styles.fullScreen}>*/}
                        {/*<span>아직 회원이 아니신가요?</span>*/}
                        {/*<Link to={'/auth/signup'}>셀레브 가입하기</Link>*/}
                    {/*</div>*/}
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
})(withRouter(LoginBody));

