import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Styles
import stylesUser from '../Styles/Common/UserBox.css';
/*
this.props.profile
this.props.size
*/
class userBox extends React.Component {
    render() {
        return (
            <div className={stylesUser.userBox} style={{backgroundImage: 'url("' + (this.props.profile ? this.props.profile.replace('original', '80x80') : '/assets/img/img_default_product_detail.png') + '")', width: this.props.size, height: this.props.size} }>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(userBox));
