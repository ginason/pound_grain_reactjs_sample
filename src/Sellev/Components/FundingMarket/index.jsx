import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import Banner from './Banner';
import Body from './List';

class FundingMarketHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: '',
        };
        // this.goPage = this.goPage.bind(this);
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        // if (this.props.isWebview) {
        //     var that = this;
        //     document.addEventListener("message", (data) => {
        //         alert("FundingMarket event!");
        //         if(JSON.parse(data.data).type === 'main') {
        //             this.setState({
        //                 url: JSON.parse(data.data).response,
        //             }, () => {
        //                 that.goPage(this.state.url);
        //             });
        //         }
        //     });
        // }
    }
    // goPage(url) {
    //     alert(url);
    //     this.props.history.push(url);
    // }
    render() {
        return (
            <div>
                <Banner />
                <Body />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(FundingMarketHome));