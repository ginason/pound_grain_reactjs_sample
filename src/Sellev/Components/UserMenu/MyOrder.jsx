import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import TabOrders from './TabOrders';
import TabContents from './TabContents';
import InfiniteList from '../ListLoader/InfiniteList';

// Styles
import styleUser from '../../Styles/Components/UserMenu.css';
import styles from '../../Styles/App.css';

//Action
import * as ActionPayment from '../../Data/Payment/action';
import * as  ParseNumber from '../../Lib/Utils/parseNumber';

// Utils
import * as DateUtil from '../../Lib/Utils/date';

class MyOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderList: [],
            displayTab: 1,
            user: '',
        }
    }
    componentWillMount() {
        let params = {
            from: 0,
            count: 20,
        };
        this.setState({
            user: this.props.author ? this.props.author.user : '',
        })
        console.log(this.state.user);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            user: nextProps.author ? nextProps.author.user : '',
        }, () => {
            setTimeout(() => {
                this.orderList.reset();
            }, 100)

        });


    }
    /*shouldComponentUpdate(nextProps) {
        console.log('ddddddddddddddddddddd');
        console.log(nextProps.author);
        console.log(this.props.author);
        if (nextProps.author !== this.props.author) {
            this.setState({
                user: nextProps.author.user
            }, () => {
                setTimeout(() => {
                    if (this.orderList) this.orderList.reset();
                    return true;
                }, 100);
            })
        }
        return false;
    }*/
    handleTabItem(index) {
        this.setState({
            displayTab: index,
        })
    }
    render() {
        let renderOrderList = (item, index) => {
            console.log(item);
            console.log("renderOrderList");
            return (
                <div className={styleUser.myOrderBox} key={index}>
                    <div className={styleUser.myOrderHeader}>
                        <div className={styleUser.orderTitle}>{DateUtil.format('dash', item.createdAt)} 주문번호 {item.invoiceId}</div>
                        <div className={styleUser.orderStatus}>{ActionPayment.PAYMENT_STATE[item.status]}</div>
                    </div>
                    <div className={styleUser.myOrderBody}>
                        {
                            item.orderProducts && item.orderProducts.length > 0 ?
                                <ul className={styleUser.myOrderBodyLeft}>
                                    <li>{item.orderProducts[0].product ? item.orderProducts[0].product.title : '-'}</li>
                                    <li>옵션:{item.orderProducts[0].option ? item.orderProducts[0].option.title : '-'} / 수량:{item.orderProducts[0].quantity}</li>
                                    <li>{ParseNumber.numberWithCommas(item.orderProducts[0].price)}<span>{item.paidBy}</span></li>
                                </ul> : null
                        }
                        {
                            item.orderFundings && item.orderFundings.length > 0 ?
                                <ul className={styleUser.myOrderBodyLeft}>
                                    <li>{item.orderFundings[0].product ? item.orderFundings[0].product.title : '-'}</li>
                                    <li>옵션:{item.orderFundings[0].option ? item.orderFundings[0].option.title : '-'} / 수량:{item.orderFundings[0].quantity}</li>
                                    <li>{ParseNumber.numberWithCommas(item.orderFundings[0].price)}<span>{item.paidBy}</span></li>
                                </ul> : null
                        }
                        {
                            item.orderProducts && item.orderProducts.length > 0 ?
                                <ul className={styleUser.myOrderBodyRight}>
                                    <li>
                                        {/*스타일 이름이 바뀐거 같아서 나중에 수정해주세요.*/}
                                        {/*<img className={styleUser.productImgScale} src={item.orderProducts[0].product && item.orderProducts[0].product.imageUrl ? item.orderProducts[0].product.imageUrl : "/assets/img/img_payment.png"} />
                                        <div className={styleUser.userImage} style={{ backgroundImage: 'url("' + (item.userInfo ? item.userInfo.profileUrl : '/assets/img/img_profile_default.png') + '")' }} />*/}
                                        <img className={styleUser.productImgScale} src={item.orderProducts[0].product && item.orderProducts[0].product.imageUrl ? item.orderProducts[0].product.imageUrl.replace('original', '200x200') : "/assets/img/img_payment.png"} />
                                        <div className={styleUser.userImage} style={{ backgroundImage: 'url("' + (item.orderProducts[0].product && item.orderProducts[0].product.imageUrl ? item.orderProducts[0].product.imageUrl.replace('original', '200x200') : "/assets/img/img_payment.png") + '")' }} />
                                    </li>
                                    {/*.replace('original', '200x200') 데이터 바인딩할때 이미지사이즈 조절해주세요*/}
                                </ul> : null
                        }
                        {
                            item.orderFundings && item.orderFundings.length > 0 ?
                                <ul className={styleUser.myOrderBodyRight}>
                                    <li>
                                        <img className={styleUser.productImgScale} src={item.orderFundings[0].product && item.orderFundings[0].product.imageUrl ? item.orderFundings[0].product.imageUrl.replace('original', '200x200') : "/assets/img/img_payment.png"} />
                                        <div className={styleUser.userImage} style={{ backgroundImage: 'url("' + (item.orderFundings[0].product && item.orderFundings[0].product.imageUrl ? item.orderFundings[0].product.imageUrl.replace('original', '200x200') : "/assets/img/img_payment.png") + '")' }} />
                                    </li>
                                </ul> : null
                        }
                    </div>
                </div>
            );
        }
        let renderContentsList = (item, index) => {
            return (
                <div className={styleUser.tableContentItem} key={index}>
                    <div
                        className={styleUser.column}
                        style={{ width: ActionPayment.TAB_CONTENTS.COLUMN_SIZE[0] }}
                    >
                        {DateUtil.format('point', item.createdAt)}
                    </div>
                    <div
                        className={styleUser.column}
                        style={{ width: ActionPayment.TAB_CONTENTS.COLUMN_SIZE[1] }}
                    >
                        <div className={styleUser.title + ' ' + styleUser.bold}>
                            {item.orderProducts && item.orderProducts.length > 0 ? (item.orderProducts[0].product ? item.orderProducts[0].product.title : '-') : null}
                        </div>
                        <div className={styleUser.optionTitle}>
                            {item.orderProducts && item.orderProducts.length > 0 ? (item.orderProducts[0].option ? item.orderProducts[0].option.title : '-') : null}
                        </div>
                    </div>
                    <div
                        className={styleUser.column}
                        style={{ width: ActionPayment.TAB_CONTENTS.COLUMN_SIZE[2] }}
                    >
                        <div className={styleUser.title}>
                            {item.fileTitle}
                        </div>
                        <div className={styleUser.optionTitle}>
                            {item.size}MB
                        </div>
                    </div>
                    <div
                        className={styleUser.column + ' ' + styleUser.center}
                        style={{ width: ActionPayment.TAB_CONTENTS.COLUMN_SIZE[3] }}
                    >
                        <img src={'/assets/img/btn_download.png'} className={styleUser.downloadBtn} />
                    </div>
                </div>
            );
        }
        let renderContentsHeader = ActionPayment.TAB_CONTENTS.COLUMN_SIZE.map((size, index) => {
            return (
                <div
                    className={styleUser.column + (index == 3 ? ' ' + styleUser.center : '')}
                    style={{ width: ActionPayment.TAB_CONTENTS.COLUMN_SIZE[index] }}
                    key={index}
                >
                    {ActionPayment.TAB_CONTENTS.COLUMN_NAME[index]}
                </div>
            );
        })
        let emptyList = (
            <div>구매내역이 없습니다.</div>
        )
        return (
            <div className={styleUser.userMenuContainer}>
                <div className={styleUser.userMenuHeader}>
                    <div className={styles.redPoint + ' ' + styles.fullScreen} />
                    <div className={styleUser.menuTitle}>
                        구매내역
                    </div>
                    <div className={styleUser.menuContent}>
                        <div className={styleUser.section}>
                            <div onClick={() => this.handleTabItem(1)} className={styleUser.item + (this.state.displayTab === 1 ? ' ' + styleUser.active : '')}>결제내역</div>
                            <div onClick={() => this.handleTabItem(2)} className={styleUser.item + (this.state.displayTab === 2 ? ' ' + styleUser.active : '')}>구매한 콘텐츠</div>
                        </div>
                        <div className={styleUser.border} />
                        <div className={styleUser.section}>
                            <div onClick={() => this.handleTabItem(3)} className={styleUser.item + (this.state.displayTab === 3 ? ' ' + styleUser.active : '')}>코인 구매내역</div>
                            <div onClick={() => this.handleTabItem(4)} className={styleUser.item + (this.state.displayTab === 4 ? ' ' + styleUser.active : '')}>코인 사용내역</div>
                        </div>
                        <div className={styleUser.border} />
                        <div className={styleUser.section}>
                            <div onClick={() => this.handleTabItem(5)} className={styleUser.item + (this.state.displayTab === 5 ? ' ' + styleUser.active : '')}>포인트 적립내역</div>
                            <div onClick={() => this.handleTabItem(6)} className={styleUser.item + (this.state.displayTab === 6 ? ' ' + styleUser.active : '')}>포인트 사용내역</div>
                        </div>
                    </div>
                </div>
                <div className={styleUser.userMenuBody}>
                    { this.state.displayTab === 1 && (this.state.user) ? <InfiniteList onRef={(ref) => this.orderList = ref} listName={'invoices'} ListItem={renderOrderList} EmptyText={emptyList} Get={ActionPayment.getInvoiceList}
                                                                  GetParams={{
                                                                      userId: this.state.user ? this.state.user.userId : ''
                                                                  }} /> : null }
                    { this.state.displayTab === 2 ?
                        <div className={styleUser.contentsTable}>
                            <div className={styleUser.tableBox}>
                                <li className={styleUser.tableHeader}>
                                    {renderContentsHeader}
                                </li>
                                <InfiniteList onRef={(ref) => this.contentsList = ref} listName={'invoices'} ListItem={renderContentsList} EmptyText={emptyList} Get={ActionPayment.getInvoiceList}
                                              GetParams={{
                                                  userId: this.state.user ? this.state.user.userId : ''
                                              }} />
                            </div>
                        </div>
                         : null }
                    { this.state.displayTab === 3 ? emptyList : null }
                    { this.state.displayTab === 4 ? emptyList : null }
                    { this.state.displayTab === 5 ? emptyList : null }
                    { this.state.displayTab === 6 ? emptyList : null }
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(MyOrder));