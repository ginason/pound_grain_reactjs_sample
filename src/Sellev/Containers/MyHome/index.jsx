import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MyHomeHome from "../../Components/MyHome/index";


class MyHomeView extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Route path={'/myhome'} exact={true} strict={false} component={MyHomeHome} />
            </div>
        );
    }
}
export default connect()(withRouter(MyHomeView));