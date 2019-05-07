import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import FundingMarketList from './FundingMarketList';

//Style
import styles from '../../../Styles/App.css';
import stylesFundingMarket from '../../../Styles/Components/FundingMarket.css';
/*
this.props.productTitle
this.props.productType
this.props.sortMethod
* */
class ProductRanking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listTitle: 1,
        }
        this.handleTab = this.handleTab.bind(this);
    }
    handleTab(num) {
        this.setState({
            listTitle: num,
        });
    }
    render() {
        return (
            <div className={stylesFundingMarket.rankSection}>
                <div className={stylesFundingMarket.rankingBody + ' ' + styles.fullScreen}>
                    <FundingMarketList title={this.props.productTitle[0]} isFunding={this.props.isFunding} isNormal={this.props.isNormal} isVideo={this.props.isVideo} sortMethod={this.props.sortMethod[0]} sort={'desc'} />
                    <FundingMarketList title={this.props.productTitle[1]} isFunding={this.props.isFunding} isNormal={this.props.isNormal} isVideo={this.props.isVideo} sortMethod={this.props.sortMethod[1]} sort={'desc'} />
                    <FundingMarketList title={this.props.productTitle[2]} isFunding={this.props.isFunding} isNormal={this.props.isNormal} isVideo={this.props.isVideo} sortMethod={this.props.sortMethod[2]} sort={'desc'} />
                </div>
                <ul className={stylesFundingMarket.fundingMarketTab + ' ' + styles.mobileScreen}>
                    <li className={(this.state.listTitle === 1 ? stylesFundingMarket.active : '')} onClick={() => this.handleTab(1)}>{this.props.productTitle[0]}</li>
                    <li className={(this.state.listTitle === 2 ? stylesFundingMarket.active : '')} onClick={() => this.handleTab(2)}>{this.props.productTitle[1]}</li>
                    <li className={(this.state.listTitle === 3 ? stylesFundingMarket.active : '')} onClick={() => this.handleTab(3)}>{this.props.productTitle[2]}</li>
                </ul>
                <div className={stylesFundingMarket.mobileFundingMarketBody + ' ' + styles.mobileScreen}>
                    { this.state.listTitle === 1 ? <FundingMarketList isNormal={this.props.isNormal} isFunding={this.props.isFunding} isVideo={this.props.isVideo} title={''} sortMethod={this.props.sortMethod[0]} sort={'desc'} /> : null}
                    { this.state.listTitle === 2 ? <FundingMarketList isNormal={this.props.isNormal} isFunding={this.props.isFunding} isVideo={this.props.isVideo} title={''} sortMethod={this.props.sortMethod[1]} sort={'desc'} /> : null}
                    { this.state.listTitle === 3 ? <FundingMarketList isNormal={this.props.isNormal} isFunding={this.props.isFunding} isVideo={this.props.isVideo} title={''} sortMethod={this.props.sortMethod[2]} sort={'desc'} /> : null}
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(ProductRanking));
