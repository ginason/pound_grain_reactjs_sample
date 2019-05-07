import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import UserBox from '../../Common/UserBox';
import ImageList from '../ContentList/ImageList/index';
import InfiniteList from '../ListLoader/InfiniteList';
import HashTagCard from '../ContentList/HashhTagCard/index';

// Actions
import * as ActionUser from '../../Data/User/actions';
import * as ActionProduct from "../../Data/Product/action";
import * as ActionAuth from "../../Data/Authentification/actions";

// Styles
import styles from '../../Styles/App.css';
import stylesMyHome from '../../Styles/Components/MyHome.css';
import stylesContentList from '../../Styles/Components/ContentList.css';

// Utils
import * as parseUrlParameter from '../../Lib/Utils/parseUrlParameter';
import * as parseNumber from "../../Lib/Utils/parseNumber";
import * as ActionHashTag from "../../Data/HashTag/actions";
const mql = window.matchMedia('(max-width: 768px)');
class MyHomeHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mql: mql,
            mediaQuery: mql.matches,
            user: {},
            isMyAccount: false,
            displayTab: 1,
            isFollow: false,
            followingList: [],
            propsTest: '',

            webUser: '',
            isWeb: false,
            webSearch: '',

            myInfo: [],
        }

        this.getUser = this.getUser.bind(this);
        this.handleTabComponent = this.handleTabComponent.bind(this);
        this.handleFollow = this.handleFollow.bind(this);
        this.isMine = this.isMine.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.goSetting = this.goSetting.bind(this);
    }
    componentWillMount() {
        // 하이브리드 앱 관련 코드
        if (this.props.isWebview) {
            let urlParams = parseUrlParameter.parse(this.props.location.search);
            this.setState({
                isWeb: urlParams.isWebview,
                webUser: urlParams.userId,
                webSearch: '?userId=' + urlParams.userId,
            });
            setTimeout(() => {
                this.getUser(this.state.webSearch);
            }, 100)
        } else {
            this.getUser(this.props.location.search);
            setTimeout(() => {
                this.setState({
                    myInfo: this.props.author,
                })
            }, 100)
        }
        window.scrollTo(0, 0);
        mql.addListener(this.handleChange);
    }
    componentDidMount() {
        this.setState({
            myInfo: this.props.author,
        });

    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.search !== this.props.location.search) {
            window.scrollTo(0, 0);
            this.getUser(nextProps.location.search);
            return true;
        }
        if (nextState !== this.state) {
            return true;
        }
        return false;
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
    getUser(search) {
        let urlParams = parseUrlParameter.parse(search);
        console.log('');
        console.log(urlParams);
        if (!urlParams.userId || !urlParams.userId.match(/^[0-9]*$/)) {
            alert(ActionAuth.USER_NOT_EXIST_MESSAGE);
            this.props.history.push('/');
            return;
        }
        this.props.dispatch(ActionUser.getUserList(urlParams))
            .then((response) => {
                console.log(response);
                if (response.code === 200 && response.data && response.data.users && response.data.users.length > 0) {
                    if (response.data.users[0].type !== 0) {
                        this.props.history.push('/sellever?userId=' + response.data.users[0].userId);
                    } else {
                        this.setState({
                            user: response.data.users[0],
                        }, () => {
                            if (this.followingList) this.followingList.reset();
                            if (this.followerList) this.followerList.reset();
                            if (this.hashtagList) this.hashtagList.reset();
                            if (this.fundingMarketList) this.fundingMarketList.reset();
                            if (this.videoList) this.videoList.reset();
                        });
                    }
                } else {
                    this.props.history.push('/');
                }
            });
        if (this.isMine(this.props.author) || (Number(urlParams.displayTab) !== 4 && Number(urlParams.displayTab) !==5)) {
            this.setState({
                displayTab: Number(urlParams.displayTab) || 1,
            });
        }
    }
    handleTabComponent(index) {
        this.setState({
            displayTab: index,
        })
    }
    handleFollow() {
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
    isMine(author) {
        if (author && author.user && this.state.user && (this.state.user.userId === author.user.userId)) {
            return true;
        } else {
            return false;
        }
    }
    goSetting() {
        this.props.history.push('/setting/profile');
    }
    render() {
        let userList = (item, index) => {
            return (
                <Link to={(item.type === 0 ? '/myhome?userId=' : '/sellever?userId=') + item.userId} className={stylesContentList.profileItem} key={index}>
                    <div className={stylesContentList.profile} style={{ backgroundImage: 'url("' + (item.profileUrl ? item.profileUrl.replace('original', '80x80') : '/assets/img/img_profile_default.png') + '")'}}></div>
                    <div className={stylesContentList.name}>{item.name ? item.name : '이름없음'}</div>
                </Link>
            );
        }
        let hashtagList = (item, index) => {
            return (
                <HashTagCard key={index} itemList={item} />
            );
        }
        let fundingMarketList = (item, index) => {
            return (
                <div className={stylesContentList.productItemBox} key={index}>
                    <ImageList type={'fundingmarket'} listItem={item} />
                </div>
            );
        }
        let videoList = (item, index) => {
            return (
                <div className={stylesContentList.videoItemBox} key={index}>
                    <ImageList type={'video'} listItem={item} />
                </div>
            );
        }
        let emptyList = (
            <div className={stylesContentList.defaultBox}>
                <div className={stylesContentList.name}>불러올 목록이 없습니다.</div>
            </div>
        )
        return (
            <div className={stylesMyHome.myHomeContainer}>
                <div className={stylesContentList.profileHeader}>
                    <div className={stylesContentList.bgFilter} />
                    <div className={stylesContentList.bgImageBox} style={{ backgroundImage: this.state.user && this.state.user.coverUrl ? 'url("' + this.state.user.coverUrl + '")' : 'url("/assets/img/bg_hashtag_default.png")' }} />
                    <div className={stylesContentList.profileBox}>
                        {
                            this.isMine(this.props.author) ?
                                <div onClick={this.goSetting} className={stylesContentList.settingBtnBox}>
                                    <div className={styles.settingIcon + ' ' + stylesContentList.settingIcon} />
                                    <div className={stylesContentList.settingText}>수정</div>
                                </div>
                                :
                                null
                        }
                        {this.state.user ?
                            <div className={stylesContentList.profile}>
                                <UserBox profile={this.state.user && this.state.user.profileUrl ? this.state.user.profileUrl : '/assets/img/img_profile_default.png'} size={(this.state.mediaQuery ? '63px':'108px')} />
                            </div>
                            :
                            null
                        }
                        <div className={stylesContentList.name}>{this.state.user && this.state.user.name !== '' ? this.state.user.name : '이름없음'}</div>
                        {/*<div className={stylesContentList.phoneNumber}>{this.state.user && this.state.user.phoneNumber ? this.state.user.phoneNumber : ''}</div>*/}
                        <ul className={stylesContentList.followBox}>
                            <li>
                                <div>{(this.state.user ? '  ' + parseNumber.numberWithCommas(this.state.user.followingAmount) : 0)}</div>
                                <div>팔로잉</div>
                            </li>
                            <li>
                                <div>{(this.state.user ? '  ' + parseNumber.numberWithCommas(this.state.user.followerAmount) : 0)}</div>
                                <div>팔로워</div>
                            </li>
                        </ul>
                        {
                            this.isMine(this.props.author) || this.isMine(this.state.myInfo[0]) || (this.isMine(this.state.webUser) && this.state.isWeb) ?
                                <div onClick={this.goSetting} className={stylesContentList.settingBtnBox}>
                                    <div className={styles.settingIcon + ' ' + stylesContentList.settingIcon} />
                                    <div className={stylesContentList.settingText}>수정</div>
                                </div>
                                :
                                (this.state.user.isFollow ?
                                    <div className={stylesContentList.btn + ' ' + stylesContentList.btnGray} onClick={this.handleFollow}>
                                        <div className={styles.followingCheckIcon + ' ' + stylesContentList.followCheck} />
                                        <div className={stylesContentList.followText}>팔로잉</div>
                                    </div>
                                :
                                    <div className={stylesContentList.btn + ' ' + stylesContentList.btnRed} onClick={this.handleFollow}>
                                        <div className={styles.followPlusIcon + ' ' + stylesContentList.followCheck} />
                                        <div className={stylesContentList.followerText}>팔로우</div>
                                    </div>
                                )
                        }
                        <div className={stylesContentList.description}>{this.state.user.memo}</div>
                    </div>
                </div>
                <div className={stylesMyHome.blank}></div>
                <div className={stylesContentList.detailList}>
                    <div className={stylesContentList.detailTab}>
                        <div className={stylesContentList.tabItem + (this.state.displayTab === 1 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(1)}>팔로잉</div>
                        <div className={stylesContentList.tabItem + (this.state.displayTab === 2 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(2)}>팔로워</div>
                        <div className={stylesContentList.tabItem + (this.state.displayTab === 3 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(3)}>해시태그</div>
                        { this.isMine(this.props.author)
                            ?
                            <div className={stylesContentList.tabItem + (this.state.displayTab === 4 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(4)}>펀딩&마켓</div>
                            : null
                        }
                        { this.isMine(this.props.author)
                            ? <div className={stylesContentList.tabItem + (this.state.displayTab === 5 ? ' ' + stylesContentList.active : '')} onClick={(index) => this.handleTabComponent(5)}>동영상</div>
                            : null
                        }
                    </div>
                    { this.state.displayTab === 1
                        ? <InfiniteList onRef={(ref) => this.followingList = ref} ListItem={userList} listName={'users'} EmptyText={emptyList} Get={ActionUser.getFollowingList}
                                        GetParams={{
                                            param: this.state.user.userId,
                                        }} />
                        : null }
                    { this.state.displayTab === 2
                        ? <InfiniteList onRef={(ref) => this.followerList = ref} ListItem={userList} listName={'users'} EmptyText={emptyList} Get={ActionUser.getFollowerList}
                                        GetParams={{
                                            param: this.state.user.userId,
                                        }} />
                        : null }
                    { this.state.displayTab === 3
                        ? <InfiniteList onRef={(ref) => this.hashtagList = ref} ListItem={hashtagList} listName={'hashtags'} EmptyText={emptyList} Get={ActionHashTag.getHashTagList}
                                        GetParams={{
                                            sort: 'desc',
                                            userId: this.state.user.userId,
                                            isLike: true,
                                        }} />
                        : null }
                    { this.state.displayTab === 4
                        ? <InfiniteList onRef={(ref) => this.fundingMarketList = ref} ListItem={fundingMarketList} listName={'products'} EmptyText={emptyList} Get={ActionProduct.getProductList}
                                        GetParams={{
                                            isFunding: true,
                                            isNormal: true,
                                            isVideo: false,
                                            userId: this.state.user.userId,
                                            isLike: true,
                                            sort: 'desc',
                                            sortMethod: 'date',
                                        }} />
                        : null }
                    { this.state.displayTab === 5
                        ? <InfiniteList onRef={(ref) => this.videoList = ref} ListItem={videoList} listName={'products'} EmptyText={emptyList} Get={ActionProduct.getProductList}
                                        GetParams={{
                                            isFunding: false,
                                            isNormal: false,
                                            isVideo: true,
                                            userId: this.state.user.userId,
                                            isLike: true,
                                            sort: 'desc',
                                            sortMethod: 'date',
                                        }} />
                        : null }
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(MyHomeHome));