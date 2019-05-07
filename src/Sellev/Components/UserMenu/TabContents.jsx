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

class TabContents extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderList: [
                {
                    createdAt: '2017-10-24',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
                {
                    createdAt: '2017-10-25',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
                {
                    createdAt: '2017-10-26',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
                {
                    createdAt: '2017-10-27',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
                {
                    createdAt: '2017-10-28',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
                {
                    createdAt: '2017-10-29',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
                {
                    createdAt: '2017-10-30',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
                {
                    createdAt: '2017-11-01',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
                {
                    createdAt: '2017-11-02',
                    title: '방탄소년단 바캉스 특집 영상 풀MV 한정판',
                    optionTitle: '겨울 바캉스 ver.1',
                    fileTitle: 'BTS_겨울 바캉스_ver1.wmv',
                    size: 1.71,
                },
            ]
        }
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
            this.orderList.reset();
        }
    }
    render() {
        let orderList = (item, index) => {
            return (
                <div className={styleUser.tableContentItem} key={index}>
                    <div
                        className={styleUser.column}
                        style={{ width: ActionPayment.TAB_CONTENTS.COLUMN_SIZE[0] }}
                    >
                        {item.createdAt}
                    </div>
                    <div
                        className={styleUser.column}
                        style={{ width: ActionPayment.TAB_CONTENTS.COLUMN_SIZE[1] }}
                    >
                        <div className={styleUser.title + ' ' + styleUser.bold}>
                            {item.title}
                        </div>
                        <div className={styleUser.optionTitle}>
                            {item.optionTitle}
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
        let testOrderList = this.state.orderList && this.state.orderList.length > 0 ? this.state.orderList.map((item, index) => {
            return orderList(item, index);
            }) : null;
        let renderTableHeader = ActionPayment.TAB_CONTENTS.COLUMN_SIZE.map((size, index) => {
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
            <div>내역이 없습니다.</div>
        )
        return (
            <div className={styleUser.contentsTable}>
                <div className={styleUser.tableBox}>
                    <li className={styleUser.tableHeader}>
                        {renderTableHeader}
                    </li>
                    {testOrderList}
                </div>
            </div>

/*
            <InfiniteList onRef={(ref) => this.orderList = ref} listName={'invoices'} ListItem={orderList} EmptyText={emptyList} Get={ActionPayment.getInvoiceList} GetParams={this.params} />
*/

        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(TabContents));