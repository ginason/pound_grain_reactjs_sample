import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import UserBox from '../../../Common/UserBox';

// Actions
import * as ActionUser from '../../../Data/User/actions';
import * as ActionAuth from '../../Data/Authentification/actions';


// Styles
import styles from '../../../Styles/App.css';
import stylesContentList from '../../../Styles/Components/ContentList.css';

// Utils
import * as parseNumber from '../../../Lib/Utils/parseNumber';
import * as parseUrlParameter from '../../../Lib/Utils/parseUrlParameter';
import * as ActionAuth from "../../../Data/Authentification/actions";

/*
* this.props.user
* */
class ProfileHeader extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type || 1, // (임의값) 일반사용자: 1, 셀레버: 2
            isMyAccount: false,
            isFollow: false, // sellever follow 여부
            followerList: [],
            followingList: [],
        }

        this.updateMyProfile = this.updateMyProfile.bind(this);
        this.handleFollowSellever = this.handleFollowSellever.bind(this);
        this.getFollowerList = this.getFollowerList.bind(this);
        this.getFollowingList = this.getFollowingList.bind(this);
    }
    componentWillMount() {
        let params = parseUrlParameter.parse(this.props.location.search);
        let userId = params.userId;

        if (!userId || userId === this.props.author.user.userId) {
            this.setState({
                isMyAccount: true,
            })
        }
        this.getFollowerList(userId);
        this.getFollowingList(userId);
    }
    componentWillReceiveProps(nextProps) {
        let params = parseUrlParameter.parse(this.props.location.search);
        let userId = params.userId;
        if (!userId || userId === nextProps.author.user.userId) {
            this.setState({
                isMyAccount: true,
            })
        }
        this.getFollowerList(userId);
        this.getFollowingList(userId);
    }
    getFollowerList(userId) {
        this.props.dispatch(ActionUser.getFollowerList(userId))
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        followerList: response.data.users,
                    })
                    for (let i=0; i < response.data.users.length; i++) {
                        if (response.data.users[i].userId === this.props.author.user.userId) {
                            this.setState({
                                isFollow: true,
                            })
                        }
                    }
                }
            })
    }
    getFollowingList(userId) {
        this.props.dispatch(ActionUser.getFollowingList(userId))
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        followingList: response.data.users,
                    })
                }
            })
    }
    updateMyProfile() {
        alert('업데이트');
    }

    handleFollowSellever() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        let params = {
            userIdTo: this.props.user.userId,
            following: !this.state.isFollow,
        }
        ActionUser.followUser(params)
            .then((response) => {
                this.setState({
                    isFollow: !this.state.isFollow,
                })
                this.getFollowerList(this.props.user.userId);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    render() {
        return (
            <div className={stylesContentList.profileHeader}>
                <div className={stylesContentList.bgFilter}></div>
                <div className={stylesContentList.bgImageBox} style={{ backgroundImage: this.props.user ? 'url("' + this.props.user.coverUrl + '")' : 'url("/assets/img/img_user.png")' }}></div>
                <div className={stylesContentList.profileBox}>
                    {this.props.user ?
                        <div className={stylesContentList.profile}>
                            <UserBox profile={this.props.user.profileUrl} size={'108px'} />
                        </div>
                        :
                        null
                    }
                    <div className={stylesContentList.name}>{this.props.user ? this.props.user.name : '이름없음'}</div>
                    {
                        this.props.location.pathname === '/myhome' ?
                            <div className={stylesContentList.count}>
                                Following
                                {(this.state.followingList.length > 0 ? ' ' + parseNumber.numberWithCommas(this.state.followingList.length) : 0)}
                            </div>
                            :
                            <div className={stylesContentList.count}>
                                Follower
                                {(this.state.followerList.length > 0 ? ' ' + parseNumber.numberWithCommas(this.state.followerList.length) : 0)}
                            </div>
                    }
                    {
                        this.state.isMyAccount ?
                            <div className={stylesContentList.btn} onClick={this.updateMyProfile}>
                                <span>수정</span>
                            </div>
                            :
                            <div className={stylesContentList.btn + (this.state.isFollow ? ' ' + stylesContentList.btnRed : '')} onClick={this.handleFollowSellever}>
                                {this.state.isFollow ? <div className={styles.checkIcon + ' ' + stylesContentList.followCheck} /> : null }
                                <span>팔로우</span>
                            </div>
                    }
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(ProfileHeader));