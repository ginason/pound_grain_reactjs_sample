import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import queryString from 'query-string';
//Components
import UserBox from '../../Common/UserBox';
import HomeMenu from './HomeMenu';
import UserMenu from './UserMenu';
// Styles
import styles from '../../Styles/Components/Header.css';
import stylesApp from '../../Styles/App.css';
// Actions

import * as ActionNotification from "../../Data/Notification/actions";

const mql = window.matchMedia('(max-width: 768px)');
let routes = [];
class Header extends React.Component {
    constructor() {
        super();
        this.state = {
            headerStyle: 1,

            nonChecked: 0,
            list: [],
            dropDownOpen: 1,
            show: false,
            showUserMenu: false,

            mediaQuery: mql.matches,
            mql: mql,
        };
        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUrlChange = this.handleUrlChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleUser = this.handleUser.bind(this);
    }
    componentWillMount() {
        mql.addListener(this.handleChange);

        let params = {
            from: 0,
            count: 20,
        };
        ActionNotification.getNotificationList(params)
            .then((response) => {
                if (response.code === 200) {
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
                }
            });
        this.props.history.listen((location, action) => {
            this.handleUrlChange(location);
        });
        this.handleUrlChange(this.props.location);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.author !== this.props.author || nextProps.isWebview !== this.props.isWebview) {
            return true;
        }
        if (nextState !== this.state) {
            return true;
        }
        return false;
    }
    componentWillReceiveProps(nextProps) {
        this.props.history.listen((location, action) => {
            this.handleUrlChange(location);
        });
        this.handleUrlChange(nextProps.location);
    }
    handleUrlChange(location) {
            if (
                location.pathname === '/'
            ) {
                this.setState({
                    headerStyle: 1,
                });
            } else if (
                location.pathname === '/hashtags' ||
                location.pathname === '/fundingmarket' ||
                location.pathname === '/fundingmarket/funding' ||
                location.pathname === '/fundingmarket/market' ||
                location.pathname === '/video' ||
                location.pathname === '/video/detail' ||
                location.pathname === '/search' ||
                location.pathname === '/auth/login' ||
                location.pathname === '/auth/signup' ||
                location.pathname === '/auth/findpassword' ||
                location.pathname === '/notification' ||
                location.pathname === '/usermenu' ||
                location.pathname === '/payment?displayTab=0' ||
                location.pathname === '/setting'
            ) {
                this.setState({
                    headerStyle: 2,
                });
            } else if (
                location.pathname === '/hashtags/detail' ||
                location.pathname === '/sellever' ||
                location.pathname === '/myhome'
            ) {
                this.setState({
                    headerStyle: 2,
                });
            //    기존에 3
            } else {
                this.setState({
                    headerStyle: 2,
                });
            }
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
    handleDropdown() {
        this.setState({
            show: !this.state.show,
        });
    }
    handleClose() {
        this.setState({
            show: !this.state.show,
        })
    }
    handleUser() {
        this.setState({
            showUserMenu: !this.state.showUserMenu,
        })
    }
    render() {
        if (this.props.isWebview) {
            return null;
        }
        if (this.state.headerStyle === 1) {
            return (
                <div>
                    {this.state.show ?
                    <HomeMenu close={this.handleClose} />
                        :
                        null
                    }
                    {this.state.showUserMenu ?
                        <UserMenu UserClose={this.handleUser}/>
                        :
                        null
                    }
                    <div className={styles.headerContainer + ' ' + styles.style1}>
                        <div className={styles.headerBox}>
                            <div className={styles.leftBox}>
                                <div className={styles.toggleIconBox + ' ' + stylesApp.mobileScreen}>
                                    {this.state.show ?
                                        null
                                        :
                                        <div onClick={this.handleDropdown} className={styles.hamburgerBlack} />
                                    }
                                </div>
                                <Link to={'/'}>
                                    <div className={styles.headerLogo + ' ' + styles.logoWhite + ' ' + styles.style1LogoBlack}/>
                                </Link>
                                <ul className={styles.leftList}>
                                    <li><Link to={'/'}
                                              className={this.props.location.pathname === '/' || this.props.location.pathname === '' ? styles.active : ''}>HOME</Link>
                                    </li>
                                    <li><Link to={'/hashtags'}
                                              className={this.props.location.pathname.length > 1 && this.props.location.pathname.split('/')[1] === 'hashtags' ? styles.active : ''}>해시태그</Link>
                                    </li>
                                    <li><Link to={'/fundingmarket'}
                                              className={this.props.location.pathname.length > 1 && this.props.location.pathname.split('/')[1] === 'fundingmarket' ? styles.active : ''}>펀딩&마켓</Link>
                                    </li>
                                    <li><Link to={'/video'}
                                              className={this.props.location.pathname.length > 1 && this.props.location.pathname.split('/')[1] === 'video' ? styles.active : ''}>동영상</Link>
                                    </li>
                                    <li><Link
                                        to={this.props.author ? ('/myhome?userId=' + (this.props.author && this.props.author.user ? this.props.author.user.userId : 'null')) : '/auth/login'}
                                        className={this.props.location.pathname.length > 1 && this.props.location.pathname.split('/')[1] === 'myhome' ? styles.active : ''}>마이홈</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.rightBox}>
                                {
                                    this.props.author ? (
                                        <ul className={styles.rightList}>
                                            <li>
                                                <Link to={'/search'}>
                                                    <div className={styles.searchWhite +' ' + styles.style1Mobile}/>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/payment?displayTab=0'}>
                                                    <div className={styles.cartWhiteIcon +' ' + styles.style1Mobile}/>
                                                </Link>
                                            </li>
                                            <li><Link to={'/notification'}>
                                                <div
                                                    className={styles.notifyWhite + ' ' + styles.style1Mobile}/>
                                            </Link></li>
                                            <li onClick={this.handleUser} className={styles.userBox}>
                                                <UserBox
                                                    profile={this.props.author.user && this.props.author.user.profileUrl ? this.props.author.user.profileUrl : '/assets/img/img_profile_default.png'}
                                                    size={'30px'}
                                                />
                                            </li>
                                        </ul>
                                    ) : (
                                        <ul className={styles.rightList}>
                                            <li className={styles.searchBox}>
                                                <Link to={'/search'}>
                                                    <div className={styles.searchWhite +' ' + styles.style1Mobile}/>
                                                </Link>
                                            </li>
                                            <li className={styles.loginTitle}>
                                                <Link to={'/auth/login'} className={styles.authBtn}>로그인</Link>
                                            </li>
                                        </ul>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                    )
                } else {
                    return (
                <div>
                    {this.state.show ?
                        <HomeMenu close={this.handleClose} />
                        :
                        null
                    }
                    {this.state.showUserMenu ?
                        <UserMenu UserClose={this.handleUser}/>
                        :
                        null
                    }
                    <div className={styles.headerContainer + ' ' + (styles['style' + this.state.headerStyle])}>
                        <div className={styles.headerBox}>
                            <div className={styles.leftBox}>
                                <div className={styles.toggleIconBox + ' ' + stylesApp.mobileScreen}>
                                    {this.state.show ?
                                        null
                                        :
                                        <div onClick={this.handleDropdown} className={(this.state.headerStyle === 2 ? styles.hamburgerBlack: styles.hamburgerWhite)} />
                                    }
                                </div>
                                <Link to={'/'}>
                                    <div className={styles.headerLogo + ' ' + (this.state.headerStyle === 2 ? styles.logoBlack : styles.logoWhite)}/>
                                </Link>
                                <ul className={styles.leftList}>
                                    <li><Link to={'/'}
                                              className={this.props.location.pathname === '/' || this.props.location.pathname === '' ? styles.active : ''}>HOME</Link>
                                    </li>
                                    <li><Link to={'/hashtags'}
                                              className={this.props.location.pathname.length > 1 && this.props.location.pathname.split('/')[1] === 'hashtags' ? styles.active : ''}>해시태그</Link>
                                    </li>
                                    <li><Link to={'/fundingmarket'}
                                              className={this.props.location.pathname.length > 1 && this.props.location.pathname.split('/')[1] === 'fundingmarket' ? styles.active : ''}>펀딩&마켓</Link>
                                    </li>
                                    <li><Link to={'/video'}
                                              className={this.props.location.pathname.length > 1 && this.props.location.pathname.split('/')[1] === 'video' ? styles.active : ''}>동영상</Link>
                                    </li>
                                    <li><Link
                                        to={this.props.author && this.props.author.user ? '/myhome?userId=' + this.props.author.user.userId : '/auth/login'}
                                        className={this.props.location.pathname.length > 1 && this.props.location.pathname.split('/')[1] === 'myhome' ? styles.active : ''}>마이홈</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.rightBox}>
                                {
                                    this.props.author ? (
                                        <ul className={styles.rightList}>
                                            <li>
                                                <Link to={'/search'}>
                                                    <div
                                                        className={this.state.headerStyle === 2 ? styles.searchBlack : styles.searchWhite}/>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={'/payment?displayTab=0'}>
                                                    <div
                                                        className={this.state.headerStyle === 2 ? styles.cartBlackIcon : styles.cartWhiteIcon}/>
                                                </Link>
                                            </li>
                                            <li><Link to={'/notification'}>
                                                <div
                                                    className={this.state.headerStyle === 2 ? styles.notifyBlack : styles.notifyWhite}/>
                                            </Link></li>
                                            <li onClick={this.handleUser} className={styles.userBox}>
                                                <UserBox
                                                    profile={this.props.author.user && this.props.author.user.profileUrl ? this.props.author.user.profileUrl : '/assets/img/img_profile_default.png'}
                                                    size={'30px'}
                                                />
                                            </li>
                                        </ul>
                                    ) : (
                                        <ul className={styles.rightList}>
                                            <li>
                                                <Link to={'/search'}>
                                                    <div
                                                        className={this.state.headerStyle === 2 ? styles.searchBlack : styles.searchWhite}/>
                                                </Link>
                                            </li>
                                            <li className={styles.loginTitle}>
                                                <Link to={'/auth/login'} className={styles.authBtn}>로그인</Link>
                                            </li>
                                        </ul>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
         }
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(Header));

