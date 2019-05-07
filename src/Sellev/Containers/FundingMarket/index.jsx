import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import FundingMarketHome from '../../Components/FundingMarket/index';
// import FundingMarketDetail from '../../Components/Product/Detail';
import FundingDetail from '../../Components/FundingMarket/DetailFunding';
import MarketDetail from '../../Components/FundingMarket/DetailMarket';

class FundingMarketView extends React.Component {
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
                <Route path={'/fundingmarket'} exact={true} strict={false} component={FundingMarketHome} />
                {/*<Route path={'/fundingmarket/detail'} exact={true} strict={false} component={FundingMarketDetail} />*/}
                <Route path={'/fundingmarket/funding'} exact={true} strict={false} component={FundingDetail} />
                <Route path={'/fundingmarket/market'} exact={true} strict={false} component={MarketDetail} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(FundingMarketView));