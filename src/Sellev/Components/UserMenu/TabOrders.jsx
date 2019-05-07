import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import InfiniteList from '../ListLoader/InfiniteList';

// Styles
import styleUser from '../../Styles/Components/UserMenu.css';
import styles from '../../Styles/App.css';

//Action
import * as ActionPayment from '../../Data/Payment/action';
import * as  ParseNumber from '../../Lib/Utils/parseNumber';
import * as ActionProduct from "../../Data/Product/action";

// Utils
import * as DateUtil from '../../Lib/Utils/date';

class TabOrders extends React.Component {
    constructor(props) {
        super(props);
        this.params = {
            from: 0,
            count: 20,
            userId: this.props.author && this.props.author.user ? this.props.author.user.userId : '',
        }
    }
    componentWillReceiveProps(nextProps) {
        if (!this.props.author || !this.props.author.user) {
            this.params = {
                from: 0,
                count: 20,
                userId: nextProps.author && nextProps.author.user ? nextProps.author.user.userId : '',
            };
            setTimeout(() => {
                this.orderList.reset();

            })
        }
    }
    render() {
        let orderList = (item, index) => {
            return (
                <div className={styleUser.myOrderBox} key={index}>
                    <div className={styleUser.myOrderHeader}>
                        <div className={styleUser.orderTitle}>{DateUtil.format(item.createdAt, 'LT')} 주문번호 {item.invoiceId}</div>
                        <div className={styleUser.orderStatus}>{item.status}</div>
                    </div>
                    <div className={styleUser.myOrderBody}>
                        <ul className={styleUser.myOrderBodyLeft}>
                            <li>{item.orderProducts && item.orderProducts[0].product ? item.orderProducts[0].product.title : '-'}</li>
                            <li>옵션:{item.option} / 수량:{item.quantity}</li>
                            <li>{ParseNumber.numberWithCommas(item.price)}<span>{item.paidBy}</span></li>
                        </ul>
                        <ul className={styleUser.myOrderBodyRight}>
                            <li>
                                <img className={styleUser.productImgScale} src={"/assets/img/img_payment.png"} />
                                <div className={styleUser.userImage} style={{ backgroundImage: 'url("/assets/img/img_payment.png")' }} />
                            </li>
                            {/*.replace('original', '200x200') 데이터 바인딩할때 이미지사이즈 조절해주세요*/}
                        </ul>
                    </div>
                </div>
            );
        }
        let emptyList = (
            <div>내역이 없습니다.</div>
        )
        return (
            <InfiniteList onRef={(ref) => this.orderList = ref} listName={'invoices'} ListItem={orderList} EmptyText={emptyList} Get={ActionPayment.getInvoiceList} GetParams={this.params} />
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(TabOrders));