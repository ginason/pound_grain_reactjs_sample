import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import DetailList from '../ContentList/DetailList/index';
import UserBox from '../../Common/UserBox';

// Styles
import styles from '../../Styles/App.css';
import stylesMyHome from '../../Styles/Components/MyHome.css';
import stylesContentList from '../../Styles/Components/ContentList.css'

// Actions
import * as ActionUser from '../../Data/User/actions';
import * as ActionAuth from '../../Data/Authentification/actions';

// Utils
import * as parseUrlParameter from '../../Lib/Utils/parseUrlParameter';
import * as parseNumber from "../../Lib/Utils/parseNumber";

const mql = window.matchMedia('(max-width: 768px)');
class Sellever extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mql: mql,
            mediaQuery: mql.matches,
            user: [],
            isFollow: false,
            followerList: [],
            followingList: [],
        }

        this.handleFollowSellever = this.handleFollowSellever.bind(this);
        this.getSellever = this.getSellever.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        window.scrollTo(0, 0);
        mql.addListener(this.handleChange);
        this.getSellever(this.props.location.search);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.search !== this.props.location.search){
            window.scrollTo(0, 0);
            this.getSellever(nextProps.location.search);
            return true;
        }
        if (nextState !== this.state) {
            return true;
        }
        return false;
    }
    getSellever(search) {
        let urlParams = parseUrlParameter.parse(search);
        if (!urlParams.userId || !urlParams.userId.match(/^[0-9]*$/)) {
            alert(ActionAuth.USER_NOT_EXIST_MESSAGE);
            this.props.history.push('/');
            return;
        }
        let params = {
            userId: urlParams.userId,
            type: 2,
        }
        this.props.dispatch(ActionUser.getUserList(params))
            .then((response) => {
                if (response.code === 200 && response.data && response.data.users && response.data.users.length > 0) {
                    if (response.data.users[0].type !== 2) {
                        this.props.history.push('/myhome?userId=' + response.data.users[0].userId);
                    } else {
                        this.setState({
                            user: response.data.users[0],
                        }, () => {
                            if (this.detailBody) {
                                this.detailBody.getRelatedHashtagList();
                                this.detailBody.getRelatedSelleverList();
                                this.detailBody.getRelatedFundingMarketList();
                                this.detailBody.getRelatedVideoList();
                            }
                        });
                    }
                } else {
                    this.props.history.push('/');
                }
            })
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
    handleFollowSellever() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        let params = {
            userIdTo: this.state.user.userId,
            following: !this.state.user.isFollow,
        }
        ActionUser.followUser(params)
            .then((response) => {
                let newUser = this.state.user;
                newUser.isFollow = !newUser.isFollow;
                if (newUser.isFollow) {
                    newUser.followerAmount = newUser.followerAmount + 1;
                } else {
                    newUser.followerAmount = newUser.followerAmount - 1;
                }
                this.setState({
                    user: newUser,
                }, () => {
                    console.log(this.state.user);
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    render() {
        return (
            <div className={stylesMyHome.myHomeContainer}>
                <div className={stylesContentList.profileHeader}>
                    <div className={stylesContentList.bgFilter}></div>
                    <div className={stylesContentList.bgImageBox} style={{ backgroundImage: this.state.user && this.state.user.coverUrl ? 'url("' + this.state.user.coverUrl + '")' : 'url("/assets/img/img_user.png")' }}></div>
                    <div className={stylesContentList.profileBox}>
                        {this.state.user ?
                            <div className={stylesContentList.profile}>
                                <UserBox profile={this.state.user && this.state.user.profileUrl ? this.state.user.profileUrl : '/assets/img/img_profile_default.png'} size={(this.state.mediaQuery ? '63px':'108px')} />
                            </div>
                            :
                            null
                        }
                        <div className={stylesContentList.name}>{this.state.user && this.state.user.name !== '' ? this.state.user.name : '이름없음'}</div>
                        <div className={stylesContentList.memo}>{this.state.user.memo}</div>
                        <div className={stylesContentList.count}>
                            {(this.state.user ? ' ' + parseNumber.numberWithCommas(this.state.user.followerAmount) : 0)}
                        </div>
                        <div className={stylesContentList.profileText}>팔로워</div>
                        {
                            this.props.author && this.props.author.user ?
                                (
                                    this.props.author.user.userId !== this.state.user.userId ?
                                        (this.state.user && this.state.user.isFollow ?
                                            <div className={stylesContentList.btn + ' ' + stylesContentList.btnGray} onClick={this.handleFollowSellever}>
                                                <div className={styles.followingCheckIcon + ' ' + stylesContentList.followCheck} />
                                                <div className={stylesContentList.followText}>팔로잉</div>
                                            </div>
                                            :
                                            <div className={stylesContentList.btn + ' ' + stylesContentList.btnRed} onClick={this.handleFollowSellever}>
                                                <div className={styles.followPlusIcon + ' ' + stylesContentList.followCheck} />
                                                <div className={stylesContentList.followerText}>팔로우</div>
                                            </div>
                                        )
                                        :
                                        null
                                )
                                :
                                (this.state.user && this.state.user.isFollow ?
                                        <div className={stylesContentList.btn + ' ' + stylesContentList.btnGray} onClick={this.handleFollowSellever}>
                                            <div className={styles.followingCheckIcon + ' ' + stylesContentList.followCheck} />
                                            <div className={stylesContentList.followText}>팔로잉</div>
                                        </div>
                                        :
                                        <div className={stylesContentList.btn + ' ' + stylesContentList.btnRed} onClick={this.handleFollowSellever}>
                                            <div className={styles.followPlusIcon + ' ' + stylesContentList.followCheck} />
                                            <div className={stylesContentList.followerText}>팔로우</div>
                                        </div>
                                )
                        }
                    </div>
                </div>
                <DetailList onRef={(ref) => this.detailBody = ref} paramName={'userId'} paramVal={this.state.user ? this.state.user.userId : ''} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(Sellever));