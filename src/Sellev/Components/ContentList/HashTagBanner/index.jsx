import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components

// Styles
import styles from '../../../Styles/App.css';
import stylesHashTag from '../../../Styles/Components/HashTag.css';

// Actions
import * as ActionHashTag from "../../../Data/HashTag/actions";
import * as ActionAuth from "../../../Data/Authentification/actions";
/*
* this.props.numOfList: top list 갯수
* */
class HashTagRecommended extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hotList: [],
            isLike: 0,
            numOfBox: 5,
        }
        this.getHashTagList = this.getHashTagList.bind(this);
        this.goDetail = this.goDetail.bind(this);
        this.handleLike = this.handleLike.bind(this);
    }
    componentWillMount() {
        let userId;
        if (this.props.author && this.props.author.user) {
            userId = this.props.author.user.userId;
        }
        this.getHashTagList();
    }
    componentWillReceiveProps(nextProps) {
        let userId;
        if (nextProps.author && nextProps.author.user) {
            userId = nextProps.author.user.userId;
        }
        this.getHashTagList();
    }
    componentDidMount(){
        this.getHashTagList();
    }
    getHashTagList() {
        let params = {
            from: 0,
            count: this.props.numOfList === 3 ? 9 : 15,
            sort: 'desc',
            sortMethod: 'hit',
        };
        this.props.dispatch(ActionHashTag.getHashTagList(params))
            .then((response) => {
                this.setState({
                    hotList: response.data.hashtags,
                });
            })
    }
    handleLike(index) {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        if (this.state.hotList[index]) {
            let params = {
                param: this.state.hotList[index].hashtagId,
                like: !this.state.hotList[index].isLike,
            }
            ActionHashTag.hashTagLike(params)
                .then((response) => {
                    if (response.code === 200) {
                        let newHashtag = this.state.hotList;
                        newHashtag[index].isLike = !newHashtag[index].isLike;
                        this.setState({
                            hotList: newHashtag,
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
        let hashTagList = this.state.hotList && this.state.hotList.length > 0 ? this.state.hotList.map((item, index) => {
            if(index < this.props.numOfList) {
                if(index === 0) {
                    return (
                        <div key={index} className={stylesHashTag.hashTagBannerBox + ' ' + stylesHashTag.hashTagTopItem}>
                            {/*<img className={stylesHashTag.hashTagImgScale} src={'/assets/img/img_hashtag_card.png'} />*/}
                            <div onClick={() => this.goDetail(item.hashtagId)} className={stylesHashTag.hashTagBanner} style={{backgroundImage: item.imageUrl ? 'url("' + item.imageUrl.replace('original', '640x470') + '")' : 'url("/assets/img/bg_hashtag_default.png")' }} />
                            { item.isLike ?
                                <div onClick={() => this.handleLike(index)} className={styles.whiteHeartFullIcon + ' ' + stylesHashTag.clickLike} />
                                :
                                <div onClick={() => this.handleLike(index)} className={styles.whiteHearLineIcon + ' ' + stylesHashTag.clickLike} />
                            }
                            <div onClick={() => this.goDetail(item.hashtagId)} className={stylesHashTag.hashTagTextBox + ' ' + stylesHashTag.includeCrown}>
                                <div className={styles.crownIcon} />
                                <div className={stylesHashTag.rankNumber}>{index + 1}</div>
                                <div className={stylesHashTag.hashTagBtn}>#{item.hashtag ? item.hashtag : '이름없음'}</div>
                            </div>
                        </div>
                    )
                }else {
                    return (
                        <div key={index} className={stylesHashTag.hashTagBannerBox + ' ' + stylesHashTag.hashTagTopItem}>
                            {/*<img className={stylesHashTag.hashTagImgScale} src={'/assets/img/img_hashtag_card.png'} />*/}
                            <div onClick={() => this.goDetail(item.hashtagId)} className={stylesHashTag.hashTagBanner} style={{backgroundImage: item.imageUrl ? 'url("' + item.imageUrl.replace('original', '640x470') + '")' : 'url("/assets/img/bg_hashtag_default.png")' }} />
                            { item.isLike ?
                                <div onClick={() => this.handleLike(index)} className={styles.whiteHeartFullIcon + ' ' + stylesHashTag.clickLike} />
                                :
                                <div onClick={() => this.handleLike(index)} className={styles.whiteHearLineIcon + ' ' + stylesHashTag.clickLike} />
                            }
                            <div onClick={() => this.goDetail(item.hashtagId)} className={stylesHashTag.hashTagTextBox}>
                                <div className={stylesHashTag.rankNumber}>{index + 1}</div>
                                <div className={stylesHashTag.hashTagBtn}>#{item.hashtag ? item.hashtag : '이름없음'}</div>
                            </div>
                        </div>
                    )
                }
            }
        }) : null;
        let hashTagBoxList = this.state.hotList && this.state.hotList.length > 0 ? this.state.hotList.map((item, index) => {
            if(index === this.props.numOfList || index > this.props.numOfList) {
                return (
                    <div key={index} className={stylesHashTag.hashTagBannerBox + ' ' + stylesHashTag.hashTagItem}>
                        {/*<img className={stylesHashTag.hashTagImgScale} src={'/assets/img/img_hashtag_card.png'} />*/}
                        <div onClick={() => this.goDetail(item.hashtagId)} className={stylesHashTag.hashTagBanner} style={{backgroundImage: item.imageUrl ? 'url("' + item.imageUrl.replace('original', '640x470') + '")' : 'url("/assets/img/bg_hashtag_default.png")' }} />
                        { item.isLike ?
                            <div onClick={() => this.handleLike(index)} className={styles.whiteHeartFullIcon + ' ' + stylesHashTag.clickLike + ' ' + styles.fullScreen} />
                            :
                            <div onClick={() => this.handleLike(index)} className={styles.whiteHearLineIcon + ' ' + stylesHashTag.clickLike + ' ' + styles.fullScreen} />
                        }
                        <div onClick={() => this.goDetail(item.hashtagId)} className={stylesHashTag.hashTagTextBox + ' ' + stylesHashTag.hashTagItem}>
                            <div className={stylesHashTag.rankNumber}>{index + 1}</div>
                            <div className={stylesHashTag.hashTagBtn}>#{item.hashtag ? item.hashtag : '이름없음'}</div>
                        </div>
                    </div>
                )
            }
        }) : null;
        return (
            <div className={stylesHashTag.recommendedBody}>
                <div className={stylesHashTag.cardListBox}>
                {hashTagList}
                </div>
                <div className={stylesHashTag.hashTagList}>
                    {hashTagBoxList}
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(HashTagRecommended));