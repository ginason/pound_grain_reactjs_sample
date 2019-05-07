import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles

import styles from '../../Styles/App.css';
import stylesSetting from '../../Styles/Components/Setting.css';


// Actions
import * as ActionAuth from '../../Data/Authentification/actions';

class SettingPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',

            newPassword: '',
            newPasswordRe: '',

            warnPasswordWrong: false,
            warnPasswordNotValid: false,
            warnPasswordRetype: false,
        }
        this.changePassword = this.changePassword.bind(this);
    }
    componentWillMount() {
        if (this.props.author && this.props.author.user) {
            this.setState({
                phoneNumber: this.props.author.user.phoneNumber
            });
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.author && nextProps.author.user) {
            this.setState({
                phoneNumber: nextProps.author.user.phoneNumber
            });
        }
    }
    changePassword() {
        this.setState({
            warnPasswordWrong: false,
            warnPasswordNotValid: false,
            warnPasswordRetype: false,
        });

        if (this.state.newPassword == null || this.state.newPassword.length < 6 || this.state.newPassword.length > 30 || !this.state.newPassword.match(/^(?=.*[a-z])(?=.*\d).+$/)) {
            this.setState({ warnPasswordNotValid: true });
        }

        if (this.state.newPassword != this.state.newPasswordRe) {
            this.setState({ warnPasswordRetype: true });
        }
        setTimeout(() => {
            if (this.state.warnPasswordRetype
                || this.state.warnPasswordNotValid
                || this.state.warnPasswordWrong
            ) {
                return;
            }
            console.log(this.state.phoneNumber);
            ActionAuth.changePassword({
                phoneNumber: this.state.phoneNumber,
                countryCode: 82,
                oldPassword:  this.state.password,
                newPassword: this.state.newPassword,
            }).then((response) => {
                console.log(response);
                console.log(response);
                console.log(response);
                console.log(response);
                if(response.code === 408) {
                    this.setState({ warnPasswordWrong: true });
                } else if (response.code === 200) {
                    alert('비밀번호가 변경되었습니다.');
                    this.setState({
                        password: '',

                        newPassword: '',
                        newPasswordRe: '',

                        warnPasswordWrong: false,
                        warnPasswordNotValid: false,
                        warnPasswordRetype: false,
                    })
                }
            }).catch((err) => {
                alert('실패');
            });
        }, 200);
    }
    render() {
        return (
            <div className={stylesSetting.passwordContainer}>
                <div className={stylesSetting.passwordSection + ' ' + stylesSetting.whiteBox}>
                    <div className={stylesSetting.title}>비밀번호 설정</div>
                    <div className={stylesSetting.blank} />
                    <div className={styles.formGroupTitle + ' ' + stylesSetting.font20Mobile}>기존 비밀번호</div>
                    <div className={styles.formGroup + ' ' + stylesSetting.formGroup}>
                        <div className={styles.formRow}>
                            <input className={styles.formInput + ' ' + styles.fullWidth} type={'password'} placeholder={'기존 비밀번호를 입력해주세요'} value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
                        </div>
                        { this.state.warnPasswordWrong ? <div className={styles.formInputWarn}>비밀번호가 일치하지않습니다.</div> : null }
                    </div>
                    <div className={stylesSetting.blank2} />
                    <div className={styles.formGroupTitle + ' ' + stylesSetting.font20Mobile}>새로운 비밀번호</div>
                    <div className={styles.formGroup + ' ' + stylesSetting.formGroup}>
                        <div className={styles.formRow}>
                            <input className={styles.formInput + ' ' + styles.fullWidth} type={'password'} placeholder={'새로운 비밀번호(6~15자)를 입력해주세요'} value={this.state.newPassword} onChange={(e) => this.setState({ newPassword: e.target.value })}/>
                        </div>
                        { this.state.warnPasswordNotValid ? <div className={styles.formInputWarn}>비밀번호는 6자 이상, 30자 미만, 영문/숫자 조합입니다.</div> : null }
                        <div className={styles.formRow}>
                            <input className={styles.formInput + ' ' + styles.fullWidth} type={'password'} placeholder={'새로운 비밀번호 확인'} value={this.state.newPasswordRe} onChange={(e) => this.setState({ newPasswordRe: e.target.value })}/>
                        </div>
                        { this.state.warnPasswordRetype ? <div className={styles.formInputWarn}>비밀번호 재입력이 틀렸습니다.</div> : null }
                    </div>
                </div>
                {/*fullScreen*/}
                <div className={stylesSetting.btnSection + ' ' + styles.fullScreen}>
                    <div className={stylesSetting.btn + ' ' + stylesSetting.btnRed} onClick={this.changePassword}>설정하기</div>
                </div>
                {/*mobile Screen*/}
                <div className={styles.mobileScreen}>
                    <div className={styles.mobileBtn + ' ' + stylesSetting.changePasswordBtn} onClick={this.changePassword}>변경완료</div>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SettingPassword));