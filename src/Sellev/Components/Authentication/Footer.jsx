import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components


// Styles
import stylesSignup from '../../Styles/Components/Authentication.css';

class SignupFooter extends React.Component {
    render() {
        let footer = () => {
            switch (this.props.location.pathname) {
                case '/auth/signup':
                    return(
                        <div>
                            <Link to={'/auth/login'}>로그인</Link>
                            <span> | </span>
                            <Link to={'/auth/findpassword'}>비밀번호찾기</Link>
                            <div className={stylesSignup.logoBox}>
                                <div />
                                <span>Copyright All Right Reserved</span>
                            </div>
                        </div>
                    );
                case '/auth/login':
                    return(
                        <div>
                            <Link to={'/auth/findpassword'}>비밀번호찾기</Link>
                            <div className={stylesSignup.logoBox}>
                                <div />
                                <span>Copyright All Right Reserved</span>
                            </div>
                        </div>
                    );
                case '/auth/findpassword':
                    return(
                        <div>
                            <div className={stylesSignup.signupFooter}>
                                <Link to={'/auth/login'}>로그인</Link>
                                <span> | </span>
                                <Link to={'/auth/signup'}>회원가입</Link>
                                <div className={stylesSignup.logoBox}>
                                    <div />
                                    <span>Copyright All Right Reserved</span>
                                </div>
                            </div>
                        </div>
                    );
            }

        }
        return (
            <div className={stylesSignup.signupFooter}>
                {footer()}
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SignupFooter));
