import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Actions
import * as ActionAuth from '../../Data/Authentification/actions';

// Styles

import styles from '../../Styles/App.css';
import stylesSetting from '../../Styles/Components/Setting.css';


class SettingPassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            isAgreeTerms: false,

            deleteOption: 0,
            optionOther: '',

            warnPasswordNotValid: false,
            warnAgreeTerms: false, // 약관 동의해라
            warnDeleteOption: false, //탈퇴 옵션
        }

        this.deleteAccount = this.deleteAccount.bind(this);
    }
    deleteAccount() {
        this.setState({
            warnPasswordNotValid: false,
            warnAgreeTerms: false, // 약관 동의해라
            warnDeleteOption: false,
        });
        //탈퇴 옵션을 선택했는가?
        if (this.state.deleteOption === 0) {
            this.setState({ warnDeleteOption: true });
        }
        // 비밀번호 포맷이 맞는가?
        if (this.state.password == null || this.state.password.length < 5 || this.state.password.length > 20) {
            this.setState({ warnPasswordNotValid: true });
        }
        // 약관에 동의하였는가?
        if (!this.state.isAgreeTerms) {
            this.setState({ warnAgreeTerms: true });
        }

        setTimeout(() => {
            if (this.state.warnPasswordNotValid
                || this.state.warnAgreeTerms
            ) {
                return;
            }
            let checkPwd = false;
            let promises = [];

            promises.push(ActionAuth.verifyPassword({password: this.state.password})
                .then((response) => {
                    if (response.code === 200) {
                        checkPwd = true;
                        return Promise.resolve(null);
                    } else if (response.code === 409) {
                        alert('잘못된 비밀번호입니다.');
                        return;
                    } else {
                        console.log('데이터를 처리하는 데 문제가 발생했습니다.');
                        return;
                    }
                })
                .catch((err) => {
                    return Promise.resolve(null);
                }));

            setTimeout(() => {
                Promise.all(promises).then(() => {
                    if (checkPwd) {
                        if (confirm('회원 탈퇴하시겠습니까?')) {
                            this.props.dispatch(ActionAuth.deleteAccount())
                                .then((response) => {
                                    if (response.code === 200) {
                                        this.props.history.push('/');
                                    } else {
                                        alert('서버에 문제가 발생했습니다.');
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                    alert('서버에 문제가 발생했습니다.');
                                })
                        }
                    } else {
                        return;
                    }
                })
            }, 100);
        }, 100);

    }
    render() {
        console.log('this.state.deleteOption');
        console.log(this.state.deleteOption);
        return (
            <div className={stylesSetting.deleteContainer}>
                <div className={stylesSetting.deleteSection + ' ' + stylesSetting.whiteBox}>
                    <div className={stylesSetting.title}>회원탈퇴</div>
                    <div className={stylesSetting.regulationBox}>
                        <div className={stylesSetting.title}>{this.props.author && this.props.author.user ? this.props.author.user.name + '님, ' : ''} 셀레브를 이용하시는데 어떤 불편함이 있으셨나요?</div>
                        <select value={this.state.deleteOption} onChange={(e) => this.setState({deleteOption: e.target.value})} className={stylesSetting.deleteOption}>
                            <option value={0}>탈퇴사유는 무엇인가요?</option>
                            <option value={1}>서비스를 더이상 이용하지 않아요.</option>
                            <option value={2}>서비스에 재가입할 거예요</option>
                            <option value={3}>서비스에 원하는 정보가 부족해요.</option>
                            <option value={4}>개인정보를 남기는 게 싫어요.</option>
                            <option value={5}>시스템 오류와 장애가 잦아요.</option>
                            <option value={6}>다른 이유가 있어요.</option>
                        </select>
                        {this.state.deleteOption == 6 ?
                            <input value={this.state.optionOther} onChange={(e) => this.setState({optionOther: e.target.value})} type={'text'} className={stylesSetting.optionOther} />
                        :
                            null
                        }
                        { this.state.warnDeleteOption ? <div className={stylesSetting.checkboxWarn}>탈퇴 사유를 선택해주세요.</div> : null }
                        <ul className={stylesSetting.content}>
                            <li>
                                <div>탈퇴 전 꼭 확인하세요.</div>
                                <div>셀레브를 탈퇴하면 모든 정보가 삭제되며 한 번 삭제된 정보는 다시 복구할 수 없습니다.</div>
                            </li>
                            <li>
                                <div>탈퇴 후 1개월 내 재가입 불가</div>
                                <div>탈퇴 후 1개월 내 동일 아이디(이메일)로 재가입 불가</div>
                            </li>
                            <li>
                                <div>탈퇴 후 재가입 시 신규 회원혜택 제한</div>
                                <div>재가입 후 신규 회원혜택 및 제휴 프로모션 관련 혜택 지급 불가</div>
                            </li>
                            <li>
                                <div>탈퇴 후 개인 정보 일괄 삭제</div>
                                <div>참여한/좋아요한 프로젝트 및 코인, 포인트 등 개인 정보 일괄 삭제</div>
                            </li>
                            <li>
                                <div>탈퇴 전 작성한 게시물은 삭제 불가</div>
                                <div>게시글, 댓글, 펀딩한 프로젝트의 투자 리스트에 남겨진 이름 등 삭제 불가</div>
                            </li>
                        </ul>
                        <div className={stylesSetting.checkBox}>
                            <input id={'ckeckboxAssociated'} value={this.state.isAgreeTerms} onChange={(e) => this.setState({ isAgreeTerms: e.target.checked })} className={stylesSetting.checkbox} type={'checkbox'}/>
                            <label htmlFor={'ckeckboxAssociated'} className={stylesSetting.checkboxBlackIcon} />
                            <div className={stylesSetting.checkboxLabel}>셀레브 회원탈퇴 규정에 동의합니다.</div>
                        </div>
                        { this.state.warnAgreeTerms ? <div className={stylesSetting.checkboxWarn}>회원탈퇴 규정에 동의해 주세요.</div> : null }
                    </div>
                    <div className={styles.formGroupTitle}>현재 비밀번호</div>
                    <div className={styles.formGroup + ' ' + stylesSetting.formGroup}>
                        <div className={styles.formRow}>
                            <input className={styles.formInput + ' ' + styles.fullWidth} value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} type={'password'} placeholder={'현재 비밀번호를 입력해주세요.'}/>
                        </div>
                        { this.state.warnPasswordNotValid ? <div className={styles.formInputWarn}>비밀번호는 6자 이상, 30자 미만, 영문/숫자 조합입니다.</div> : null }
                    </div>
                </div>
                {/*fullScreen*/}
                <div className={stylesSetting.btnSection + ' ' + styles.fullScreen}>
                    <div onClick={this.deleteAccount} className={stylesSetting.btn + ' ' + stylesSetting.btnRed}>회원탈퇴</div>
                </div>
                {/*mobile Screen*/}
                <div className={stylesSetting.btnBoxMobile + ' ' + styles.mobileScreen}>
                    <div onClick={this.deleteAccount} className={stylesSetting.btnPay}>회원탈퇴</div>
                    <div className={stylesSetting.btnCancel}>탈퇴취소</div>
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