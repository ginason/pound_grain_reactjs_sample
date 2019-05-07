import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

//Components
import UserBox from '../../Common/UserBox';

// Styles
import styles from '../../Styles/Components/Header.css';
//Action
import * as parseNum from '../../Lib/Utils/parseNumber';
import * as ActionAuth from "../../Data/Authentification/actions";

/*
this.props.profile
 this.props.name
 this.props.coin
 this.props.point
*/
class UserMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profileUrl: '',
            name: '',
            coin: '',
            point: '',
        }
        this.logout = this.logout.bind(this);
        this.goProfile = this.goProfile.bind(this);
        this.close = this.close.bind(this);
    }
    componentWillMount() {
        if(this.props.author && this.props.author.user) {
            this.setState({
                profileUrl: this.props.author.user.profileUrl,
                name: this.props.author.user.name,
                coin: this.props.author.user.coin,
                point: this.props.author.user.mileage,
            })
        }
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.author && nextProps.author.user && nextProps.author.user.profileUrl) {
            this.setState({
                profileUrl: nextProps.author.user.profileUrl,
                name: nextProps.author.user.name,
                coin: nextProps.author.user.coin,
                point: nextProps.author.user.mileage,
            })
        }
    }
    logout() {
        if (confirm('로그아웃 하시겠습니까?')) {
            this.props.dispatch(ActionAuth.logout())
                .then((response) => {
                    window.location.reload(true);
                    this.props.history.push('/');
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    goProfile() {
        if(this.props.author && this.props.author.user) {
            this.props.history.push('/myhome?userId=' + this.props.author.user.userId);
        } else {
            this.props.history.push('/auth/login');
        }
    }
    close() {
        this.props.UserClose();
    }
    render() {
        return (
            <div className={styles.globalMenuContainer}>
                <div className={styles.globalMenuHeader}>
                    <div onClick={this.close} className={styles.toggleUpIcon} />
                    <div onClick={this.goProfile} className={styles.profileBox}>
                        <UserBox size={'65px'} profile={(this.state.profileUrl ? this.state.profileUrl : '/assets/img/img_profile_default.png')} />
                    </div>
                    <div className={styles.userInfo}>
                        <div onClick={this.goProfile} style={{color: (this.state.name ? '#000000' : '#4d4d4d' )}}>{this.state.name ? this.state.name : '이름을 등록해주세요.'}</div>
                        <span>Coin</span>
                        <span>{this.state.coin ? parseNum.numberWithCommas(this.state.coin) : '0'}C</span>
                        <span>Point</span>
                        <span>{this.state.point ? parseNum.numberWithCommas(this.state.point) : '0'}P</span>
                    </div>
                </div>
                <div className={styles.globalMenuBody}>
                    <ul className={styles.globalMenuList}>
                        <li><Link to={'/setting/profile'}>프로필설정</Link></li>
                        <li><Link to={(this.props.author && this.props.author.user ? '/myhome?userId=' + this.props.author.user.userId + '&displayTab=4' : '/')}>관심펀딩/상품</Link></li>
                        <li><Link to={'/usermenu/myfunding'}>참여 펀딩 현황</Link></li>
                        <li><Link to={'/usermenu/myorder'}>구매내역</Link></li>
                        <li><Link to={'/payment'}>장바구니</Link></li>
                    </ul>
                    <ul className={styles.othersList}>
                        <li><Link to={'/usermenu/buycoin'}>코인 충전</Link></li>
                        <li><Link to={'/usermenu/guideline'}>이용가이드</Link></li>
                        <li onClick={this.logout}>로그아웃</li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(UserMenu));
