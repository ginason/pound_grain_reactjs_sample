import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

// Components
import DetailComments from '../ContentList/DetailComments';
import VideoListItem from './VideoListItem';

// Styles
import stylesVideo from '../../Styles/Components/Video.css';
import stylesContentList from '../../Styles/Components/ContentList.css';
import styles from '../../Styles/App.css';

// Actions
import * as ActionProduct from "../../Data/Product/action";
import * as ActionComment from "../../Data/Comments/actions";

// Utils
import * as parseUrlParameter from "../../Lib/Utils/parseUrlParameter";
import * as parseNumber from "../../Lib/Utils/parseNumber";
import * as DateUtil from "../../Lib/Utils/date";
import * as ActionAuth from "../../Data/Authentification/actions";
import * as ActionUser from "../../Data/User/actions";

class Detail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            product: {},
            selleverList: [],
            hitList: [],

            commentTotal: 0,
            commentParentTotal: 0,

            dropDownOpen: true,
        }
        this.increaseHit = this.increaseHit.bind(this);

        this.getVideo = this.getVideo.bind(this);
        this.getSelleverVideo = this.getSelleverVideo.bind(this);
        this.getPopularVideo = this.getPopularVideo.bind(this);

        this.handleDropdown = this.handleDropdown.bind(this);
        this.handleFollowSellever = this.handleFollowSellever.bind(this);
        this.handleLike = this.handleLike.bind(this);

        this.goProfile = this.goProfile.bind(this);
        this.convertToEmbed = this.convertToEmbed.bind(this);
    }
    componentWillMount() {
        this.getVideo(this.props.location.search);
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.search !== this.props.location.search) {
            window.scrollTo(0, 0);
            this.getVideo(nextProps.location.search);
            return true;
        }

        if (nextState !== this.state) {
            return true;
        }

        return false;
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    increaseHit(productId) { // 조회수 증가
        ActionProduct.increaseHit({ productId: productId });
    }
    getVideo(search) { // 상세 페이지의 동영상 + 셀레버동영상,인기동영상
        let urlParams = parseUrlParameter.parse(search);

        this.setState({
            product: {},
            selleverList: [],
            hitList: [],

            commentTotal: 0,
            commentParentTotal: 0,
        });

        this.props.dispatch(ActionProduct.getProductOne(urlParams.productId))
            .then((response) => {
                this.setState({
                    product: response.data.product,
                });
                setTimeout(() => {
                    this.getCommentCount(urlParams.productId);
                    this.getSelleverVideo();
                    this.getPopularVideo();
                    this.increaseHit(urlParams.productId);
                }, 100);
            })
            .catch((err) => {
                console.log(err);
            });
    }
    getCommentCount(productId) {
        ActionComment.commentCount(productId)
            .then((response) => {
                this.setState({
                    commentTotal: response.total,
                    commentParentTotal: response.count,
                })
            })
            .catch((err) => {});
    }
    getSelleverVideo() { // 상세 페이지의 동영상을 올린 셀레버 영상 리스트
        let params = {
            from: 0,
            count: 4,
            sort: 'desc',
            sortMethod: 'date',
            userId: this.state.product && this.state.product.store ? this.state.product.store.userId : '',
            isNormal: false,
            isFunding: false,
            isVideo: true,
        }
        this.props.dispatch(ActionProduct.getProductList(params))
            .then((response) => {
                console.log('console.log(response);');
                console.log(response);
                this.setState({
                    selleverList: response.data.products,
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    getPopularVideo() { // 인기 동영상 리스트
        let params = {
            from: 0,
            count: 8,
            sort: 'desc',
            sortMethod: 'hit',
            isVideo: true,
        }
        this.props.dispatch(ActionProduct.getProductList(params))
            .then((response) => {
                this.setState({
                    hitList: response.data.products,
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    handleDropdown() {
        this.setState({
            dropDownOpen: !this.state.dropDownOpen,
        });
    }
    handleFollowSellever() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        if (this.state.product && this.state.product.store) {
            let params = {
                userIdTo: this.state.product.store.userId,
                following: !this.state.product.store.isFollow,
            }
            ActionUser.followUser(params)
                .then((response) => {
                    let newProduct = this.state.product;
                    if (newProduct.store) {
                        newProduct.store.isFollow = !newProduct.store.isFollow;
                        if (newProduct.store.isFollow) {
                            newProduct.store.followerAmount = newProduct.store.followerAmount + 1;
                        } else {
                            newProduct.store.followerAmount = newProduct.store.followerAmount - 1;
                        }
                    }
                    this.setState({
                        product: newProduct,
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
    handleLike() {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        if (this.state.product) {
            let params = {
                productId: this.state.product.productId,
                isLike: !this.state.product.isLike,
            }
            this.props.dispatch(ActionProduct.productLike(params))
                .then((response) => {
                    if (response.code === 200) {
                        let newProduct = this.state.product;

                        if (this.state.product) {
                            newProduct.isLike = !newProduct.isLike;

                            if (newProduct.isLike) {
                                newProduct.likeAmount = newProduct.likeAmount + 1;
                            } else {
                                newProduct.likeAmount = newProduct.likeAmount - 1;
                            }
                        }
                        this.setState({
                            product: newProduct,
                        })
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    goProfile() {
        this.props.history.push('/sellever?userId=' + (this.state.product && this.state.product.store ? this.state.product.store.userId : ''));
    }
    convertToEmbed(url) {
        let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = url.match(regExp);

        if (match && match[2].length == 11) {
            return match[2];
        } else {
            return 'error';
        }
    }
    render() {
        let selleverVideo = this.state.selleverList.length > 0 ? this.state.selleverList.map((item, index) => {
            return (
                <VideoListItem key={index} isSellever={true} listItem={item}/>
            );
        }) : null;
        let hitVideo = this.state.hitList.length > 0 ? this.state.hitList.map((item, index) => {
            return (
                <VideoListItem key={index} listItem={item}/>
            );
        }) : null;
        let hashTagList = this.state.product && this.state.product.hashtags && this.state.product.hashtags.length > 0 ?
            (this.state.product.hashtags.map((item, index) => {
                return (
                    <Link key={index} to={'/hashtags/detail?hashtagId=' + item.hashtagId} className={stylesContentList.hashTagBtn +' '+ stylesContentList.customizedHashTag}>
                        #{item.hashtag}
                    </Link>
                )
            })) : null;
        return (
            <div className={stylesVideo.videoDetailContainer}>
                <div className={stylesVideo.videoDetailHeader}>
                    <div className={stylesVideo.playingVideoBox}> {/* 동영상 부분 */}
                        <div className={stylesVideo.playingVideo}>
                            {/* 유튜브 동영상 */}
                            <img className={stylesVideo.videoScale} src={'/assets/img/img_482x242.png'} />
                            {this.state.product && this.state.product.typeInfo && this.state.product.typeInfo.youtubeUrl && this.state.product.typeInfo.youtubeUrl.match(/^(ftp|http|https):\/\/[^ "]+$/) ?
                                <div>
                                    <iframe className={stylesVideo.videoFrame} src={"https://youtube.com/embed/" + this.convertToEmbed(this.state.product.typeInfo.youtubeUrl)} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />
                                </div>
                                :
                                <div className={stylesVideo.videoDefault} style={{backgroundImage: 'url("/assets/img/img_default_video.png")'}} />

                            }
                        </div>
                        <div className={stylesVideo.videoTitleBox}>
                            <div className={stylesVideo.videoTitle}>
                                <div>{this.state.product.title}</div>
                                <div>조회수 {parseNumber.numberWithCommas(this.state.product.hitAmount)}회</div>
                            </div>
                            <div className={styles.btn47White +' ' + stylesVideo.videoLikeBtn} onClick={this.handleLike}>{/* 버튼 */}
                                <div className={stylesVideo.btnContent}>
                                    <div className={stylesVideo.likeImage + (this.state.product && this.state.product.isLike ? ' ' + stylesVideo.likePink : '')} />
                                    <div className={stylesVideo.number + (this.state.product && this.state.product.isLike ? ' ' + stylesVideo.numberPink : '')}>{parseNumber.numberWithCommas(this.state.product ? this.state.product.likeAmount : 0)}</div>
                                </div>
                            </div>
                            {this.state.dropDownOpen ?
                                <div
                                    className={styles.dropdownUp + ' ' + styles.mobileScreen + ' ' + stylesVideo.mobileDropdown}
                                    onClick={this.handleDropdown}
                                />
                                :
                                <div
                                    className={styles.dropdownImage + ' ' + styles.mobileScreen + ' ' + stylesVideo.mobileDropdown}
                                    onClick={this.handleDropdown}
                                />
                            }

                        </div>
                    </div>
                    {this.state.dropDownOpen ?
                        <ul className={stylesVideo.detailInfoBox}> {/* 왼쪽 상세 정보 및 댓글들 */}
                            <li>게시일 {DateUtil.format('point', this.state.product.createdAt)}</li>
                            <li>
                                < div dangerouslySetInnerHTML = { {__html: this.state.product.description}} />
                            </li>
                            <li>
                                {hashTagList}
                            </li>
                        </ul>
                        :
                        null
                    }
                    <ul className={stylesVideo.videoFollowBox}>
                        <li>
                            <div onClick={this.goProfile} className={stylesVideo.followUserImage} style={{ backgroundImage: 'url("' + (this.state.product && this.state.product.store && this.state.product.store.profileUrl ? this.state.product.store.profileUrl.replace('original', '80x80') : '/assets/img/img_profile_default.png') + '")' }}></div>
                        </li>
                        <li>
                            <div onClick={this.goProfile} className={stylesVideo.userTitle}>{this.state.product && this.state.product.store ? this.state.product.store.name : ''}</div>
                            <div className={stylesVideo.userFollower}>팔로워{parseNumber.numberWithCommas(this.state.product && this.state.product.store ? this.state.product.store.followerAmount : 0)}명</div>
                        </li>
                        {this.state.product && this.state.product.store && this.state.product.store.isFollow ?
                            <li className={stylesVideo.unfollowBox}>
                                <div onClick={this.handleFollowSellever} className={styles.unfollowBtn + ' ' + stylesVideo.followStatus}><div className={styles.checkFollowIcon} />팔로잉</div>
                            </li>
                            :
                            <li className={stylesVideo.followBox}>
                                <div onClick={this.handleFollowSellever} className={styles.followBtn}>팔로우</div>
                            </li>
                        }
                    </ul>
                    {/*댓글 full screen version*/}
                    <div className={styles.fullScreen}>
                        {this.state.product ? <DetailComments productId={this.state.product.productId} /> : null}
                    </div>
                    {/*셀레버 영상 mobile screen*/}
                    <div className={stylesVideo.selleverVideoBox + ' ' + styles.mobileScreen}> {/* 셀레버 영상 부분 */}
                        <div className={stylesVideo.sideVideoTitle}>셀레버 영상</div>
                        <div className={stylesVideo.videoScrollBox}>
                            {selleverVideo}
                        </div>
                    </div>
                    {/*mobile version*/}
                    <div className={styles.mobileBtnBox}>
                        <div className={styles.mobileBtn}>
                            <div className={styles.btnBoxLeft}>
                                <div onClick={this.handleLike}
                                     className={(this.state.product && this.state.product.isLike ? styles.pinkHeartMobile : styles.whiteHeartMobile)}/>
                                <span>{this.state.product ? this.state.product.likeAmount : 0}</span>
                                <Link to={'/comment?productId=' + (this.state.product ? this.state.product.productId : '')} className={styles.commentImage}/>
                                <span>{this.state.commentTotal}</span>
                            </div>
                        </div>
                    </div>
                </div>
{/*
                <DetailContent productId={this.state.productId} selleverList={this.state.selleverList} hitList={this.state.hitList} />
*/}
                <div className={stylesVideo.detailContentBox}>
                    {/*fullscreen version 반응형일땐 안보이고 detailContent 안에서 보임*/}
                    <div className={stylesVideo.selleverVideoBox + ' ' + styles.fullScreen}> {/* 셀레버 영상 부분 */}
                        <div className={stylesVideo.sideVideoTitle}>셀레버 영상</div>
                        {selleverVideo}
                    </div>
                    <div className={stylesVideo.contentSIdeBox}> {/* 오른쪽 인기 동영상 */}
                        <div className={stylesVideo.sideVideoTitle}>인기 영상</div>
                        <div>
                            {hitVideo}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(Detail));