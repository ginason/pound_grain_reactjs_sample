import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

// Components
import UserBox from '../../Common/UserBox';
// Styles
import styles from '../../Styles/App.css';
import styleNotification from '../../Styles/Components/Notification.css';
// Actions
import * as ActionNotification from "../../Data/Notification/actions";
import * as DateUtil from '../../Lib/Utils/date';

class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            nonChecked: 0,
        }
        this.goProduct = this.goProduct.bind(this);
        this.handleAlarm = this.handleAlarm.bind(this);
    }
    componentWillMount() {
        let params = {
            from: 0,
            count: 20,
        };
        ActionNotification.getNotificationList(params)
            .then((response) => {
                console.log(response);
                this.setState({
                    list: response.data.notifications,
                })
                setTimeout(() => {
                if (this.state.list && this.state.list.length > 0) {
                    let length = 0;
                    for (let i = 0; i < this.state.list.length; i++) {
                        if (!this.state.list[i].isChecked) {
                            length = length + 1;
                        }
                    }
                    this.setState({
                        nonChecked: length,
                    })
                }
            }, 100);
         });

    }
    handleAlarm(notificationId) {
        ActionNotification.notificationUpdate({
            notificationId: notificationId,
            isChecked: 1,
        }).then((response) => {
            if(response.code === 200) {
                this.setState({
                    nonChecked: (this.state.nonChecked - 1),
                })
            }
        })
    }
    goProduct(type, productId, isChecked, notificationId) {
        if(isChecked === 0) {
            this.handleAlarm(notificationId);
        }

        if(type === 0){
            this.props.history.push('/fundingmarket/market?productId=' + productId);
        } else if(type === 1) {
            this.props.history.push('/fundingmarket/funding?productId=' + productId);
        } else if (type === 2) {
            this.props.history.push('/video/detail?productId=' + productId);
        } else {
            this.props.history.push('/sellever?userId=' + productId);
        }


    }
    render() {
        let alarmList = this.state.list.map((item, index) => {
            if(item && item.ntype) {
                if (item.ntype === 'PRODUCT_NEW') {
                    if(item.productInfo && item.productInfo.store && item.productInfo.store.userId){
                        return (
                            <li key={index}>
                                <div onClick={() => this.goProduct('', item.productInfo.store.userId, item.isChecked, item.notificationId)} className={styleNotification.userImageBox}>
                                    <UserBox size={'46px'} profile={item.productInfo.store.profileUrl}/>
                                </div>
                                <div onClick={() => this.goProduct(item.type, item.productInfo.productId, item.isChecked, item.notificationId)} className={styleNotification.userCondition}>
                                    <div><span>{(item.productInfo && item.productInfo.store && item.productInfo.store.name ? item.productInfo.store.name : '이름없음')}</span>님이 새 포스팅을 올렸습니다.</div>
                                    <span>{countTime(item.createdAt)}</span>
                                </div>
                            </li>
                        );
                    }
                } else if (item.ntype === 'PRODUCT_COMMENT') {
                    if(item.productInfo && item.productInfo.store && item.productInfo.store.userId) {
                        return (
                            <li key={index}>
                                <div onClick={() => this.goProduct('', item.productInfo.store.userId, item.isChecked, item.notificationId)}>
                                    <UserBox size={'46px'} profile={item.productInfo.store.profileUrl}/>
                                </div>
                                <div onClick={() => this.goProduct(item.type, item.productInfo.productId, item.isChecked, item.notificationId)} className={styleNotification.userCondition}>
                                    <div>
                                        <span>{(item.productInfo && item.productInfo.store && item.productInfo.store.name ? item.productInfo.store.name : '이름없음')}</span>님이
                                        댓글에서 회원님을 언급했습니다
                                    </div>
                                    <span>{countTime(item.createdAt)}</span>
                                </div>
                            </li>
                        )
                    }
                } else if (item.ntype === 'FUNDING_COMPLETE') {
                    return (
                        <li key={index}>
                            <div onClick={() => this.goProduct('', item.productInfo.store.userId, item.isChecked, item.notificationId)}>
                                <UserBox size={'46px'} profile={item.productInfo && item.productInfo.store ? item.productInfo.store.profileUrl : '/assets/img/img_profile_default.png'}/>
                            </div>
                            <div onClick={() => this.goProduct(item.type, item.productInfo.productId, item.isChecked, item.notificationId)} className={styleNotification.userCondition}>
                                <div><span>'{(item.productInfo && item.productInfo.title ? item.productInfo.title : '이름없음')}'</span>펀딩의 마감이 {DateUtil.getLeftDays(item.typeInfo ? item.typeInfo.endAt : 0)}일 남았습니다</div>
                                <span>{countHour(item.createdAt)}</span>
                            </div>
                        </li>
                    )
                } else if (item.ntype === 'FOLLOWING') {
                    if (item.userInfo && item.userInfo.userId) {
                        if (item.notificationId) {
                            return (
                                <li key={index}>
                                    <div onClick={() => this.goProduct('', item.userInfo.userId, item.isChecked, item.notificationId)}>
                                        <UserBox size={'46px'} profile={item.userInfo.profileUrl}/>
                                    </div>
                                    <div onClick={() => this.goProduct('', item.userInfo.userId, item.isChecked, item.notificationId)}
                                         className={styleNotification.userCondition}>
                                        <div>
                                            <span>{(item.user && item.userInfo.name ? item.userInfo.name : '이름없음')}</span>님을
                                            팔로우합니다.
                                        </div>
                                        <span>{countTime(item.createdAt)}</span>
                                    </div>
                                </li>
                            )
                    }
                }
                }else {
                    return (
                        <li key={index}>
                            <div onClick={() => this.goProduct('', item.productInfo.store.userId, item.isChecked, item.notificationId)}>
                                <UserBox size={'46px'} profile={item.productInfo && item.productInfo.store ? item.productInfo.store.profileUrl : '/assets/img/img_profile_default.png'} />
                            </div>
                            <div onClick={() => this.goProduct(item.type, item.productInfo.productId, item.isChecked, item.notificationId)} className={styleNotification.userCondition}>
                                <div><span>'{(item.productInfo && item.productInfo.title ? item.productInfo.title : '이름없음')}'</span>펀딩이 마감되었습니다.</div>
                                <span>{countTime(item.createdAt)}</span>
                            </div>
                        </li>
                    )
                }
            }
        })
        return (
            <div className={styleNotification.notificationBox}>
                <div className={styleNotification.notificationHeader}>
                    <div className={styleNotification.title}>알림</div>
                    <span className={styleNotification.alarmNumMobile}>{this.state.nonChecked}</span>
                    <span className={styleNotification.subTitle}>회원님의 활동과 관련한 소식을 알려드립니다.</span>
                </div>
                <ul className={styleNotification.notificationBody}>
                    {alarmList}
                </ul>
            </div>
        );
    }
}
let countTime = (date) => {
    if(DateUtil.countDays(date) === 0){
        return moment(date, 'm').fromNow();
    } else {
        return DateUtil.format('ll' ,date)
    }
}
let countHour = (date => {
    return moment().diff(moment(date), 'h');
})
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(Notification));