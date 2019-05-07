import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

//Style
import stylesDetail from '../../Styles/Components/FundingMarket.css';
import styles from '../../Styles/App.css';

//Action
import * as ActionDate from '../../Lib/Utils/date';
import * as NumberUtil from "../../Lib/Utils/parseNumber";

const mql = window.matchMedia('(max-width: 768px)');

class DetailContentSide extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isSelect: 1,
            mediaQuery: mql.matches,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleOption = this.handleOption.bind(this);
    }
    handleOption(num) {
        this.setState({
            isSelect: num,
        });
    }
    componentWillMount() {
        mql.addListener(this.handleChange);
    }
    handleChange() {
        this.setState({
            mql: mql,
        });
        if (this.state.mql.matches) {
            this.setState({
                mediaQuery: true,
            });
        } else {
            this.setState({
                mediaQuery: false,
            });
        }
    }
    render() {
        let fundingOption = this.props.listItem && this.props.listItem.optionInfo ? (this.props.listItem.optionInfo.map((item, index) => {
            return(
                <li key={index}>
                    <div className={stylesDetail.selectorBox}>
                        <div className={stylesDetail.sideSelector}><span>{item.saleAmount}명</span>이 선택</div>
                    </div>
                    <div onClick={() => this.handleOption(index)} className={stylesDetail.selectFunding + ' ' + (this.state.mediaQuery ? (this.state.isSelect === (index + 1) ?  styles.checkMobile : styles.noneCheckMobile) : (this.state.isSelect === (index + 1) ? styles.checkIcon : styles.noneCheckIcon))} />
                    <div className={stylesDetail.sidePrice}>{NumberUtil.numberWithCommas(item.price)}<span>원</span></div>
                    <div>
                        <div>{item.title}</div>
                        <div>{item.product}</div>
                    </div>
                    <div className={stylesDetail.sideInfo}>
                        <span>배송비</span>
                        <span>{NumberUtil.numberWithCommas(item.deliveryPrice)}원</span>
                    </div>
                    <div className={stylesDetail.sideInfo}>
                        <span>상품발송일</span>
                        <span>{ActionDate.format('dash',item.deliverAt)}</span>
                    </div>
                    <div className={stylesDetail.sideInfo}>
                        <span>제한수량</span>
                        <span>{item.inventoryQuantity}개</span>
                    </div>
                </li>
            );
        })) : null;
        return (
            <div className={stylesDetail.detailContentSideBox}>
                <div className={stylesDetail.contentTitle}>펀딩을 선택해보세요</div>
                <ul className={stylesDetail.detailContentSideList}>
                    {fundingOption}
                </ul>
                {/*full screen version*/}
                <div className={stylesDetail.fullScreen}>
                    <Link to={'/payment'}>
                        <div className={styles.btn47Black + ' ' + stylesDetail.fundingBtn}>펀딩하기</div>
                    </Link>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(DetailContentSide));
