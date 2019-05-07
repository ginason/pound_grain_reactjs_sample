import React from 'react';
import {
    Link,
} from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


// Style
import styleComments from '../../Styles/Components/ContentList.css';
import styles from '../../Styles/App.css';

// Actions
import * as ActionProduct from "../../Data/Product/action";
import * as ActionComment from '../../Data/Comments/actions';
import * as ActionAuth from '../../Data/Authentification/actions';

// Utils
import * as DateUtil from '../../Lib/Utils/date';
import * as parseNumber from '../../Lib/Utils/parseNumber';
import * as parseUrlParameter from '../../Lib/Utils/parseUrlParameter';

class DetailComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            totalList: [],
            total: 0,
            parentTotal: 0,
            from: 0,
            count: 10,
            page: 1,
            comment: '',
            childComment: '',
        }
        this.goProfile = this.goProfile.bind(this);
        this.reset = this.reset.bind(this);
        this.getCommentList = this.getCommentList.bind(this);
        this.getCommentCount = this.getCommentCount.bind(this);
        this.getChildCommentList = this.getChildCommentList.bind(this);
        this.createComment = this.createComment.bind(this);
        this.handleNewComment = this.handleNewComment.bind(this);
        this.handleLike = this.handleLike.bind(this);
    }
    componentWillMount(){
        this.getCommentCount();
        setTimeout(() => {
            this.getCommentList();
        })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.search !== this.props.location.search) {
            this.reset();
        }
    }
    getCommentCount() {
        let urlParams = parseUrlParameter.parse(this.props.location.search);
        ActionComment.commentCount(urlParams.productId)
            .then((response) => {
                this.setState({
                    total: response.total,
                    parentTotal: response.count,
                })
            })
            .catch((err) => {});
    }
    getCommentList() {
        let urlParams = parseUrlParameter.parse(this.props.location.search);
        let params = {
            param: urlParams.productId,
            from: this.state.from,
            count: this.state.page * this.state.count,
        }
        ActionComment.commentList(params)
            .then((response) => {
                if (response.code === 200) {
                    this.setState({
                        list: [],
                        totalList: response.data.comments,
                        page: this.state.page + 1,
                    })
                    for (let i=0; i < response.data.comments.length; i++) {
                        if (response.data.comments[i].commentParentId === 0 || !response.data.comments[i].commentParentId) {
                            this.setState({
                                list: [...this.state.list, response.data.comments[i]],
                            });
                        }
                    }
                }
            })
            .catch((err) => {});
    }
    getChildCommentList(index) {
        if (this.state.list[index].isChildOpened) {
            let comment = this.state.list[index];
            let list = JSON.parse(JSON.stringify(this.state.list));
            comment.isChildOpened = false;
            list[index] = comment;
            this.setState({
                list: list,
            });
        } else {
            let urlParams = parseUrlParameter.parse(this.props.location.search);
            var params = {
                param: urlParams.productId,
                commentParentId: this.state.list[index].commentId,
            };
            ActionComment.commentList(params)
                .then((response) => {
                    if (response.code === 200) {
                        let comment = this.state.list[index];
                        let list = JSON.parse(JSON.stringify(this.state.list));
                        comment.childComments = response.data.comments;
                        comment.isChildOpened = true;
                        comment.newComment = "";
                        list[index] = comment;
                        this.setState({
                            list: list,
                        });
                    }
                })
                .catch((err) => {});
        }
    }
    reset() {
        this.setState({
            list: [],
            totalList: [],
            total: 0,
            parentTotal: 0,
            from: 0,
            count: 10,
            page: 1,
            comment: '',
            childComment: '',
        });
        setTimeout(() => {
            this.getCommentCount();
            setTimeout(() => {
                this.getCommentList();
            })
        }, 100);
    }
    goProfile(item) {
        let path;
        if (item.user && item.user.type == 2) {
            path = '/sellever?userId=';
        } else if (item.user && item.user.type == 0) {
            path = '/myhome?userId=';
        } else {
            alert('해당 유저의 정보를 찾을 수 없습니다.');
            return;
        }
        this.props.history.push(path + item.user.userId);
    }
    handleNewComment(e, index) {
        let newComment = this.state.list[index];
        let list = JSON.parse(JSON.stringify(this.state.list));
        newComment.newComment = e.target.value;
        list[index] = newComment;
        this.setState({list: list});
    }
    handleLike(item, index, parentIndex) {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }

        let childIndex;
        let params;
        if (parentIndex !== null && parentIndex !== undefined) {
            params = {
                param: item.commentId,
                delete: this.state.list[parentIndex].childComments[index].isLike,
            }
        } else {
            params = {
                param: item.commentId,
                delete: this.state.list[index].isLike,
            }
        }

        ActionComment.commentLike(params)
            .then((response) => {
                if (response.code === 200) {
                    let comment;
                    let list;
                    if (parentIndex !== null && parentIndex !== undefined) {
                        comment = this.state.list[parentIndex];
                        list = JSON.parse(JSON.stringify(this.state.list));
                        comment.childComments[index].isLike = !comment.childComments[index].isLike;
                        comment.childComments[index].likeAmount = response.data.count;
                        list[parentIndex] = comment;
                    } else {
                        comment = this.state.list[index];
                        list = JSON.parse(JSON.stringify(this.state.list));
                        comment.isLike = !comment.isLike;
                        comment.likeAmount = response.data.count;
                        list[index] = comment;
                    }
                    this.setState({list: list});
                }
            })
            .catch((err) => {
            });
    }
    createComment(comment, isChildComment, isDeleted) {
        if (!this.props.author || !this.props.author.user) {
            alert(ActionAuth.LOGIN_WARNING_MESSAGE);
            return;
        }
        let params;
        if (isChildComment) {
            if (comment.newComment) {
                params = {
                    productId: this.props.productId,
                    commentParentId: comment.commentId,
                    comment: comment.newComment,
                }
            } else {
                alert('댓글을 입력해주세요.');
            }
        } else {
            if (comment) {
                params = {
                    productId: this.props.productId,
                    comment: this.state.comment,
                }
            } else {
                alert('댓글을 입력해주세요.');
            }
        }
        ActionComment.createComment(params)
            .then((response) => {
                if (response.code === 200) {
                    this.reset();
                }
            })
            .catch((err) => {
                alert('데이터 처리 에러')
            });
    }
    render() {
        let commentChildList = (comment, parentIndex) => {
            return comment.childComments ? comment.childComments.map((item, index) => {
                return (
                    <div className={styleComments.childComment} key={index}>
                        <div className={styleComments.commentToggle} />
                        {/*fullscreen*/}
                        <div onClick={() => this.goProfile(item)} className={styleComments.commentUser + ' ' + styles.fullScreen} style={{ backgroundImage: 'url("' + (item.user && item.user.profileUrl ? item.user.profileUrl.replace('original', '80x80') : '') + '")'}}></div>
                        <div className={styleComments.commentInfo}>
                            <div className={styleComments.comment}>
                                {item.comment}
                            </div>
                            <div className={styleComments.userHistory}>
                                <span>{item.user.name}</span>
                                <span>
                                    { DateUtil.countDays(item.createdAt) > 0 ?
                                        (( DateUtil.countDays(item.createdAt) > 7 ? DateUtil.format('point', item.createdAt) : DateUtil.countDays(item.createdAt) + '일전')) :
                                        (DateUtil.format('LT', item.createdAt))
                                    }
                                </span>
                            </div>
                            {item.isLike ?
                                <div onClick={() => this.handleLike(item, index, parentIndex)} className={styleComments.likeBox + ' ' + styleComments.childLikeBox}>
                                    <div
                                         className={styleComments.commentLikeIcon + ' ' + styleComments.changeToPink}/>
                                    <span className={styleComments.changeToRed}>{item.likeAmount}</span>
                                </div>
                                :
                                <div onClick={() => this.handleLike(item, index, parentIndex)} className={styleComments.likeBox  + ' ' + styleComments.childLikeBox}>
                                    <div className={styleComments.commentLikeIcon} />
                                    <span>{parseNumber.numberWithCommas(item.likeAmount)}</span>
                                </div>
                            }
                        </div>
                    </div>
                );
            }) : null;
        };
        let commentChildInput = (item, index) => {
            return (
                <div className={styleComments.childComment}>
                    <div className={styleComments.commentToggle}/>
                    <div className={styleComments.childCommentInputBox}>
                        <input className={styleComments.childCommentInput} type={'text'} value={this.state.list[index].newComment} onChange={(e) => this.handleNewComment(e, index)} placeholder="댓글을 남겨보세요."/>
                        <span className={styleComments.border + ' ' + styles.fullScreen}>|</span>
                        <span onClick={() => this.createComment(item, true)} className={styleComments.commentSubmit}>등록</span>
                    </div>
                </div>
            );
        };
        let commentList = this.state.list.length > 0 ? this.state.list.map((item, index) => {
            return (
                <li className={styleComments.parentComment} key={index}>
                    <div onClick={() => this.goProfile(item)} className={styleComments.commentUser} style={{ backgroundImage: 'url("' + (item.user && item.user.profileUrl ? item.user.profileUrl.replace('original', '80x80') : '/assets/img/img_profile_default.png') + '")'}} />
                    <div className={styleComments.commentInfo}>
                        <div className={styleComments.comment}>
                            {item.comment}
                        </div>
                        <div className={styleComments.userHistory}>
                            <span>{item.user && item.user.name ? item.user.name : '이름없음'}</span>
                            <span>
                                { DateUtil.countDays(item.createdAt) > 0 ?
                                    (( DateUtil.countDays(item.createdAt) > 7 ? DateUtil.format('point', item.createdAt) : DateUtil.countDays(item.createdAt) + '일전')) :
                                    (DateUtil.format('LT', item.createdAt))
                                }</span>
                        </div>
                        <div className={styleComments.commentOthers}>
                            <div onClick={() => this.getChildCommentList(index)} className={styleComments.commentReply}>
                                <span>답글 {parseNumber.numberWithCommas(item.resCount)}</span>
                                <div className={styleComments.commentDropdownIcon} />
                            </div>
                            {item.isLike ?
                                <div onClick={() => this.handleLike(item, index)} className={styleComments.likeBox}>
                                    <div
                                         className={styleComments.commentLikeIcon + ' ' + styleComments.changeToPink}/>
                                    <span className={styleComments.changeToRed}>{parseNumber.numberWithCommas(item.likeAmount)}</span>
                                </div>
                                :
                                <div onClick={() => this.handleLike(item, index)} className={styleComments.likeBox}>
                                    <div className={styleComments.commentLikeIcon} />
                                    <span>{parseNumber.numberWithCommas(item.likeAmount)}</span>
                                </div>
                            }
                        </div>
                    </div>
                    { this.state.list[index].isChildOpened ? commentChildList(item, index) : null }
                    { this.state.list[index].isChildOpened ? commentChildInput(item, index) : null }
                </li>
            );
        }) : null;
        return (
            <div className={styleComments.detailCommentsBox}>
                <div className={styleComments.commentHeader}>
                    댓글 <span>{parseNumber.numberWithCommas(this.state.total)}</span>
                </div>
                <div className={styleComments.commentBody}>
                    <div className={styleComments.commentInputBox}>
                        <input className={styleComments.commentInput} value={this.state.comment} onChange={(e) => this.setState({ comment: e.target.value })} type={'text'} placeholder="댓글을 남겨보세요." />
                        <span className={styleComments.border + ' ' + styles.fullScreen}>|</span>
                        <span className={styleComments.commentSubmit} onClick={() => this.createComment(this.state.comment)}>등록</span>
                    </div>
                    <ul className={styleComments.commentBox}>
                        {commentList}
                    </ul>
                </div>
                {/* from + count >= list.length 일떄만 불러오도록 */}
                {
                    (this.state.page - 1) * this.state.count <= this.state.parentTotal ?
                        <div className={styles.fullScreen} onClick={this.getCommentList}>
                            <div className={styles.btn34White + ' ' + styleComments.moreBtn}>더보기</div>
                        </div>
                        :
                        null
                }
            </div>
    ); /*댓글갯수가 10개 이상일때 10개 이후로는 더보기*/
}
}
export default connect((state) => {
    return {
        author: state.data.auth.author,
    };
})(withRouter(DetailComments));
