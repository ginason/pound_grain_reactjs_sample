import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import MyFunding from '../../Components/UserMenu/MyFunding';
import MyOrder from '../../Components/UserMenu/MyOrder';
import BuyCoin from '../../Components/UserMenu/BuyCoin';
import GuideLine from '../../Components/UserMenu/GuideLine';
// Styles
import styleUser from '../../Styles/Components/UserMenu.css';
// Actions


class UserMenuDrawer extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
        <div>
            <Route path={'/usermenu/myfunding'} exact={true} strict={false} component={MyFunding} />
            <Route path={'/usermenu/myorder'} exact={true} strict={false} component={MyOrder} />
            <Route path={'/usermenu/buycoin'} exact={true} strict={false} component={BuyCoin} />
            <Route path={'/usermenu/guideline'} exact={true} strict={false} component={GuideLine} />
        </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(UserMenuDrawer));