import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles
import stylesSetting from '../../Styles/Components/Setting.css';

// Actions
import * as ActionAuth from '../../Data/Authentification/actions';

class SettingSideMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUrl: '',
        }

        this.goPage = this.goPage.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentWillMount() {
        this.setState({
            currentUrl: this.props.currentUrl,
        })
    }
    goPage(url) {
        this.props.history.push(url);
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
            <div className={(this.props.author ? stylesSetting.sideMenuContainer : stylesSetting.displayNone)}>
                <div className={stylesSetting.titleBox}>
                    <div className={stylesSetting.circle}></div>
                    <div className={stylesSetting.title}>설정</div>
                </div>
                <div className={stylesSetting.menuList}>
                    <div onClick={(url) => this.goPage('/setting/profile')} className={stylesSetting.item + (this.props.currentUrl === '/setting/profile' ? ' ' + stylesSetting.active : '')}>프로필설정</div>
                    <div onClick={(url) => this.goPage('/setting/changePassword')} className={stylesSetting.item + (this.props.currentUrl === '/setting/changePassword' ? ' ' + stylesSetting.active : '')}>비밀번호 설정</div>
                    <div onClick={(url) => this.goPage('/setting/policy')} className={stylesSetting.item + (this.props.currentUrl === '/setting/policy' ? ' ' + stylesSetting.active : '')}>이용약관</div>
                    <div onClick={(url) => this.goPage('/setting/privacy')} className={stylesSetting.item + (this.props.currentUrl === '/setting/privacy' ? ' ' + stylesSetting.active : '')}>개인정보취급방침</div>
                    <div onClick={this.logout} className={stylesSetting.item}>로그아웃</div>
                    <div onClick={(url) => this.goPage('/setting/deleteAccount')} className={stylesSetting.item + (this.props.currentUrl === '/setting/deleteAccount' ? ' ' + stylesSetting.active : '')}>회원탈퇴</div>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SettingSideMenu));