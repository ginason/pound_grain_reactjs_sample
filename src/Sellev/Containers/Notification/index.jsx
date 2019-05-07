import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

//Component
import NotificationHome from '../../Components/Notification/index';
//Styles
import styleNotification from '../../Styles/Components/Notification.css';

class NotificationView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className={styleNotification.notificationContainer}>
                <Route path={'/notification'} exact={true} strict={false} component={NotificationHome} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(NotificationView));