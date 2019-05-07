import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
//Style
import styles from '../../Styles/App.css'
import styleSetting from '../../Styles/Components/Setting.css';


// Actions
import * as ActionAuth from '../../Data/Authentification/actions';

class SettingHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: ''
        }
        this.logout = this.logout.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            phoneNumber: nextProps.author.user.phoneNumber,
        })
    }
    logout() {
        if (confirm('로그아웃 하시겠습니까?')) {
            this.props.dispatch(ActionAuth.logout())
                .then((response) => {
                    this.props.history.push('/');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    render() {
        return (
            <div className={styleSetting.settingContainer}>
                <div className={styleSetting.settingHeader}>설정</div>
                <div className={styleSetting.settingBody}>
                    <div className={styleSetting.formTitle}>개인정보</div>
                    <div className={styles.formGroup + ' ' + styles.formSettingContainer}>
                        <Link to={'/setting/profile'} className={styles.formRow + ' ' + styles.formSettingBox}>
                            <div className={styles.formInputText + ' ' + styles.settingText}>프로필 설정</div>
                            <div className={styles.formInput + ' ' + styles.inputWithIcon + ' ' + styleSetting.settingText}>{this.state.phoneNumber}</div>
                            <div className={styles.arrowRight + ' ' + styleSetting.iconArrow} />
                        </Link>
                        <Link to={'/setting/changePassword'} className={styles.formRow + ' ' + styles.formSettingBox}>
                            <div className={styles.formInputText + ' ' + styles.formNoInput}>비밀번호 설정</div>
                            <div className={styles.arrowRight + ' ' + styleSetting.iconArrow} />
                        </Link>
                    </div>
                    <div className={styleSetting.formTitle}>고객지원</div>
                    <div className={styles.formGroup + ' ' + styles.formSettingContainer}>
                        <Link to={'/setting/policy'} className={styles.formRow + ' ' + styles.formSettingBox}>
                            <div className={styles.formInputText + ' ' + styles.formNoInput}>이용약관</div>
                            <div className={styles.arrowRight + ' ' + styleSetting.iconArrow} />
                        </Link>
                        <Link to={'/setting/privacy'} className={styles.formRow + ' ' + styles.formSettingBox}>
                            <div className={styles.formInputText + ' ' + styles.formNoInput}>개인정보취급방침</div>
                            <div className={styles.arrowRight + ' ' + styleSetting.iconArrow} />
                        </Link>
                        <Link to={'/setting/version'} className={styles.formRow + ' ' + styles.formSettingBox}>
                            <div className={styles.formInputText + ' ' + styles.settingText}>버전정보</div>
                            <div className={styles.formInput + ' ' + styles.inputWithIcon + ' ' + styleSetting.settingText}>1.1</div>
                            <div className={styles.arrowRight + ' ' + styleSetting.iconArrow} />
                        </Link>
                    </div>
                    <div className={styleSetting.formTitle}>기타</div>
                    <div className={styles.formGroup + ' ' + styles.formSettingContainer}>
                        <div onClick={this.logout} className={styles.formRow + ' ' + styles.formSettingBox}>
                            <div className={styles.formInputText + ' ' + styles.formNoInput}>로그아웃</div>
                            <div className={styles.arrowRight + ' ' + styleSetting.iconArrow} />
                        </div>
                        <Link to={'/setting/deleteAccount'} className={styles.formRow + ' ' + styles.formSettingBox}>
                            <div className={styles.formInputText + ' ' + styles.formNoInput}>회원탈퇴</div>
                            <div className={styles.arrowRight + ' ' + styleSetting.iconArrow} />
                        </Link>
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
})(withRouter(SettingHome));