import React from 'react';
import {
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import DetailBody from '../ContentList/DetailList/index';

// Actions
import * as ActionHashTag from '../../Data/HashTag/actions';
import * as ActionProduct from '../../Data/Product/action';
import * as ActionAuth from '../../Data/Authentification/actions';

// Styles
import styles from '../../Styles/App.css';
import stylesHashTag from '../../Styles/Components/HashTag.css';

// Utils
import * as parseUrlParameter from '../../Lib/Utils/parseUrlParameter';
import * as parseNumber from "../../Lib/Utils/parseNumber";

class HashTagDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hashtag: {},
        }

        this.handleLike = this.handleLike.bind(this);
        this.getHashtag = this.getHashtag.bind(this);
    }
    componentWillMount() {
        window.scrollTo(0, 0);
        this.getHashtag(this.props.location.search);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.search !== this.props.location.search){
            window.scrollTo(0, 0);
            this.getHashtag(nextProps.location.search);
            return true;
        }
        if (nextState !== this.state) {
            return true;
        }
        return false;
    }
    increaseHit(hashtagId) {
        ActionHashTag.increaseHit({ hashtagId: hashtagId });
    }
    getHashtag(search) {
        let urlParams = parseUrlParameter.parse(search);
        if (!urlParams.hashtagId || !urlParams.hashtagId.match(/^[0-9]*$/)) {
            this.props.history.push('/');
            return;
        }
        this.setState({
            hashtag: {},
        })
        ActionHashTag.getHashTagOne(urlParams.hashtagId)
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        hashtag: response.data.hashtag,
                    }, () => {
                        this.increaseHit(urlParams.hashtagId);
                        if (this.detailBody) {
                            this.detailBody.getRelatedHashtagList();
                            this.detailBody.getRelatedSelleverList();
                            this.detailBody.getRelatedFundingMarketList();
                            this.detailBody.getRelatedVideoList();
                        }
                    });
                } else {
                    alert('데이터를 불러오는데 문제가 발생했습니다.');
                }
            })
            .catch((err) => {
                alert('데이터를 불러오는데 문제가 발생했습니다.');
            })
    }
    handleLike(){
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        let params = {
            param: this.state.hashtag.hashtagId,
            like: !this.state.hashtag.isLike,
        }
        ActionHashTag.hashTagLike(params)
            .then((response) => {
                if (response.code === 200) {
                    let newHashtag = JSON.parse(JSON.stringify(this.state.hashtag));
                    newHashtag.isLike = !newHashtag.isLike;
                    if (newHashtag.isLike) {
                        newHashtag.likeAmount = Number(newHashtag.likeAmount) + 1;
                    } else {
                        newHashtag.likeAmount = Number(newHashtag.likeAmount) - 1;
                    }
                    this.setState({hashtag: newHashtag});
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    render() {
        return (
            <div className={stylesHashTag.hashTagDetailContainer}>
                <div className={stylesHashTag.detailHeader}>
                    {this.state.hashtag && this.state.hashtag.imageUrl ?
                        <div className={stylesHashTag.bgBoxBlack}>
                            <div className={stylesHashTag.bgImage} style={{ backgroundImage: 'url("' + this.state.hashtag.imageUrl.replace('original', '640x470') + '")' }} />
                        </div>
                        :
                        <div className={stylesHashTag.bgBoxNone}>
                            <div className={stylesHashTag.bgImageNone} style={{ backgroundImage: 'url("/assets/img/bg_hashtag_default.png")', opacity: '1' }} />
                        </div>
                    }
                    <div className={stylesHashTag.profileBox}>
                        <div className={stylesHashTag.name + ' ' + stylesHashTag.mobileName}>{'#' + (this.state.hashtag ? this.state.hashtag.hashtag : '')}</div>
                        <div className={stylesHashTag.likeBtn + ' ' + styles.fullScreen}>
                            <div onClick={this.handleLike} className={(this.state.hashtag && this.state.hashtag.isLike ? styles.whiteHeartFullIcon : styles.whiteHearLineIcon) + ' ' + stylesHashTag.icon} />
                            <div className={stylesHashTag.number}>{parseNumber.numberWithCommas(this.state.hashtag ? this.state.hashtag.likeAmount : '')}</div>
                        </div>
                    </div>
                    {/*mobile btn*/}
                    <div className={styles.mobileBtnBox}>
                        <div className={styles.mobileBtn}>
                            <div className={styles.btnBoxLeft}>
                                <div onClick={this.handleLike} className={(this.state.hashtag && this.state.hashtag.isLike ? styles.pinkHeartMobile : styles.whiteHeartMobile)} /><span>{parseNumber.numberWithCommas(this.state.hashtag ? this.state.hashtag.likeAmount : '')}</span>
                            </div>
                            <div className={styles.btnBoxHashTag}>
                                {'#' + (this.state.hashtag && this.state.hashtag.hashtag ? this.state.hashtag.hashtag : '')}
                            </div>
                        </div>
                    </div>
                </div>
                <DetailBody onRef={(ref) => this.detailBody = ref} paramName={'hashtagId'} paramVal={this.state.hashtag ? this.state.hashtag.hashtagId : ''} />
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
        isWebview: state.data.auth.isWebview,
    };
})(withRouter(HashTagDetail));