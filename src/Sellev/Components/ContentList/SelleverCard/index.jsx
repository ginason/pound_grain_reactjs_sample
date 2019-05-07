import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles
import stylesContentList from '../../../Styles/Components/ContentList.css';
import styles from '../../../Styles/App.css';
//Action
import * as ActionUser from "../../../Data/User/actions";
import * as ActionAuth from "../../../Data/Authentification/actions";


class SelleverCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: [],
        }
        this.handleFollowSellever = this.handleFollowSellever.bind(this);
        this.goDetail = this.goDetail.bind(this);
    }
    componentWillMount() {
        let userId;
        if (this.props.author && this.props.author.user) {
            userId = this.props.author.user.userId;
        }
        // this.setState({user: this.props.itemList});
    }
    componentWillReceiveProps(nextProps) {
        let userId;
        if (nextProps.author && nextProps.author.user) {
            userId = nextProps.author.user.userId;
        }
    }
    handleFollowSellever() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        let params = {
            userIdTo: this.props.itemList.userId,
            following: !this.props.itemList.isFollow,
        }
        ActionUser.followUser(params)
            .then((response) => {
                let newUser = this.props.itemList;
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
    goDetail() {
        this.props.history.push('/sellever?userId=' + this.props.itemList.userId);
    }
    render() {
        return (
            <div className={stylesContentList.selleverBox}>
                <div onClick={this.goDetail} className={stylesContentList.profileImage} style={{ backgroundImage: 'url("' + this.props.itemList.profileUrl + '")'}}/>
                <div className={stylesContentList.textName}>{this.props.itemList.name}</div>
                <div className={stylesContentList.textFolloer}>팔로워 {this.props.itemList.followerAmount}</div>
                <div className={stylesContentList.textFollowBox} onClick={this.handleFollowSellever}>
                    {this.props.itemList && this.props.itemList.isFollow ? <div className={stylesContentList.myHomeCheck}>+</div> : <div className={styles.grayCheckIcon + ' ' + stylesContentList.followCheck} /> }
                    {this.props.itemList && this.props.itemList.isFollow ? <div className={stylesContentList.textFollowing}>팔로잉</div> : <div className={stylesContentList.textFolloer}>팔로우</div>}
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(SelleverCard));