import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import LoginContainer from '../../Components/Authentication/Login';
import SignupContainer from '../../Components/Authentication/Signup';
import FindPasswordContainer from '../../Components/Authentication/FindPassword';
import PolicyPrivacyContainer from '../../Components/Authentication/PolicyPrivacy';
import PolicyUserContainer from '../../Components/Authentication/PolicyUser';
import LoginCallBack from '../../Components/Authentication/LoginCallback';

// Styles



class LoginView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stoken: '',
        }
        this.handleStoken = this.handleStoken.bind(this);
    }
    handleStoken(stoken) {
        this.setState({
            stoken: stoken,
        });
    }
    render() {
        return (
            <div>
                <Route path={'/auth/login'} exact={true} strict={false} render={() => <LoginContainer handleStoken={(stoken) => this.handleStoken(stoken)} stoken={this.state.stoken} />} />
                <Route path={'/auth/login/callback'} exact={true} strict={false} render={() => <LoginCallBack handleStoken={(stoken) => this.handleStoken(stoken)} stoken={this.state.stoken} />} />
                <Route path={'/auth/signup'} exact={true} strict={false} render={() => <SignupContainer handleStoken={(stoken) => this.handleStoken(stoken)} stoken={this.state.stoken} />} />
                <Route path={'/auth/findpassword'} exact={true} strict={false} component={FindPasswordContainer} />
                <Route path={'/auth/policyprivacy'} exact={true} strict={false} component={PolicyPrivacyContainer} />
                <Route path={'/auth/policyuser'} exact={true} strict={false} component={PolicyUserContainer} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(LoginView));
