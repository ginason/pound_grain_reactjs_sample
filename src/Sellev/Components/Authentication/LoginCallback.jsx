import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
// Styles
import * as ActionAuth from "../../Data/Authentification/actions";

class LoginView extends React.Component {
    constructor(props) {
        super(props);

        window.naverSignInCallback = this.naverSignInCallback.bind(this);
        this.login = this.login.bind(this);
    }

    componentDidMount() {
        let naver_id_login = new window.naver_id_login('bK_MtVFbCk3VyWgCT6R7', 'https://13.124.177.122/auth/login/callback')
        naver_id_login.get_naver_userprofile('naverSignInCallback()');
    }
    naverSignInCallback() {
            let naver_id_login = new window.naver_id_login('bK_MtVFbCk3VyWgCT6R7', 'https://13.124.177.122/auth/login/callback')
            let params = {
                phoneNumber: naver_id_login.getProfileData('id'),
                password: naver_id_login.oauthParams.access_token,
                stype: 'N',
            }
            this.props.handleStoken(naver_id_login.oauthParams.access_token);
            this.login(params);

    }
    login(params) {
        this.props.dispatch(ActionAuth.login(params))
            .then((response) => {
                if (response.code === 200) {
                    this.props.history.push('/');
                } else if (response.code === 408) {
                    alert('존재하지 않는 계정입니다.');
                    setTimeout(() => {
                        this.props.history.push('/auth/signup?stype=N');
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
        return (
            <div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(LoginView));