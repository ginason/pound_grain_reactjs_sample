import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

//Components
import ImageList from '../ContentList/ImageList/index';

// Styles
import styleUser from '../../Styles/Components/UserMenu.css';
import styles from '../../Styles/App.css';

//Action
import * as ActionPayment from '../../Data/Payment/action';

class MyFunding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fundingList: [],
            countProduct: 0,
        }
        this.fundingInvoice = [];
    }
    componentWillMount() {
        if(this.props.author && this.props.author.user) {
            let totalCount =0;
            let count = 0;
            let today = new Date();
            let userId = this.props.author.user.userId;
            let params = {
                from: 0,
                count: 20,
                sortMethod: 'paidAt ',
                sort: 'desc',
                userId: userId,
            };
            this.props.dispatch(ActionPayment.getInvoiceList(params))
                .then((response) => {
                    if(response.code === 200) {
                        console.log(response);
                        this.setState({
                            fundingList: response.data.invoices,
                        })
                        let fundingInvoice = response.data.invoices;
                        if(fundingInvoice && fundingInvoice.length > 0) {
                            for(let j=0; j < fundingInvoice.length; j++) {
                                let item = fundingInvoice[j];
                                if(item && item.orderFundings && item.orderFundings.length > 0) {
                                    count = item.orderFundings.length;
                                    totalCount = count + totalCount;
                                    this.setState({
                                        countProduct: totalCount,
                                    })
                                }
                            }
                        }
                    }
                })
        }
    }
    render() {
        let fundingList = this.state.fundingList && this.state.fundingList.length > 0 ? (this.state.fundingList.map((item, index) => {
            if(item.orderFundings && item.orderFundings.length > 0) {
                for(let i = 0; i < item.orderFundings.length; i++) {
                    if(item.orderFundings[i].product) {
                        return (
                            <div className={styleUser.myFundingBox} key={index}>
                                <ImageList type={'fundingmarket'} listItem={item.orderFundings[i].product} />
                            </div>
                        )
                    } else {
                        return (<div>참여펀딩이 없습니다.</div>);
                    }
                }
            }
        }))
        : <div className={styleUser.noProductText}>참여펀딩이 없습니다.</div>;
        return (
            <div className={styleUser.userMenuContainer}>
                <div className={styleUser.userMenuHeader}>
                    <div className={styles.redPoint + ' ' + styles.fullScreen} />
                    <div className={styleUser.menuTitle}>
                        참여<br />
                        펀딩현황
                        <span className={styles.red}>{this.state.countProduct}</span>
                    </div>
                </div>
                <div className={styleUser.userMenuBody}>
                    {fundingList}
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(MyFunding));