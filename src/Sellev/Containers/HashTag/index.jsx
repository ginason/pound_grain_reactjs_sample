import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import HashTagDetail from "../../Components/HashTag/Detail";
import HashTagHome from "../../Components/HashTag/index";


class HashTagView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: '',
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <div>
                <Route path={'/hashtags'} exact={true} strict={false} component={HashTagHome} />
                <Route path={'/hashtags/detail'} exact={true} strict={false} component={HashTagDetail} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(HashTagView));