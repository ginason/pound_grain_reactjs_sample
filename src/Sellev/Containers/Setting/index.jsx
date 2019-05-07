import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


// Components

import SettingSideMenu from '../../Components/Setting/SideMenu';
import SettingHome from "../../Components/Setting/index";
import SettingProfile from '../../Components/Setting/Profile';
import SettingPassword from '../../Components/Setting/ChangePassword';
import SettingDelete from '../../Components/Setting/Delete';
import SettingPolicy from '../../Components/Setting/Policy';
import SettingPrivacy from '../../Components/Setting/Privacy';
import SettingVersion from '../../Components/Setting/Version';
// Styles

import stylesSetting from '../../Styles/Containers/Setting.css';

class SettingView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUrl: '',
        }
    }
    componentWillMount() {
        this.setState({
            currentUrl: this.props.location.pathname,
        })
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            currentUrl: nextProps.location.pathname,
        })
    }
    shouldComponentUpdate(nextProps) {
        return this.props.location.pathname !== nextProps.location.pathname;
    }
    render() {
        return (
            <div className={stylesSetting.settingContainer}>
                {this.props.location.pathname === '/setting' || !this.props.author ?
                    null
                :
                    <SettingSideMenu currentUrl={this.state.currentUrl} />
                }

                <Route path={'/setting'} exact={true} strict={false} component={SettingHome} />
                <Route path={'/setting/profile'} exact={true} strict={false} component={SettingProfile} />
                <Route path={'/setting/changePassword'} exact={true} strict={false} component={SettingPassword} />
                <Route path={'/setting/deleteAccount'} exact={true} strict={false} component={SettingDelete} />
                <Route path={'/setting/privacy'} exact={true} strict={false} component={SettingPrivacy} />
                <Route path={'/setting/policy'} exact={true} strict={false} component={SettingPolicy} />
                <Route path={'/setting/version'} exact={true} strict={false} component={SettingVersion} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SettingView));