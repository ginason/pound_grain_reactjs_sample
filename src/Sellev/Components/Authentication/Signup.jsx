import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import SignupBody from './SignupBody';
import Footer from './Footer';

// Styles
import stylesAuth from '../../Styles/Components/Authentication.css';
import styles from '../../Styles/App.css';

class SingupView extends React.Component {
    constructor(props) {
        super(props);

        this.goBack = this.goBack.bind(this);
        this.handleStoken = this.handleStoken.bind(this);
    }
    goBack() {
        this.props.history.push('/auth/login');
    }
    handleStoken(stoken) {
        this.props.handleStoken(stoken);
    }
    render() {
        return (
            <div className={stylesAuth.signupContainer}>
                <div onClick={this.goBack} className={styles.backIcon + ' ' + styles.mobileScreen} />
                <SignupBody handleStoken={(stoken) => this.handleStoken(stoken)} stoken={this.props.stoken} />
                <Footer />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SingupView));