import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Styles
import styles from '../../Styles/App.css';
import stylesHashTag from '../../Styles/Components/HashTag.css';


// Utils
import * as ActionAuth from "../../Data/Authentification/actions";
import * as ActionHashTag from "../../Data/HashTag/actions";
import * as DateUtil from '../../Lib/Utils/date';
class HashTagNew extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            sortNew: true,
            isLike: 0,
        };
        this.handleClick = this.handleClick.bind(this);
        this.getHashTagList = this.getHashTagList.bind(this);
        this.goDetail = this.goDetail.bind(this);
        this.handleLike = this.handleLike.bind(this);
    }
    componentWillMount() {
       this.getHashTagList();
    }
    getHashTagList() {
        let params = {
            from: 0,
            count: 12,
            sortMethod: this.state.sortNew ? 'date' : 'hit',
            sort: 'desc',
        };
        this.props.dispatch(ActionHashTag.getHashTagList(params))
            .then((response) => {
                console.log('response');
                console.log(response);
                this.setState({
                    list: response.data.hashtags,
                });
            })
    }
    handleClick() {
        this.setState({
            sortNew: !this.state.sortNew,
        })
        setTimeout(() => {
            this.getHashTagList();
        }, 100);
    }
    handleLike(index) {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        if (this.state.list[index]) {
            let params = {
                param: this.state.list[index].hashtagId,
                like: !this.state.list[index].isLike,
            }
            ActionHashTag.hashTagLike(params)
                .then((response) => {
                    if (response.code === 200) {
                        let newHashtag = this.state.list;
                        newHashtag[index].isLike = !newHashtag[index].isLike;
                        this.setState({
                            list: newHashtag,
                        })
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    goDetail(hashtagId) {
        this.props.history.push('/hashtags/detail?hashtagId=' + hashtagId);
    }
    render() {
        let hashTagList = this.state.list ? (this.state.list.map((item, index) => {
                return (
                    <div key={index} className={stylesHashTag.hashTagBannerBox + ' ' + stylesHashTag.hashTagNew}>
                        <div onClick={() => this.goDetail(item.hashtagId)} className={stylesHashTag.hashTagBanner} style={{backgroundImage: item.imageUrl ? 'url("' + item.imageUrl.replace('original', '640x470') + '")' : 'url("/assets/img/bg_hashtag_default.png")' }} />
                        { item.isLike ?
                            <div onClick={() => this.handleLike(index)} className={styles.whiteHeartFullIcon + ' ' + stylesHashTag.clickLike} />
                            :
                            <div onClick={() => this.handleLike(index)} className={styles.whiteHearLineIcon + ' ' + stylesHashTag.clickLike} />
                        }
                        <div onClick={() => this.goDetail(item.hashtagId)} className={stylesHashTag.hashTagTextBox + ' ' + stylesHashTag.hashTagNew}>
                            <div className={stylesHashTag.hashTagBtn}>#{item.hashtag ? item.hashtag : '이름없음'}</div>
                            <div className={stylesHashTag.bannerText}>{DateUtil.format('point', item.createdAt)}</div>
                        </div>
                    </div>
                );
        })) : null;
        return (
            <div className={stylesHashTag.newSection}>
                <div className={stylesHashTag.newHeader}>
                    <div className={styles.sectionSmallTitle}>가장 먼저 확인하세요</div>
                    <div className={styles.titleBox}>
                        <div className={styles.sectionTitle}>#신규 해시태그</div>
                        <div onClick={this.handleClick} className={styles.filter}>
                            {this.state.sortNew ?
                                <span>최신순</span>
                                :
                                <span>인기순</span>
                            }
                            <div />
                        </div>
                    </div>
                </div>
                <div className={stylesHashTag.newBody}>
                    <div className={stylesHashTag.list}>{hashTagList}</div>
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
})(withRouter(HashTagNew));