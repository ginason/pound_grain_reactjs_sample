import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import VerifyBody from './FindPasswordVerifyBody';
import ChangeBody from './FindPasswordChangeBody';
import Footer from './Footer';

// Styles
import stylesAuth from '../../Styles/Components/Authentication.css';
import styles from '../../Styles/App.css';

class FindPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            verified: false,
        };
        this.verifyUser = this.verifyUser.bind(this);
        this.getPhoneNumber = this.getPhoneNumber.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    verifyUser(verified) {
        this.setState({
            verified: verified,
        });
    }
    getPhoneNumber(phoneNumber) {
        this.setState({
            phoneNumber: phoneNumber,
        })
    }
    goBack() {
        if(this.state.verified) {
            this.setState({
                verified: false,
            })
        } else {
            this.props.history.push('/auth/login');
        }
    }
    render() {
        return (
            <div className={stylesAuth.findPasswordContainer}>
                <div onClick={this.goBack} className={styles.backIcon + ' ' + styles.mobileScreen} />
                { this.state.verified ? <ChangeBody phoneNumber={this.state.phoneNumber} /> : <VerifyBody getPhoneNumber={(phoneNumber) => this.getPhoneNumber(phoneNumber)} onVerified={(verified) => this.verifyUser(verified)} /> }
                <Footer />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(FindPassword));
